"""
You are given a string s. Your task is to determine if the string is a palindrome. A string is considered a palindrome if it reads the same forwards and backwards.

Examples :

Input: s = "abba"
Output: true
Explanation: "abba" reads the same forwards and backwards, so it is a palindrome.
Input: s = "abc" 
Output: false
Explanation: "abc" does not read the same forwards and backwards, so it is not a palindrome.

"""

s = "abc" 
news=[]
for i in s:
    news.append(i)
print(news)

news.reverse()
print(news)
new_str = ''.join(news)
print(new_str)

if s==new_str:
    print(True)
else:
    print(False)