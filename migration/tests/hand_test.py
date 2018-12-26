import unittest
from context import (Card, Hand, computeHand, HIGH_CARD, PAIR, TWO_PAIR,
THREE_OF_A_KIND, STRAIGHT, FLUSH, FULL_HOUSE, FOUR_OF_A_KIND, STRAIGHT_FLUSH)

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

def getIndex(rep):
    return base[rep[0]] + 13 * suit[rep[1]];

def generateHand(r1, r2, r3, r4, r5):
    return computeHand(getIndex(r1), getIndex(r2), getIndex(r3), getIndex(r4), getIndex(r5))

class TestComputeHandMethods(unittest.TestCase):

    def test_wheel_straight(self):
        hand = generateHand('As', '2d', '3d', '4d', '5d')
        self.assertEqual(hand.strength, STRAIGHT)
        self.assertEqual(hand.rank, [3])

    def test_6_high_straight(self):
        hand = generateHand('2d', '3d', '4d', '5d', '6s')
        self.assertEqual(hand.strength, STRAIGHT)
        self.assertEqual(hand.rank, [4])

    def test_wheel_straight_flush(self):
        hand = generateHand('Ad', '2d', '3d', '4d', '5d')
        self.assertEqual(hand.strength, STRAIGHT_FLUSH)
        self.assertEqual(hand.rank, [3])

    def test_6_high_straight_flush(self):
        hand = generateHand('2d', '3d', '4d', '5d', '6d')
        self.assertEqual(hand.strength, STRAIGHT_FLUSH)
        self.assertEqual(hand.rank, [4])

    def test_spade_flush(self):
        hand = generateHand('7s', '2s', '3s', '4s', '5s')
        self.assertEqual(hand.strength, FLUSH)
        self.assertEqual(hand.rank, [5])

    def test_diamond_flush(self):
        hand = generateHand('7d', 'Jd', 'Td', 'Ad', '4d')
        self.assertEqual(hand.strength, FLUSH)
        self.assertEqual(hand.rank, [12])

    def test_heart_flush(self):
        hand = generateHand('9h', 'Jh', 'Th', 'Ah', 'Qh')
        self.assertEqual(hand.strength, FLUSH)
        self.assertEqual(hand.rank, [12])

    def test_club_flush(self):
        hand = generateHand('7c', '6c', '5c', '4c', '2c')
        self.assertEqual(hand.strength, FLUSH)
        self.assertEqual(hand.rank, [5])

    def test_quad_A(self):
        hand = generateHand('Ah', 'Ad', 'Ac', 'As', '2c')
        self.assertEqual(hand.strength, FOUR_OF_A_KIND)
        self.assertEqual(hand.rank, [12])
        self.assertEqual(hand.kickers, [0])

    def test_quad_2(self):
        hand = generateHand('2h', '2d', '2c', '2s', '7c')
        self.assertEqual(hand.strength, FOUR_OF_A_KIND)
        self.assertEqual(hand.rank, [0])
        self.assertEqual(hand.kickers, [5])

    def test_A_over_2(self):
        hand = generateHand('Ah', 'Ad', 'Ac', '2s', '2c')
        self.assertEqual(hand.strength, FULL_HOUSE)
        self.assertEqual(hand.rank, [12, 0])

    def test_2_over_A(self):
        hand = generateHand('Ah', '2d', 'Ac', '2s', '2c')
        self.assertEqual(hand.strength, FULL_HOUSE)
        self.assertEqual(hand.rank, [0, 12])

    def test_trip_2(self):
        hand = generateHand('2h', '2d', '2c', '6s', '7c')
        self.assertEqual(hand.strength, THREE_OF_A_KIND)
        self.assertEqual(hand.rank, [0])
        self.assertEqual(hand.kickers, [5, 4])

    def test_trip_A(self):
        hand = generateHand('Ah', 'Ad', 'Ac', 'Js', '7c')
        self.assertEqual(hand.strength, THREE_OF_A_KIND)
        self.assertEqual(hand.rank, [12])
        self.assertEqual(hand.kickers, [9, 5])

    def test_two_pair_A_2(self):
        hand = generateHand('Ah', 'Ad', '2c', '2s', '7c')
        self.assertEqual(hand.strength, TWO_PAIR)
        self.assertEqual(hand.rank, [12, 0])
        self.assertEqual(hand.kickers, [5])

    def test_two_pair_J_7(self):
        hand = generateHand('Jh', '7d', 'Jc', '2s', '7c')
        self.assertEqual(hand.strength, TWO_PAIR)
        self.assertEqual(hand.rank, [9, 5])
        self.assertEqual(hand.kickers, [0])

    def test_pair_A(self):
        hand = generateHand('Ah', 'Ad', 'Jc', '2s', 'Kc')
        self.assertEqual(hand.strength, PAIR)
        self.assertEqual(hand.rank, [12])
        self.assertEqual(hand.kickers, [11, 9, 0])

    def test_pair_2(self):
        hand = generateHand('2h', 'Ad', 'Jc', '2s', 'Kc')
        self.assertEqual(hand.strength, PAIR)
        self.assertEqual(hand.rank, [0])
        self.assertEqual(hand.kickers, [12, 11, 9])

    def test_A_high(self):
        hand = generateHand('2h', 'Ad', 'Jc', '3s', 'Kc')
        self.assertEqual(hand.strength, HIGH_CARD)
        self.assertEqual(hand.rank, [-1])
        self.assertEqual(hand.kickers, [12, 11, 9, 1, 0])

    def test_7_high(self):
        hand = generateHand('7h', '5c', '4s', '3s', '2d')
        self.assertEqual(hand.strength, HIGH_CARD)
        self.assertEqual(hand.rank, [-1])
        self.assertEqual(hand.kickers, [5, 3, 2, 1, 0])


class TestCompareHandsMethods(unittest.TestCase):
    def test_straight_compare(self):
        lower = generateHand('As', '2d', '3d', '4d', '5d')
        higher = generateHand('2d', '3d', '4d', '5d', '6s')
        self.assertEqual(lower.__cmp__(higher), -1)
        self.assertEqual(higher.__cmp__(lower), 1)

    def test_straight_flush_compare(self):
        lower = generateHand('Ad', '2d', '3d', '4d', '5d')
        higher = generateHand('2d', '3d', '4d', '5d', '6d')
        self.assertEqual(lower.__cmp__(higher), -1)
        self.assertEqual(higher.__cmp__(lower), 1)

    def test_straight_flush_compare_sam(self):
        lower = generateHand('Ad', '2d', '3d', '4d', '5d')
        higher = generateHand('As', '2s', '3s', '4s', '5s')
        self.assertEqual(lower.__cmp__(higher), 0)
        self.assertEqual(higher.__cmp__(lower), 0)

    def test_flush_compare_different(self):
        lower = generateHand('Kd', '2d', '3d', '4d', 'Td')
        higher = generateHand('Ad', '3d', '4d', '5d', '6d')
        self.assertEqual(lower.__cmp__(higher), -1)
        self.assertEqual(higher.__cmp__(lower), 1)

    def test_flush_compare_similar(self):
        lower = generateHand('Kd', 'Td', '9d', '8d', '6d')
        higher = generateHand('Kd', 'Td', '9d', '8d', '7d')
        self.assertEqual(lower.__cmp__(higher), -1)
        self.assertEqual(higher.__cmp__(lower), 1)

    def test_flush_compare_same(self):
        lower = generateHand('Kd', 'Td', '9d', '8d', '6d')
        higher = generateHand('Ks', 'Ts', '9s', '8s', '6s')
        self.assertEqual(lower.__cmp__(higher), 0)
        self.assertEqual(higher.__cmp__(lower), 0)

    def test_quads_compare_different(self):
        lower = generateHand('Kd', 'Kd', 'Kh', 'Ks', '6d')
        higher = generateHand('Ad', 'Ad', 'Ah', 'As', '6d')
        self.assertEqual(lower.__cmp__(higher), -1)
        self.assertEqual(higher.__cmp__(lower), 1)

    def test_quads_compare_similar(self):
        lower = generateHand('Kd', 'Kd', 'Kh', 'Ks', '6d')
        higher = generateHand('Kd', 'Kd', 'Kh', 'Ks', '7d')
        self.assertEqual(lower.__cmp__(higher), -1)
        self.assertEqual(higher.__cmp__(lower), 1)

    def test_quads_compare_same(self):
        lower = generateHand('Kd', 'Kd', 'Kh', 'Ks', '6d')
        higher = generateHand('Kd', 'Kd', 'Kh', 'Ks', '6h')
        self.assertEqual(lower.__cmp__(higher), 0)
        self.assertEqual(higher.__cmp__(lower), 0)

    def test_trips_compare_different(self):
        lower = generateHand('Qd', 'Qd', 'Qh', '7s', '5d')
        higher = generateHand('Kd', 'Kd', 'Kh', '7s', '6h')
        self.assertEqual(lower.__cmp__(higher), -1)
        self.assertEqual(higher.__cmp__(lower), 1)

    def test_trips_compare_similar(self):
        lower = generateHand('Kd', 'Kd', 'Kh', '7s', '5d')
        higher = generateHand('Kd', 'Kd', 'Kh', '7s', '6h')
        self.assertEqual(lower.__cmp__(higher), -1)
        self.assertEqual(higher.__cmp__(lower), 1)

    def test_trips_compare_same(self):
        lower = generateHand('Kd', 'Kd', 'Kh', '7s', '5d')
        higher = generateHand('Kd', 'Ks', 'Kh', '7s', '5s')
        self.assertEqual(lower.__cmp__(higher), 0)
        self.assertEqual(higher.__cmp__(lower), 0)

    def test_full_house_compare(self):
        lower = generateHand('Qd', 'Qd', 'Qh', '7s', '7d')
        higher = generateHand('Kd', 'Kd', 'Kh', '7s', '7h')
        self.assertEqual(lower.__cmp__(higher), -1)
        self.assertEqual(higher.__cmp__(lower), 1)

    def test_full_house_compare_opposite(self):
        lower = generateHand('Qd', 'Qd', '7h', '7s', '7d')
        higher = generateHand('Qd', 'Qd', 'Qh', '7s', '7d')
        self.assertEqual(lower.__cmp__(higher), -1)
        self.assertEqual(higher.__cmp__(lower), 1)

    def test_full_house_compare_same(self):
        lower = generateHand('Qd', 'Qd', '7h', '7s', '7d')
        higher = generateHand('Qd', 'Qd', '7h', '7c', '7d')
        self.assertEqual(lower.__cmp__(higher), 0)
        self.assertEqual(higher.__cmp__(lower), 0)

    def test_two_pair_compare_different(self):
        lower = generateHand('Qd', 'Qd', '7h', '7s', '6d')
        higher = generateHand('Kd', 'Kd', 'Qh', 'Qs', '7d')
        self.assertEqual(lower.__cmp__(higher), -1)
        self.assertEqual(higher.__cmp__(lower), 1)

    def test_two_pair_compare_similar(self):
        lower = generateHand('Qd', 'Qd', '7h', '7s', '2d')
        higher = generateHand('Qd', 'Qd', '7h', '7s', '3d')
        self.assertEqual(lower.__cmp__(higher), -1)
        self.assertEqual(higher.__cmp__(lower), 1)

    def test_two_pair_compare_same(self):
        lower = generateHand('Qd', 'Qd', '7h', '7s', '2d')
        higher = generateHand('Qd', 'Qc', '7h', '7c', '2d')
        self.assertEqual(lower.__cmp__(higher), 0)
        self.assertEqual(higher.__cmp__(lower), 0)

    def test_pair_compare_different(self):
        lower = generateHand('Qd', 'Qd', '7h', '5s', '2d')
        higher = generateHand('Kd', 'Kc', '7h', '5c', '2d')
        self.assertEqual(lower.__cmp__(higher), -1)
        self.assertEqual(higher.__cmp__(lower), 1)

    def test_pair_compare_similar(self):
        lower = generateHand('Qd', 'Qd', '7h', '5s', '2d')
        higher = generateHand('Qd', 'Qc', '7h', '6c', '2d')
        self.assertEqual(lower.__cmp__(higher), -1)
        self.assertEqual(higher.__cmp__(lower), 1)

    def test_pair_compare_similar(self):
        lower = generateHand('Qd', 'Qd', '7h', '5s', '2d')
        higher = generateHand('Qd', 'Qc', '7h', '6c', '2d')
        self.assertEqual(lower.__cmp__(higher), -1)
        self.assertEqual(higher.__cmp__(lower), 1)

    def test_pair_compare_same(self):
        lower = generateHand('Qd', 'Qd', '7h', '5s', '2d')
        higher = generateHand('Qd', 'Qc', '7h', '5h', '2d')
        self.assertEqual(lower.__cmp__(higher), 0)
        self.assertEqual(higher.__cmp__(lower), 0)

    def test_high_card_compare_different(self):
        lower = generateHand('Kd', 'Qd', '7h', '5s', '2d')
        higher = generateHand('Ad', 'Qc', '7h', '6c', '2d')
        self.assertEqual(lower.__cmp__(higher), -1)
        self.assertEqual(higher.__cmp__(lower), 1)

    def test_high_card_compare_similar(self):
        lower = generateHand('Kd', 'Qd', '7h', '5s', '2d')
        higher = generateHand('Kd', 'Qc', '7h', '6c', '2d')
        self.assertEqual(lower.__cmp__(higher), -1)
        self.assertEqual(higher.__cmp__(lower), 1)

    def test_high_card_compare_same(self):
        lower = generateHand('Kd', 'Qd', '7h', '5s', '2d')
        higher = generateHand('Kd', 'Qc', '7h', '5c', '2d')
        self.assertEqual(lower.__cmp__(higher), 0)
        self.assertEqual(higher.__cmp__(lower), 0)




if __name__ == '__main__':
    unittest.main()