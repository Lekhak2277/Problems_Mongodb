# def selection_sort_pairs(arr):
#     n = len(arr)
#     for i in range(n):
#         min_idx = i
#         for j in range(i+1, n):
#             # Compare first elements
#             if arr[j][0] < arr[min_idx][0]:
#                 min_idx = j
#             elif arr[j][0] == arr[min_idx][0]:
#                 # If first equal, compare second
#                 if arr[j][1] < arr[min_idx][1]:
#                     min_idx = j
#         # Swap
#         arr[i], arr[min_idx] = arr[min_idx], arr[i]
#     return arr

# # Input
# n = 5
# data = [(10,4), (3,2), (5,2), (3,1), (10,5)]

# sorted_data = selection_sort_pairs(data)
# for pair in sorted_data:
#     print(pair[0], pair[1])


n=int(input())
data = []

print(f"Enter {n} pairs (space-separated values, one pair per line):")
for i in range(n):
    # Read each line and split into two integers
    a = map(int, input().split())
    print(tuple(a))
    data.append(a)

print(data)


# THE LOGIC TO BE USED HERE
#IF FIRST ELEMENTS ARE SAME LIKE IN THIS CASE IT IS AUTOMATICALLY CHECKS THE SECOND ELEMENT
#BY DEFAULT NO NEED TO PUT ELSE CONDITION HERE

a=(3,4)
b=(3,5)
print(a if a<b else b)