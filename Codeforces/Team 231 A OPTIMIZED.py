n = int(input())
count=0
for i in range(n):
    if sum(list(map(int,input().split())))>=2:
        count+=1
print(count)