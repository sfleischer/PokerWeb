import unittest
import pickle
import os
from context import computeHand

base = {
    "2" : 0,
    "3" : 1,
    "4" : 2,
    "5" : 3,
    "6" : 4,
    "7" : 5,
    "8" : 6,
    "9" : 7,
    "T" : 8,
    "J" : 9,
    "Q" : 10,
    "K" : 11,
    "A" : 12,
}

suit = {
    "s" : 0,
    "h" : 1,
    "d" : 2,
    "c" : 3
}

table = {}
path = os.path.join(os.path.dirname(__file__), '../resources/table5.txt')
with open(path) as f:
    serial_data = f.read()
    table = pickle.loads(serial_data)

def getIndex(rep):
    return base[rep[0]] + 13 * suit[rep[1]];

def generateHand(r1, r2, r3, r4, r5):
    hand = computeHand(getIndex(r1), getIndex(r2), getIndex(r3), getIndex(r4), getIndex(r5)).hand
    return table[hand]

class TestCompareTableHands(unittest.TestCase):

    def test_straight_compare(self):
        lower = generateHand('As', '2d', '3d', '4d', '5d')
        higher = generateHand('2d', '3d', '4d', '5d', '6s')
        self.assertTrue(lower < higher)

    def test_straight_flush_compare(self):
        lower = generateHand('Ad', '2d', '3d', '4d', '5d')
        higher = generateHand('2d', '3d', '4d', '5d', '6d')
        self.assertTrue(lower < higher)

    def test_straight_flush_compare_sam(self):
        lower = generateHand('Ad', '2d', '3d', '4d', '5d')
        higher = generateHand('As', '2s', '3s', '4s', '5s')
        self.assertEquals(lower, higher)

    def test_flush_compare_different(self):
        lower = generateHand('Kd', '2d', '3d', '4d', 'Td')
        higher = generateHand('Ad', '3d', '4d', '5d', '6d')
        self.assertTrue(lower < higher)

    def test_flush_compare_similar(self):
        lower = generateHand('Kd', 'Td', '9d', '8d', '6d')
        higher = generateHand('Kd', 'Td', '9d', '8d', '7d')
        self.assertTrue(lower < higher)

    def test_flush_compare_same(self):
        lower = generateHand('Kd', 'Td', '9d', '8d', '6d')
        higher = generateHand('Ks', 'Ts', '9s', '8s', '6s')
        self.assertEquals(lower, higher)

    def test_quads_compare_different(self):
        lower = generateHand('Kd', 'Kc', 'Kh', 'Ks', '6d')
        higher = generateHand('Ad', 'Ac', 'Ah', 'As', '6d')
        self.assertTrue(lower < higher)

    def test_quads_compare_similar(self):
        lower = generateHand('Kd', 'Kc', 'Kh', 'Ks', '6d')
        higher = generateHand('Kd', 'Kc', 'Kh', 'Ks', '7d')
        self.assertTrue(lower < higher)

    def test_quads_compare_same(self):
        lower = generateHand('Kd', 'Kc', 'Kh', 'Ks', '6d')
        higher = generateHand('Kd', 'Kc', 'Kh', 'Ks', '6h')
        self.assertEquals(lower, higher)

    def test_trips_compare_different(self):
        lower = generateHand('Qd', 'Qc', 'Qh', '7s', '5d')
        higher = generateHand('Kd', 'Kc', 'Kh', '7s', '6h')
        self.assertTrue(lower < higher)

    def test_trips_compare_similar(self):
        lower = generateHand('Kd', 'Kc', 'Kh', '7s', '5d')
        higher = generateHand('Kd', 'Kc', 'Kh', '7s', '6h')
        self.assertTrue(lower < higher)

    def test_trips_compare_same(self):
        lower = generateHand('Kd', 'Kc', 'Kh', '7s', '5d')
        higher = generateHand('Kd', 'Ks', 'Kh', '7s', '5s')
        self.assertEquals(lower, higher)

    def test_full_house_compare(self):
        lower = generateHand('Qd', 'Qc', 'Qh', '7s', '7d')
        higher = generateHand('Kd', 'Kc', 'Kh', '7s', '7h')
        self.assertTrue(lower < higher)

    def test_full_house_compare_opposite(self):
        lower = generateHand('Qd', 'Qc', '7h', '7s', '7d')
        higher = generateHand('Qd', 'Qc', 'Qh', '7s', '7d')
        self.assertTrue(lower < higher)

    def test_full_house_compare_same(self):
        lower = generateHand('Qd', 'Qc', '7h', '7s', '7d')
        higher = generateHand('Qd', 'Qc', '7h', '7c', '7d')
        self.assertEquals(lower, higher)

    def test_two_pair_compare_different(self):
        lower = generateHand('Qd', 'Qc', '7h', '7s', '6d')
        higher = generateHand('Kd', 'Kc', 'Qh', 'Qs', '7d')
        self.assertTrue(lower < higher)

    def test_two_pair_compare_similar(self):
        lower = generateHand('Qd', 'Qc', '7h', '7s', '2d')
        higher = generateHand('Qd', 'Qc', '7h', '7s', '3d')
        self.assertTrue(lower < higher)

    def test_two_pair_compare_same(self):
        lower = generateHand('Qd', 'Qc', '7h', '7s', '2d')
        higher = generateHand('Qd', 'Qc', '7h', '7c', '2d')
        self.assertEquals(lower, higher)

    def test_pair_compare_different(self):
        lower = generateHand('Qd', 'Qc', '7h', '5s', '2d')
        higher = generateHand('Kd', 'Kc', '7h', '5c', '2d')
        self.assertTrue(lower < higher)

    def test_pair_compare_similar(self):
        lower = generateHand('Qd', 'Qc', '7h', '5s', '2d')
        higher = generateHand('Qd', 'Qc', '7h', '6c', '2d')
        self.assertTrue(lower < higher)

    def test_pair_compare_similar(self):
        lower = generateHand('Qd', 'Qc', '7h', '5s', '2d')
        higher = generateHand('Qd', 'Qc', '7h', '6c', '2d')
        self.assertTrue(lower < higher)

    def test_pair_compare_same(self):
        lower = generateHand('Qd', 'Qc', '7h', '5s', '2d')
        higher = generateHand('Qd', 'Qc', '7h', '5h', '2d')
        self.assertEquals(lower, higher)

    def test_high_card_compare_different(self):
        lower = generateHand('Kd', 'Qd', '7h', '5s', '2d')
        higher = generateHand('Ad', 'Qc', '7h', '6c', '2d')
        self.assertTrue(lower < higher)

    def test_high_card_compare_similar(self):
        lower = generateHand('Kd', 'Qd', '7h', '5s', '2d')
        higher = generateHand('Kd', 'Qc', '7h', '6c', '2d')
        self.assertTrue(lower < higher)

    def test_high_card_compare_same(self):
        lower = generateHand('Kd', 'Qd', '7h', '5s', '2d')
        higher = generateHand('Kd', 'Qc', '7h', '5c', '2d')
        self.assertEquals(lower, higher)
