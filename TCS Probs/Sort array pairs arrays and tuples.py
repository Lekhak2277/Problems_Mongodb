def selection_sort_pairs(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            # Compare first elements
            if arr[j][0] < arr[min_idx][0]:
                min_idx = j
            elif arr[j][0] == arr[min_idx][0]:
                # If first equal, compare second
                if arr[j][1] < arr[min_idx][1]:
                    min_idx = j
        # Swap
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

# Input
n = 5
data = [(10,4), (3,2), (5,2), (3,1), (10,5)]

sorted_data = selection_sort_pairs(data)
for pair in sorted_data:
    print(pair[0], pair[1])