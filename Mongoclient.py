from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")


# print(list(client.list_databases()))

# for i in list(client.list_databases()):
#     print(i['name'])

print(client.list_database_names())

database = client['ecommerce_demo']


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


for i,v in user_23.items():
    print(i,"=\n",user_23[i])


    
# for i,v in user_22.items():
#     print(i)
#     print(i.keys())
#     print(i.values())
