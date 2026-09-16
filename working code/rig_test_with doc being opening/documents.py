from datetime import datetime
import mongoengine 


from sys import implementation
from mongoengine import *
# from polars import Boolean
from userManagement.models import *
from django.db import models

from datetime import datetime
from django.utils import timezone
from django.db import models
from mongoengine.fields import GridFSProxy
from mongoengine import Document, StringField, DateTimeField, BooleanField

class RigTest(Document):
    type_of_testing = StringField(default = '')
    hw_sw = StringField(default = '')
    version = StringField(default = '')
    rig_date = DateTimeField()
    pil_no = StringField(default = '')
    observation = StringField(default = '')
    data_file_no = StringField(default = '')
    rig_test_description = StringField(default = '')
    created_date = DateTimeField(default=datetime.utcnow)
    file_url = ListField(StringField(), default=[])


    # report_upload_documents_id = StringField(default = '')      
    # last_updated_date = DateTimeField()
    # last_updated_user_name = StringField()


class RigTestAttachment(models.Model):
    # rig_test_id = models.TextField(blank=True, null=True)
    attachment_file = models.FileField(upload_to='Rig_Test/')
