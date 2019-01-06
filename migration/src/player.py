from hand import *

class Player:
    def __init__(self, card1, card2):
        self.card1 = card1
        self.card2 = card2
        self.hand = (1 << card1.index) + (1 << card2.index)