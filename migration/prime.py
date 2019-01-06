from numpy import sqrt
def isPrime(n):
    for i in range(2, int(sqrt(n)) + 1):
        if n % i== 0 :
            return False
    return True

def printPrimesPower2():
    for i in range(30):
        for j in range(1 << i)[::-1]:
            if isPrime(j):
                print "base2: " + str(i) + " : " + str(j)
                break

printPrimesPower2()
