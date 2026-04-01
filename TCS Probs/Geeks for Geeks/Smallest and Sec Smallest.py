"""
Input: arr[] = [12, 25, 8, 55, 10, 33, 17, 11]
Output: [8, 10]
Explanation: The smallest element is 1 and second smallest element is 10.

Input: arr[] = [2, 4, 3, 5, 6]
Output: [2, 3]
Explanation: 2 and 3 are respectively the smallest and second smallest elements in the array.

Input: arr[] = [1, 1, 1]
Output: [-1]
Explanation: Only element is 1 which is smallest, so there is no second smallest element.
        
"""
arr=[12, 25, 8, 55, 10, 33, 17, 11]
if len(arr)==1:
    print(arr[0])
else:
    arr.sort()
    print(arr)
    arr.pop()
    print(arr)
    print(arr[-1])

