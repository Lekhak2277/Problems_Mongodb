"""
Given a string s, convert the characters of the string into the opposite case, i.e., if a character is lowercase, then convert it into uppercase and vice versa. 

Examples:

Input: s = "geeksForgEeks"
Output: GEEKSfORGeEKS
Explanation: The cases of the characters in "geeksForgEeks" are flipped.

"""

s = "geeksForgEeks"
t = ''

for i in s:
    if i.isupper():
        t+=i.lower()
    else:
        t+=i.upper()
print(t)
