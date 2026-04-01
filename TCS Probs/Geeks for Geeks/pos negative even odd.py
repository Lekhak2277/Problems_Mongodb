"""
Given a number n, the task is to check whether the given number is positive, negative, odd, even, or zero.

"""
n = int(input('enter'))

if n>=0:
    if n%2==0:
        print(f"The number {n} is positive and even")
    else:
        print(f"The number {n} is positive and odd")
else:
    print(f"{n} is negative")