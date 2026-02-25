from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")


# print(list(client.list_databases()))

# for i in list(client.list_databases()):
#     print(i['name'])

# print(client.list_database_names())

database = client['ecommerce_demo']

db = client['ecommerce_demo']
# print(db.list_collection_names())



# print("==========================================================")
# print(database.create_collection("new_collection"))

# print(database.create_collection("new_collection_2"))

# print("==========================================================")


# print(database.list_collection_names())
# print("==========================================================")
# print(database.drop_collection("new_collection"))

# print("==========================================================")

# print(database.drop_collection("new_collection_2"))




user_22 = [i for i in database.users.find({'name':'User22'})]


user_23 = database.users.find_one({'name':'User23'})


# for i,v in user_23.items():
#     print(i,"=\n",user_23[i])


    
# for i,v in user_22.items():
#     print(i)
#     print(i.keys())
#     print(i.values())

# print(database.list_collection_names())


# print(database.drop_collection('new_collection_2'))
# print(database.drop_collection('new_collection'))

# print(database.list_collection_names())




# pipeline = [
#     {
#         "$lookup":
#         {
#             "from":"users",
#             "localField":"user_id",
#             "foreignField":"_id",
#             "as":"users"
#         },
#     },
#     {
#         "$unwind":"$users"
#     },
#     {
#         "$lookup":
#         {
#             "from":"roles",
#             "localField":"users.role_id",
#             "foreignField":"_id",
#             "as":"admin_data"
#         }
#     },
#     {
#         "$unwind":"$admin_data"
#     },
#     {
#         "$match":
#         {
#             "admin_data.name":"admin"
#         }
#     }

# ]







pipeline = [
    {
        "$lookup":
        {
            "from":"users",
            "localField":"user_id",
            "foreignField":"_id",
            "as":"users"
        },
    },
    {
        "$unwind":"$users"
    },
    {
        "$lookup":
        {
            "from":"roles",
            "localField":"users.role_id",
            "foreignField":"_id",
            "as":"admin_data"
        }
    },
    {
        "$unwind":"$admin_data"
    },
    {
        "$match":
        {
            "admin_data.name":"admin"
        }
    },
    {
        "$project":
        {
            "_id":0,
            "admin":"$admin_data.name",
            "city":1,
            "user_name":"$users.name"
        }
    },

]

result = list(db.addresses.aggregate(pipeline))
print(result)

print(result[0])

count = 0

for i in result:
    count+=1
    print(i)
    print(i.get('user_name'))
    print(i.get("city"))
    print(i["user_name"])
    print(i.get("city2","sixtytwo"))
    break
print(count)