from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")


# print(list(client.list_databases()))

# for i in list(client.list_databases()):
#     print(i['name'])

print(client.list_database_names())


database = client['ecommerce_demo']

hello = [i for i in database.users.find({'name':'User22'})]

print(hello)
