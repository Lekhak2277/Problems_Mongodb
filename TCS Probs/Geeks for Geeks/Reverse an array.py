"""
Reverse an array arr[]. Reversing an array means rearranging the elements such that the first element becomes the last, the second element becomes second last and so on.

Examples:

Input: arr[] = [1, 4, 3, 2, 6, 5]  
Output:  [5, 6, 2, 3, 4, 1]
Explanation: The first element 1 moves to last position, the second element 4 moves to second-last and so on.

Input: arr[] = [4, 5, 1, 2]
Output: [2, 1, 5, 4]
Explanation: The first element 4 moves to last position, the second element 5 moves to second last and so on.

"""

# arr = [4, 5, 1, 2]

# n= len(arr)-1
# j = 0
# print(arr)
# for i in range(n,-1,-1):
#     if i<=j:
#         break
#     else:
#         arr[i],arr[j] = arr[j],arr[i]
#         j+=1

# print(arr)

def reverseArray( arr):
    # code here
    n=len(arr)//2
    last = len(arr)-1
    for i in range(n):
        arr[i],arr[last] = arr[last],arr[i]
        last-=1
    return arr
arr = [4, 5, 1, 2]
print(reverseArray(arr))