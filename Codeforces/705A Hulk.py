"""

A. Hulk
time limit per test1 second
memory limit per test256 megabytes
Dr. Bruce Banner hates his enemies (like others don't). As we all know, he can barely talk when he turns into the incredible Hulk. That's why he asked you to help him to express his feelings.

Hulk likes the Inception so much, and like that his feelings are complicated. They have n layers. The first layer is hate, second one is love, third one is hate and so on...

For example if n = 1, then his feeling is "I hate it" or if n = 2 it's "I hate that I love it", and if n = 3 it's "I hate that I love that I hate it" and so on.

Please help Dr. Banner.

Input
The only line of the input contains a single integer n (1 ≤ n ≤ 100) — the number of layers of love and hate.

Output
Print Dr.Banner's feeling in one line.

Examples
InputCopy
1
OutputCopy
I hate it
InputCopy
2
OutputCopy
I hate that I love it
InputCopy
3
OutputCopy
I hate that I love that I hate it

"""

# def Hulk(n):
#     str_to_join = ''
#     for i in range(n+1):
#         if i==n:
#             str_to_join+=' it'
#             return str_to_join
#         else:
#             if i%2==0:
#                 str_to_join+=' I love'
#             else:
#                 str_to_join+=' I hate'
#         str_to_join+=' that '

        # elif i%2==0:
        #     str_to_join+=' I love'
        # else:
        #     str_to_join+=' I hate'
    
# print(Hulk(1))


def hulk(n):
    l_to_join=[]
    for i in range(1,n+1):
        if i%2==0:
            l_to_join.append('I love')
        else:
            l_to_join.append('I hate')
    return ' that '.join(l_to_join)+" it"

print(hulk(3))