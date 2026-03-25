"""
Given an array arr[], check whether it is sorted in non-decreasing order. Return true if it is sorted otherwise false.

Examples:

Input: arr[] = [10, 20, 30, 40, 50]
Output: true
Explanation: The given array is sorted.
Input: arr[] = [90, 80, 100, 70, 40, 30]
Output: false
Explanation: The given array is not sorted.

"""

arr = [90, 80, 100, 70, 40, 30]
new_arr = sorted(arr)

for i in range(len(arr)-1):
    if new_arr[i]>new_arr[i+1]:
        print('not sorted')
        break
    