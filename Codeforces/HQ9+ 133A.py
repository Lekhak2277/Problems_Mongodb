while True:
    p=input()

    if any(c in ['H','Q','9','+'] for c in p):
        print('Yes')
    else:
        print('No')
