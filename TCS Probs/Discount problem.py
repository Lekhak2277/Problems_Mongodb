n=int(input())

payable_amount=0

if n<1000:
    disc=(n/100)*5
    payable_amount=n-disc
elif n>=1000 and n<5000:
    disc=(n/100)*10
    payable_amount=n-disc
else:
    disc=(n/100)*15
    payable_amount=n-disc

print(payable_amount)