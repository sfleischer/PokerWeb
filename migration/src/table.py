from itertools import combinations
from hand import Card, Hand, computeHand
import json
import pickle

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

    with open('table5.txt', 'w') as f:
        f.write(serial_data)


def generate7Table():
    table_data = str()
    with open('table5.txt', 'r') as f:
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

    with open('table7.txt', 'w') as f:
        f.write(serial_data)

generate7Table();
