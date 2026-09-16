from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import HttpResponse, JsonResponse
import json
from userManagement.models import *
from userManagement.documents import *
from masterdata.documents import *
from schedule.documents import *
from workflow.documents import *
from django.core.paginator import Paginator
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from test_point_management.documents import TestPointStatus, TestPoint
from datetime import datetime
from debrief.serializer import *
from dashboard.josn_encoder import *
from mongoengine import Q
from debrief.common.general import *
from notifications.views import *
from notifications.models import *
from gridfs import GridFS
from pymongo import MongoClient
import pytz
import os
from datetime import datetime
from django.conf import settings
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
from bson import ObjectId
from .documents import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import utc
from dashboard.decorator import timing_decorator

# from .serializers import RigTestSerializer

db = settings.DB
collection = db["rig_tests"]


@login_required(login_url='/user-login/')
def pfr_add_test_rig_dashboard(request):
    # Fetch all rig tests from the collection
    rig_tests = list(collection.find({}))
    # Convert ObjectId to string and also add as 'id' for template usage
    for rig_test in rig_tests:
        rig_test['_id'] = str(rig_test['_id'])
        rig_test['id'] = rig_test['_id']

    # Also get user details for the template (if needed)
    user_basic_details_dict = get_user_basic_details_dict(request)
    role_dict = get_user_info_dict(request)

    context = {
        'rig_tests': rig_tests,
        'user_basic_details_dict': json.dumps(user_basic_details_dict),
        'role_dict': json.dumps(role_dict),
    }
    return render(request, 'rig_test/pfr_add_rig_test_dashboard.html', context)


def parse_date(date_str: str):
    """
    Accepts:
        * ISO‑8601 datetime string (e.g. 2026-04-27T14:30:00Z)
        * Plain date string     (YYYY-MM-DD)

    Returns a naive UTC `datetime` object or raises ValueError.
    """
    # Try ISO first
    try:
        return datetime.fromisoformat(date_str.replace("Z", "+00:00")).replace(tzinfo=None)
    except ValueError:
        pass

    # Fallback to plain date
    try:
        return datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError as exc:
        raise ValueError(f"Invalid date format: {date_str}") from exc


def required_field(data, field_name):
    """Raise a 400‑style error if a required key is missing or empty."""
    value = data.get(field_name)
    if value is None or (isinstance(value, str) and not value.strip()):
        raise ValueError(f"'{field_name}' is required.")
    return value


@api_view(['POST'])
@login_required(login_url='/user-login/')
@timing_decorator
def create_rig_test(request):
    """
    Persist a RigTest record + its attachments **without using a DRF Serializer**.

    Expected multipart/form‑data fields:
        type_of_testing           : string (required)
        hw_sw                     : string (optional)
        version                   : string (optional)
        rig_date                  : ISO or YYYY‑MM‑DD
        pil_no                    : string (optional)
        observation               : string (optional)
        data_file_no              : string (optional)
        rig_test_description      : string (may be blank)
        report_upload_documents_id: string   (MongoEngine ObjectId)
        attachments[]             : file(s) – any name
    """
    try:
        post = request.POST
        data_file = request.FILES

        type_of_testing          = required_field(post, 'type_of_testing')
        hw_sw                   = post.get('hw_sw', '').strip()
        version                 = post.get('version', '').strip()
        pil_no                  = post.get('pil_no', '').strip()
        observation             = post.get('observation', '').strip()
        data_file_no            = post.get('data_file_no', '').strip()

        rig_test_description    = post.get('rig_test_description', '')

        try:
            rig_date_obj = parse_date(post['rig_date'])
        except ValueError as exc:
            return JsonResponse(
                {"status": 400, "message": str(exc)}
            )

        doc = {
            "type_of_testing": type_of_testing,
            "hw_sw": hw_sw,
            "version": version,
            "rig_date": rig_date_obj,
            "pil_no": pil_no,
            "observation": observation,
            "data_file_no": data_file_no,
            "rig_test_description": rig_test_description,
            "created_date": datetime.utcnow(),
            "file_url":[]
        }


        for uploaded_file in data_file.getlist('attachments'):
            attachment = RigTestAttachment(
                attachment_file=uploaded_file
            )
            attachment.save()
            doc["file_url"].append(attachment.attachment_file.url)

        insert_result = collection.insert_one(doc)
        rig_test_id = str(insert_result.inserted_id)


        return Response({
            "status": 200,
            "message": "Rig Test created",
            "rig_test_id": rig_test_id,
            })

    except ValueError as e:
        return Response(
            {"status": 400, "message": str(e)})
    except Exception as exc:
        return Response(
            {"status": 500, "message": f"Server error: {exc}"})


@api_view(["GET"])
@timing_decorator
def get_rig_test_data(request):
    """
    Return *all* documents that live in the `rig_tests` collection.
    Uses bson.json_util.dumps() so no manual conversion is required.
    """
    try:
        raw_docs = list(collection.find({}))  # <-- fetch everything

        if not raw_docs:
            return Response(
                {"message": "No rig_test documents found."},
                status=200
            )

        for doc in raw_docs:
            doc['_id'] = str(doc['_id'])
            # Convert file_url array to attachment format similar to debrief
            if 'file_url' in doc and doc['file_url']:
                # Create attachment objects with file info
                doc['rig_test_uploads_info_lstofdct'] = []
                for i, url in enumerate(doc['file_url']):
                    # Extract filename from URL
                    filename = url.split('/')[-1]
                    doc['rig_test_uploads_info_lstofdct'].append({
                        'id': f"{doc['_id']}_file_{i}",
                        'file_name': filename,
                        'file_upload': url,
                        'file_grid': f"{doc['_id']}_file_{i}",
                        'viewable_in_browser': True
                    })
            else:
                doc['rig_test_uploads_info_lstofdct'] = []

        return Response(
            raw_docs,
            content_type="application/json",
            status=200,
        )
    except Exception as exc:
        return Response(
            {"status": 500, "message": f"Server error: {exc}"})


@api_view(['POST'])
@login_required(login_url='/user-login/')
@timing_decorator
def update_rig_test(request, rig_test_id):
    """
    Update a RigTest record
    """
    try:
        post = request.POST
        data_file = request.FILES

        type_of_testing          = required_field(post, 'type_of_testing')
        hw_sw                   = post.get('hw_sw', '').strip()
        version                 = post.get('version', '').strip()
        pil_no                  = post.get('pil_no', '').strip()
        observation             = post.get('observation', '').strip()
        data_file_no            = post.get('data_file_no', '').strip()

        rig_test_description    = post.get('rig_test_description', '')

        try:
            rig_date_obj = parse_date(post['rig_date'])
        except ValueError as exc:
            return JsonResponse(
                {"status": 400, "message": str(exc)}
            )

        update_doc = {
            "type_of_testing": type_of_testing,
            "hw_sw": hw_sw,
            "version": version,
            "rig_date": rig_date_obj,
            "pil_no": pil_no,
            "observation": observation,
            "data_file_no": data_file_no,
            "rig_test_description": rig_test_description,
            "updated_date": datetime.utcnow()
        }

        # Handle attachments if provided
        if 'attachments' in request.FILES:
            attachment_urls = []
            for uploaded_file in data_file.getlist('attachments'):
                attachment = RigTestAttachment(
                    attachment_file=uploaded_file
                )
                attachment.save()
                attachment_urls.append(attachment.attachment_file.url)

            # Get existing attachments
            existing_doc = collection.find_one({"_id": ObjectId(rig_test_id)})
            existing_urls = existing_doc.get("file_url", []) if existing_doc else []

            # Combine existing and new attachments
            update_doc["file_url"] = list(set(existing_urls + attachment_urls))  # Remove duplicates

        result = collection.update_one(
            {"_id": ObjectId(rig_test_id)},
            {"$set": update_doc}
        )

        if result.matched_count:
            return Response({
                "status": 200,
                "message": "Rig Test updated successfully",
            })
        else:
            return Response({
                "status": 404,
                "message": "Rig Test not found",
            }, status=404)

    except ValueError as e:
        return Response(
            {"status": 400, "message": str(e)})
    except Exception as exc:
        return Response(
            {"status": 500, "message": f"Server error: {exc}"})


@api_view(['DELETE'])
@login_required(login_url='/user-login/')
@timing_decorator
def delete_rig_test(request, rig_test_id):
    """
    Delete a RigTest record
    """
    try:
        result = collection.delete_one({"_id": ObjectId(rig_test_id)})

        if result.deleted_count:
            return Response({
                "status": 200,
                "message": "Rig Test deleted successfully",
            })
        else:
            return Response({
                "status": 404,
                "message": "Rig Test not found",
            }, status=404)

    except Exception as exc:
        return Response(
            {"status": 500, "message": f"Server error: {exc}"})


@login_required(login_url='/user-login/')
def pfr_dashboard(request):
    user_basic_details_dict = get_user_basic_details_dict(request)
    role_dict = get_user_info_dict(request)

    params = {
        'user_basic_details_dict': json.dumps(user_basic_details_dict),
        'role_dict': json.dumps(role_dict),
    }
    return render(request, 'debrief/pfr/01_pfr_dashboard.html')

