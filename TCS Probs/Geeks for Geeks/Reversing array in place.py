"""

Input: arr = [1, 4, 3, 2, 6, 5]
Output: [5, 6, 2, 3, 4, 1]

"""

# def revOriginalArray(arr):
#     j=len(arr)-1
#     for i in range(len(arr)):
#         j-=i
#         print(i,"       ",j)
#         arr[i],arr[j]=arr[j],arr[i]
#     return arr


# arr = [1, 4, 3, 2, 6, 5]

# res = revOriginalArray(arr)
# print(res)


#LOGIC FOR SWAPPING
# arr = [1, 4, 3, 2, 6, 5]

# j=len(arr)-1
# for i in range(len(arr)):
#     k=j-i
    # print(i,"       ",j,"             ",k)


def revOriginalArray(arr):
    j=len(arr)-1
    for i in range(len(arr)//2):
        k=j-i
        arr[i],arr[k]=arr[k],arr[i]
        
    return arr


arr = [1, 2, 3, 4, 5, 6]

res = revOriginalArray(arr)
print(res)