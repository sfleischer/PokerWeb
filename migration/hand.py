# -*- coding: utf-8 -*-

ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]
suits = ['\u2660', '\u2665', '\u2666', '\u2663']  #['♠', '♥', '♦', '♣'];

HIGH_CARD = 0;
PAIR = 1;
TWO_PAIR = 2;
THREE_OF_A_KIND = 3;
STRAIGHT = 4;
FLUSH = 5;
FULL_HOUSE = 6;
FOUR_OF_A_KIND = 7;
STRAIGHT_FLUSH = 8;

class Card :
    def __init__(self, index):
        if index > 51 or index < 0:
            raise ValueError
        self.rank = index % 13
        self.suit = index // 13
        self.index = index

    def __eq__(self, other) :
        return self.rank == other.rank and self.suit == other.suit

    def __cmp__(self, other) :
        return 1 if self.rank > other.rank else -1 if self.rank < other.rank else 0

    def __str__(self):
        return ranks[self.rank] + suits[self.suit]


class Hand :
    def __init__(self, strength, rank, hand, cards, kickers=[]):
        if strength < 0 or strength > 8:
            raise ValueError
        self.strength = strength
        self.rank = rank
        self.hand = hand
        self.cards = cards
        self.kickers = kickers

    def __cmp__(self, other) :
        """
        Function that compares two hands
        Input: Two hands to compare
        Returns: 1 if h1 is bigger, -1 if h1 is smaller, or 0 if they're equal
        """
        if self.strength > other.strength:
            return 1;
        elif self.strength == other.strength :
            if self.rank > other.rank :
                return 1;
            elif self.rank == other.rank :
                return 1 if self.kickers > other.kickers else -1 if self.kickers < other.kickers else 0;
        return -1;

    def __str__(self):
        return str(map(lambda i : str(i), self.cards)) + " " + str(self.kickers)

def computeHand(i1, i2, i3, i4, i5):
    """
    Factory method that returns the strength of a hand given five cards
    Input: The indices of the five cards. Must be valid indices (0 <= i <= 51) and all indices must be unique.
    Returns: A Hand object that indicates the strength, rank, and kickers for a hand
    """
    arr = [Card(i1), Card(i2), Card(i3), Card(i4), Card(i5)];

    flushCount = [0, 0, 0, 0];
    rankCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    hand = (1 << i1) + (1 << i2) + (1 << i3) + (1 << i4) + (1 << i5);

    cards = arr;

    for i in range(len(arr)):
        rankCount[arr[i].rank] += 1
        flushCount[arr[i].suit] += 1

    # find straight
    scount = 1 if rankCount[12] > 0 else 0; # for the wheel straight
    highestStraight = -1;
    for i in range(len(rankCount)) :
        if (rankCount[i] > 0) :
            scount += 1
            if (scount >= 5) :
                highestStraight = i
        else :
            scount = 0

    # find flush
    for i in range(len(flushCount)) :
        if (flushCount[i] >= 5) :
            if (highestStraight != -1) :
                # if its a flush and straight, must be a straight flush
                return Hand(STRAIGHT_FLUSH, [highestStraight], hand, cards)
            else :
                highest = 0
                kickers = []
                for j in range(len(rankCount)):
                    if rankCount[j] > 0: 
                        highest = j
                        kickers.append(j)
                return Hand(FLUSH, [highest], hand, cards, kickers[::-1]);

    # if its not a flush, then must be ordinary straight
    if highestStraight != -1 :
        return Hand(STRAIGHT, [highestStraight], hand, cards);

    # check quads, full house, 3 of a kind, two pair, pair
    kickers = [];
    strength = HIGH_CARD;
    rank = [-1];
    for i in range(len(rankCount)) :
        if rankCount[i] == 4 :
            strength = FOUR_OF_A_KIND
            rank = [i]
        elif rankCount[i] == 3 :
            if strength == PAIR :
                strength = FULL_HOUSE
                rank = [i, rank[0]]
            else :
                strength = THREE_OF_A_KIND
                rank = [i]
        elif rankCount[i] == 2 :
            if strength == THREE_OF_A_KIND :
                strength = FULL_HOUSE;
                rank = [rank[0], i];
            elif strength == PAIR :
                strength = TWO_PAIR
                rank = [i, rank[0]]
            else :
                strength = PAIR
                rank = [i]
        elif rankCount[i] == 1 :
            kickers.append(i)

    return Hand(strength, rank, hand, cards, kickers[::-1])