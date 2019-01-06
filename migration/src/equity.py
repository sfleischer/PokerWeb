import pickle
import os 
from itertools import combinations
from player import Player
from hand import *

table = {}
path = os.path.join(os.path.dirname(__file__), '../resources/table5.txt')
with open(path) as f:
    serial_data = f.read()
    table = pickle.loads(serial_data)

print "loaded"

def compute_equity(players, draw=3, dead=[]):
    deck = range(52)
    for x in dead:
        deck.remove(x)
    for player in players:
        deck.remove(player.card1.index)
        deck.remove(player.card2.index)

    cmb = combinations(deck, draw)
    wins = [0] * len(players)
    ties = [0] * len(players)
    combos = 0
    while True:
        try:
            a = next(cmb)
        except StopIteration:
            break
        combos += 1
        highest = [0]
        strength = 0
        for i, player in enumerate(players):
            hand = player.hand
            for x in a :
                hand += (1 << x)
            val = table[hand]
            if val > strength:
                strength = val
                highest = [i]
            elif val == strength:
                highest.append(i)
        if len(highest) > 1:
            for x in highest:
                ties[x] += 1
        else :
            wins[highest[0]] += 1
    print combos
    return map(lambda x : (x[0]/float(combos), x[1]/float(combos)), zip(wins, ties))

def findHand(playerHand, a):
    cmb = combinations(range(7), 3)
    largest = 0
    for i in range(10):
        b = next(cmb)
        hand = playerHand + (1 << a[b[0]]) + (1 << a[b[1]]) + (1 << a[b[2]])
        val = table[hand]
        largest = max(largest, val)
    return largest



def compute_equity5(players, dead=[]):
    deck = range(52)
    for x in dead:
        deck.remove(x)
    for player in players:
        deck.remove(player.card1.index)
        deck.remove(player.card2.index)

    cmb = combinations(deck, 5)
    wins = [0] * len(players)
    ties = [0] * len(players)
    playerHands = map(lambda x : x.hand, players)
    combos = 0
    while True:
        try:
            a = next(cmb)
        except StopIteration:
            break
        combos += 1
        highest = [0]
        strength = 0
        for i, playerHand in enumerate(playerHands):
            val = findHand(playerHand, a)
            if val > strength:
                strength = val
                highest = [i]
            elif val == strength:
                highest.append(i)
        if len(highest) > 1:
            for x in highest:
                ties[x] += 1
        else :
            wins[highest[0]] += 1
    print combos
    return map(lambda x : (x[0]/float(combos), x[1]/float(combos)), zip(wins, ties))


players = [Player(Card(1), Card(2)), Player(Card(3), Card(4))]
print compute_equity5(players)



