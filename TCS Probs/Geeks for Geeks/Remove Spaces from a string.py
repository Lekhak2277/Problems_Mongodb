"""
Given a string s, remove all spaces from the string and return it. 

Examples:

Input:  s = "g  eeks   for ge  eeks  "
Output: "geeksforgeeks"

Input:  s = "abc d "
Output: "abcd"
"""

s = "g  eeks   for ge  eeks  "
spaces_removed=""
for char in s:
    if char!=" ":
        spaces_removed+=char
print(spaces_removed)