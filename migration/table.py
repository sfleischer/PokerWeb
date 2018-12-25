from itertools import combinations
from hand import Card, Hand, computeHand
import json
import pickle

# def DFS(c1, c2, c3, c4, c5, seen, arr) :
#   """
#   Iterates through C(52, 5) combinations and populates the arr parameter 
#   with all possible poker hands.
#   Input: The card indices
#   Input: A seen array to prevent backtracking
#   Input: The arr to append new hands to.
#   """
#   if (c1 > 51 || c1 < 4 || c2 > 50 || c2 < 3 || c3 > 49 
#       || c3 < 2 || c4 > 48 || c4 < 1 || c5 > 47 || c5 < 0
#       || c1 <= c2 || c2 <= c3 || c3 <= c4 || c4 <= c5) {
#       return;
#   }
#   var hand = (1 << c1) + (1 << c2) + (1 << c3) + (1 << c4) + (1 << c5);

#   if (seen.hasOwnProperty(hand)) {
#       return;
#   }

#   seen[hand] = 0;

#   var handStrength = computeHand(c1, c2, c3, c4, c5);
#   handStrength["hand"] = hand;
#   arr.push(handStrength);

#   DFS(c1 + 1, c2, c3, c4, c5, seen, arr);
#   DFS(c1, c2 + 1, c3, c4, c5, seen, arr);
#   DFS(c1, c2, c3 + 1, c4, c5, seen, arr);
#   DFS(c1, c2, c3, c4 + 1, c5, seen, arr);
#   DFS(c1, c2, c3, c4, c5 + 1, seen, arr);

# }

# // Range function taken from stack overflow
# function range(size, startAt = 0) {
#     return [...Array(size).keys()].map(i => i + startAt);
# }

def generate5Table() :
    """
    Function that generates a table for indexing 5 card poker hands.
    It writes the table output to a file 'Table5.json'
    """

    arr = []
    cmb = combinations(range(52), 5)
    while True:
        try:
            a = next(cmb)
        except StopIteration:
            break
        hand = computeHand(a[0], a[1], a[2], a[3], a[4])
        arr.append(hand)

    arr.sort()
    sorted = arr
    print len(sorted)

    index = 1
    table = {}
    table[sorted[0].hand] = index;
    
    for i in range(1, len(sorted)):
        if sorted[i-1].__cmp__(sorted[i]) != 0:
            index += 1
        table[sorted[i].hand] = index

    #data = json.dumps(table, indent=4)
    serial_data = pickle.dumps(table)

    f = open('table5.txt', 'w')
    f.write(serial_data)

def generate7Table():
    f = open('table5.txt', 'r')
    table_data = f.read();

    table = pickle.loads(table_data)
    answer = {}

    cmb = combinations(range(52), 7)
    while True:
        try:
            a = next(cmb)
        except StopIteration:
            break
        inter = combinations(a, 5);
        largest = 0
        for i in range(21):
            b = next(inter)
            hand = (1 << b[0]) + (1 << b[1]) + (1 << b[2]) + (1 << b[3]) + (1 << b[4])
            val = table[hand];
            largest = largest if val < largest else val

        board = (1 << a[0]) + (1 << a[1]) + (1 << a[2]) + (1 << a[3]) + (1 << a[4]) + (1 << a[5]) + (1 << a[6])
        answer[board] = largest

    serial_data = pickle.dumps(answer)

    f = open('table7.txt', 'w')
    f.write(serial_data)

generate7Table();
