"""

Input: n = 122
Output: 221
Explanation: By reversing the digits of number, number will change into 221.

Input: n = 200
Output: 2
Explanation: By reversing the digits of number, number will change into 2.

Input: n = 12345 
Output: 54321
Explanation: By reversing the digits of number, number will change into 54321.


"""


"""
THIS INPUT IMPORTANT
Input: n = 200
Output: 2
Explanation: By reversing the digits of number, number will change into 2.
"""

n=200
# n=112
revd=0
while n>0:
    rem=n%10
    revd=revd*10+rem
    n=n//10
print(revd)
