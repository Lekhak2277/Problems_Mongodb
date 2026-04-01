"""Given a number n, find the sum of its digits.

Examples : 

Input: n = 687
Output: 21
Explanation: The sum of its digits are: 6 + 8 + 7 = 21

Input: n = 12
Output: 3
Explanation: The sum of its digits are: 1 + 2 = 3"""

n=15

sum_d = 0
while n>0:
    rem = n%10
    sum_d+=rem
    n=n//10
print(sum_d)