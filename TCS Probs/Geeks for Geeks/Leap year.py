"""
You are given an Integer n. Return true if It is a Leap Year otherwise return false.

Examples:

Input: n = 4
Output: true
Explanation: 4 is not divisible by 100 and is divisible by 4 so its a leap year
Input: n = 2021
Output: false
Explanation: 2021 is not divisible by 100 and is also not divisible by 4 so its not a leap year
Constraints:
1<= n < 104

"""

def checkYear (n):
        # code here
    if (n%4==0 and n%100!=0) or n%400==0:
        return True
            
    return False

n=2096
print(checkYear(n))
"""

logic is 2096 is leap year but not 2100 and 2200 these should not become as leap years so

the condition is the leap year is divisible by 4 but not 100 or it is divisible by 400 so 
which the number which can be divided by 4 should not be divisible by 100.
which is divisible by 400 it is leap
"""