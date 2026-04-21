def lcm(a,b):
    orig_a, orig_b = a, b   # keep originals
    while b != 0:
        a, b = b, a % b
    gcd = a                 # after loop, a holds GCD
    return (orig_a * orig_b) // gcd

def gcd(a,b):
    while b!=0:
        a,b=b,a%b
    return a

