"""

Given string s containing only lowercase characters, the task is to print the characters along with their frequency in the order of their occurrence and in the given format explained in the examples below.

Examples: 

Input: s = "geeksforgeeks"
Output: g2 e4 k2 s2 f1 o1 r1

Input: str = "elephant"
Output: e2 l1 p1 h1 a1 n1 t1

"""

s = "geeksforgeeks"

count = {}

for i in s:
    if i in count:
        count[i]+=1
    else:
        count[i]=1
print(count)

s = "geeksforgeeks"   # your string

# First, create the frequency count
count = {}
for i in s:
    if i in count:
        count[i] += 1
    else:
        count[i] = 1

result = ' '.join(f"{char}{freq}" for char, freq in count.items())

print(result + "git added to keep the incoming file and to see how to edit")
