"""
Largest element in an Array
Last Updated : 30 Jan, 2026
Given an arr[] of elements of size n, return the largest element given in the array.

Examples:

Input: arr[] = [10, 20, 4]
Output: 20
Explanation: Among 10, 20 and 4, 20 is the largest. 

Input: arr[] = [20, 10, 20, 4, 100]
Output: 100

"""

def largest(arr):
    largest = arr[0]

    for i in range(len(arr)):
        if arr[i]>largest:
            largest=arr[i]

    return largest

arr = [20, 10, 20, 4, 100]
print(largest(arr))
