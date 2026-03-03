"""Input
The first line contains an integer n (1 ≤ n ≤ 100). Each of the following n lines contains one word. All the words consist of lowercase Latin letters and possess the lengths of from 1 to 100 characters.

Output
Print n lines. The i-th line should contain the result of replacing of the i-th word from the input data.

Examples
InputCopy
4
word
localization
internationalization
pneumonoultramicroscopicsilicovolcanoconiosis
OutputCopy
word
l10n
i18n
p43s

"""

#I WROTE THE BELOW CODE 

n = int(input())
ar = []
for i in range(n):
    a=input()
    ar.append(a)
print(ar)

for i in ar:
    if len(i)<10:
        print(i)
    else:
        mid = len(i)-2
        start= i[0]
        last=i[-1]
        ful_str=start+str(mid)+last
        print(ful_str)


