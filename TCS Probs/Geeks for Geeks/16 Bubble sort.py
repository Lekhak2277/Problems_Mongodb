# def bubble_sort(arr):
#     n = len(arr)  # Get the number of elements in the array
    
#     # Outer loop for number of passes
#     for i in range(n):
        
#         # Inner loop for comparisons in each pass
#         # After each pass, the largest element goes to the end, so reduce the range
#         for j in range(0, n - i - 1):
            
#             # Compare adjacent elements
#             if arr[j] > arr[j + 1]:
#                 # If they are in the wrong order, swap them
#                 arr[j], arr[j + 1] = arr[j + 1], arr[j]

#     return arr

def bubble(arr):
    n=len(arr)
    for i in range(n):
        for j in range(0,n-i-1):
            if arr[j]>arr[j+1]:
                arr[j],arr[j+1]=arr[j+1],arr[j]
    return arr
arr = [5, 1, 4, 2, 8]
print(bubble(arr))