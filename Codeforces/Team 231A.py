"""The first input line contains a single integer n (1 ≤ n ≤ 1000) — the number of problems in the contest. Then n lines contain three integers each, each integer is either 0 or 1. If the first number in the line equals 1, then Petya is sure about the problem's solution, otherwise he isn't sure. The second number shows Vasya's view on the solution, the third number shows Tonya's view. The numbers on the lines are separated by spaces.

Output
Print a single integer — the number of problems the friends will implement on the contest."""


# b=[]
# c=[2,4,6]
# d = [6,7,8]
# print(b+c+d)
# e=b.append(d)
# f=b.append(c)
# print(b,'b=')


# g=[1,1,0]
# print(g.count(True),'g=================')

n = int(input())
b = []
for i in range(n):
    a=list(map(int,input().split()))
    b.append(a)

print(b)
count=0

for i in range(len(b)):
    if b[i].count(True)>=2:
        count+=1
    else:
        continue


    # if b.count(True)>=2:
    #     count+=1
    # else:
    #     continue
print(count)