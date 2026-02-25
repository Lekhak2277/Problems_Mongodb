pipeline = [
    {
        "$lookup": {
            "from": "users",
            "localField": "user_id",
            "foreignField": "_id",
            "as": "users"
        }
    },
    {
        "$unwind": {
            "path": "$users"
        }
    },
    {
        "$lookup": {
            "from": "roles",
            "localField": "users.role_id",
            "foreignField": "_id",
            "as": "admin_address"
        }
    },
    {
        "$unwind": {
            "path": "$admin_address"
        }
    },
    {
        "$match": {
            "admin_address.name": "admin"
        }
    },
    {
        "$project": {
            "_id": 0,
            "users._id": 0
        }
    }
]

result = list(db.addresses.aggregate(pipeline))

for doc in result:
    print(doc)




from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_admin_addresses(request):

    pipeline = [
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "users"
            }
        },
        {
            "$unwind": {
                "path": "$users"
            }
        },
        {
            "$lookup": {
                "from": "roles",
                "localField": "users.role_id",
                "foreignField": "_id",
                "as": "admin_address"
            }
        },
        {
            "$unwind": {
                "path": "$admin_address"
            }
        },
        {
            "$match": {
                "admin_address.name": "admin"
            }
        },
        {
            "$project": {
                "_id": 0,
                "users._id": 0
            }
        }
    ]

    result = list(db.addresses.aggregate(pipeline))

    return Response(result)