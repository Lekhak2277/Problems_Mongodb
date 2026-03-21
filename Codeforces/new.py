n=int(input('enter'))

lst_to_join=[]
odd = ' I hate '
even = ' I love '
for i in range(1,n+1):
    if i%2==0:
        lst_to_join.append(even)
    else:
        lst_to_join.append(odd)
        
print('that'.join(lst_to_join)+'it')

# print(lst_to_join)
        