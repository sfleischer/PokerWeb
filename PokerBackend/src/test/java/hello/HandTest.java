package hello;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import java.util.*;

public class HandTest {

	HashMap<Character, Integer> base;
	HashMap<Character, Integer> suit;

	public HandTest() {
		base = new HashMap<Character, Integer>();
		base.put('2', 0);
		base.put('3', 1);
		base.put('4', 2);
		base.put('5', 3);
		base.put('6', 4);
		base.put('7', 5);
		base.put('8', 6);
		base.put('9', 7);
		base.put('T', 8);
		base.put('J', 9);
		base.put('Q', 10);
		base.put('K', 11);
		base.put('A', 12);

		suit = new HashMap<Character, Integer>();
		suit.put('s', 0);
		suit.put('h', 1);
		suit.put('d', 2);
		suit.put('c', 3);
	}

	int getIndex(String rep) {
	    return base.get(rep.charAt(0)) + 13 * suit.get(rep.charAt(1));
	}

	Hand generateHand(String r1, String r2, String r3, String r4, String r5) {
		return Hand.computeHand(getIndex(r1), getIndex(r2), getIndex(r3), getIndex(r4), getIndex(r5));
	}
    
	
	@Test
    public void test_wheel_straight() {
        Hand hand = generateHand("As", "2d", "3d", "4d", "5d");
        assertEquals(Hand.STRAIGHT, hand.strength);
        int[] expectedRank = {3};
        assertArrayEquals(expectedRank, hand.rank);
    }

	@Test
    public void test_6_high_straight() {
        Hand hand = generateHand("2d", "3d", "4d", "5d", "6s");
        assertEquals(Hand.STRAIGHT, hand.strength);
        int[] expectedRank = {4};
        assertArrayEquals(expectedRank, hand.rank);
    }

	@Test
    public void test_wheel_straight_flush() {
        Hand hand = generateHand("Ad", "2d", "3d", "4d", "5d");
        assertEquals(Hand.STRAIGHT_FLUSH, hand.strength);
        int[] expectedRank = {3};
        assertArrayEquals(expectedRank, hand.rank);
    }

	@Test
    public void test_6_high_straight_flush() {
        Hand hand = generateHand("2d", "3d", "4d", "5d", "6d");
        assertEquals(Hand.STRAIGHT_FLUSH, hand.strength);
        int[] expectedRank = {4};
        assertArrayEquals(expectedRank, hand.rank);
    }

	@Test
    public void test_royal_flush() {
        Hand hand = generateHand("Ad", "Kd", "Qd", "Jd", "Td");
        assertEquals(Hand.STRAIGHT_FLUSH, hand.strength);
        int[] expectedRank = {12};
        assertArrayEquals(expectedRank, hand.rank);
    }

	@Test
    public void test_spade_flush() {
        Hand hand = generateHand("7s", "2s", "3s", "4s", "5s");
        assertEquals(Hand.FLUSH, hand.strength);
        int[] expectedRank = {5};
        assertArrayEquals(expectedRank, hand.rank);
    }

    @Test
    public void test_diamond_flush() {
        Hand hand = generateHand("7d", "Jd", "Td", "Ad", "4d");
        assertEquals(Hand.FLUSH, hand.strength);
        int[] expectedRank = {12};
        assertArrayEquals(expectedRank, hand.rank);
    }

    @Test
    public void test_heart_flush() {
        Hand hand = generateHand("9h", "Jh", "Th", "Ah", "Qh");
        assertEquals(Hand.FLUSH, hand.strength);
        int[] expectedRank = {12};
        assertArrayEquals(expectedRank, hand.rank);
    }

    @Test
    public void test_club_flush() {
        Hand hand = generateHand("7c", "6c", "5c", "4c", "2c");
        assertEquals(Hand.FLUSH, hand.strength);
        int[] expectedRank = {5};
        assertArrayEquals(expectedRank, hand.rank);
    }

    @Test
    public void test_quad_A() {
        Hand hand = generateHand("Ah", "Ad", "Ac", "As", "2c");
        assertEquals(Hand.FOUR_OF_A_KIND, hand.strength);
        int[] expectedRank = {12};
        assertArrayEquals(expectedRank, hand.rank);
        int[] expectedKickers = {0};
        assertArrayEquals(expectedKickers, hand.kickers);
    }

    @Test
    public void test_quad_2() {
        Hand hand = generateHand("2h", "2d", "2c", "2s", "7c");
        assertEquals( Hand.FOUR_OF_A_KIND, hand.strength);
        int[] expectedRank = {0};
        assertArrayEquals(expectedRank, hand.rank);
        int[] expectedKickers = {5};
        assertArrayEquals(expectedKickers, hand.kickers);
    }

    @Test
    public void test_A_over_2() {
        Hand hand = generateHand("Ah", "Ad", "Ac", "2s", "2c");
        assertEquals(Hand.FULL_HOUSE, hand.strength);
        int[] expectedRank = {12, 0};
        assertArrayEquals(expectedRank, hand.rank);
    }

    @Test
    public void test_2_over_A() {
        Hand hand = generateHand("Ah", "2d", "Ac", "2s", "2c");
        assertEquals( Hand.FULL_HOUSE, hand.strength);
        int[] expectedRank = {0, 12};
        assertArrayEquals(expectedRank, hand.rank);
    }

    @Test
    public void test_trip_2() {
        Hand hand = generateHand("2h", "2d", "2c", "6s", "7c");
        assertEquals(Hand.THREE_OF_A_KIND, hand.strength);
        int[] expectedRank = {0};
        assertArrayEquals(expectedRank, hand.rank);
        int[] expectedKickers = {5, 4};
        assertArrayEquals(expectedKickers, hand.kickers);
    }

    @Test
    public void test_trip_A() {
        Hand hand = generateHand("Ah", "Ad", "Ac", "Js", "7c");
        assertEquals(Hand.THREE_OF_A_KIND, hand.strength);
        int[] expectedRank = {12};
        assertArrayEquals(expectedRank, hand.rank);
        int[] expectedKickers = {9, 5};
        assertArrayEquals(expectedKickers, hand.kickers);
    }

    @Test
    public void test_two_pair_A_2() {
        Hand hand = generateHand("Ah", "Ad", "2c", "2s", "7c");
        assertEquals(Hand.TWO_PAIR, hand.strength);
        int[] expectedRank = {12, 0};
        assertArrayEquals(expectedRank, hand.rank);
        int[] expectedKickers = {5};
        assertArrayEquals(expectedKickers, hand.kickers);
    }

    @Test
    public void test_two_pair_J_7() {
        Hand hand = generateHand("Jh", "7d", "Jc", "2s", "7c");
        assertEquals(Hand.TWO_PAIR, hand.strength);
        int[] expectedRank = {9, 5};
        assertArrayEquals(expectedRank, hand.rank);
        int[] expectedKickers = {0};
        assertArrayEquals(expectedKickers, hand.kickers);
    }

    @Test
    public void test_pair_A() {
        Hand hand = generateHand("Ah", "Ad", "Jc", "2s", "Kc");
        assertEquals(Hand.PAIR, hand.strength);
        int[] expectedRank = {12};
        assertArrayEquals(expectedRank, hand.rank);
        int[] expectedKickers = {11, 9, 0};
        assertArrayEquals(expectedKickers, hand.kickers);
    }

    @Test
    public void test_pair_2() {
        Hand hand = generateHand("2h", "Ad", "Jc", "2s", "Kc");
        assertEquals(Hand.PAIR, hand.strength);
        int[] expectedRank = {0};
        assertArrayEquals(expectedRank, hand.rank);
        int[] expectedKickers = {12, 11, 9};
        assertArrayEquals(expectedKickers, hand.kickers);
    }

    @Test
    public void test_A_high() {
        Hand hand = generateHand("2h", "Ad", "Jc", "3s", "Kc");
        assertEquals(Hand.HIGH_CARD, hand.strength);
        int[] expectedRank = {-1};
        assertArrayEquals(expectedRank, hand.rank);
        int[] expectedKickers = {12, 11, 9, 1, 0};
        assertArrayEquals(expectedKickers, hand.kickers);
    }

    @Test
    public void test_7_high() {
        Hand hand = generateHand("7h", "5c", "4s", "3s", "2d");
        assertEquals(Hand.HIGH_CARD, hand.strength);
        int[] expectedRank = {-1};
        assertArrayEquals(expectedRank, hand.rank);
        int[] expectedKickers = {5, 3, 2, 1, 0};
        assertArrayEquals(expectedKickers, hand.kickers);
    }

    @Test
    public void test_straight_compare() {
        Hand lower = generateHand("As", "2d", "3d", "4d", "5d");
        Hand higher = generateHand("2d", "3d", "4d", "5d", "6s");
        assertEquals(-1, lower.compareTo(higher));
        assertEquals(1, higher.compareTo(lower));
    }

	@Test
    public void test_straight_flush_compare() {
        Hand lower = generateHand("Ad", "2d", "3d", "4d", "5d");
        Hand higher = generateHand("2d", "3d", "4d", "5d", "6d");
        assertEquals(-1, lower.compareTo(higher));
        assertEquals(1, higher.compareTo(lower));
    }

	@Test
    public void test_straight_flush_compare_sam() {
        Hand lower = generateHand("Ad", "2d", "3d", "4d", "5d");
        Hand higher = generateHand("As", "2s", "3s", "4s", "5s");
        assertEquals(0, lower.compareTo(higher));
        assertEquals(0, higher.compareTo(lower));
    }

	@Test
    public void test_flush_compare_different() {
        Hand lower = generateHand("Kd", "2d", "3d", "4d", "Td");
        Hand higher = generateHand("Ad", "3d", "4d", "5d", "6d");
        assertEquals(-1, lower.compareTo(higher));
        assertEquals(1, higher.compareTo(lower));
    }

	@Test
    public void test_flush_compare_similar() {
        Hand lower = generateHand("Kd", "Td", "9d", "8d", "6d");
        Hand higher = generateHand("Kd", "Td", "9d", "8d", "7d");
        assertEquals(-1, lower.compareTo(higher));
        assertEquals(1, higher.compareTo(lower));
    }

	@Test
    public void test_flush_compare_same() {
        Hand lower = generateHand("Kd", "Td", "9d", "8d", "6d");
        Hand higher = generateHand("Ks", "Ts", "9s", "8s", "6s");
        assertEquals(0, lower.compareTo(higher));
        assertEquals(0, higher.compareTo(lower));
    }

	@Test
    public void test_quads_compare_different() {
        Hand lower = generateHand("Kd", "Kd", "Kh", "Ks", "6d");
        Hand higher = generateHand("Ad", "Ad", "Ah", "As", "6d");
        assertEquals(-1, lower.compareTo(higher));
        assertEquals(1, higher.compareTo(lower));
    }

	@Test
    public void test_quads_compare_similar() {
        Hand lower = generateHand("Kd", "Kd", "Kh", "Ks", "6d");
        Hand higher = generateHand("Kd", "Kd", "Kh", "Ks", "7d");
        assertEquals(-1, lower.compareTo(higher));
        assertEquals(1, higher.compareTo(lower));
    }

	@Test
    public void test_quads_compare_same() {
        Hand lower = generateHand("Kd", "Kd", "Kh", "Ks", "6d");
        Hand higher = generateHand("Kd", "Kd", "Kh", "Ks", "6h");
        assertEquals(0, lower.compareTo(higher));
        assertEquals(0, higher.compareTo(lower));
    }

	@Test
    public void test_trips_compare_different() {
        Hand lower = generateHand("Qd", "Qd", "Qh", "7s", "5d");
        Hand higher = generateHand("Kd", "Kd", "Kh", "7s", "6h");
        assertEquals(-1, lower.compareTo(higher));
        assertEquals(1, higher.compareTo(lower));
    }

	@Test
    public void test_trips_compare_similar() {
        Hand lower = generateHand("Kd", "Kd", "Kh", "7s", "5d");
        Hand higher = generateHand("Kd", "Kd", "Kh", "7s", "6h");
        assertEquals(-1, lower.compareTo(higher));
        assertEquals(1, higher.compareTo(lower));
    }

	@Test
    public void test_trips_compare_same() {
        Hand lower = generateHand("Kd", "Kd", "Kh", "7s", "5d");
        Hand higher = generateHand("Kd", "Ks", "Kh", "7s", "5s");
        assertEquals(0, lower.compareTo(higher));
        assertEquals(0, higher.compareTo(lower));
    }

	@Test
    public void test_full_house_compare() {
        Hand lower = generateHand("Qd", "Qd", "Qh", "7s", "7d");
        Hand higher = generateHand("Kd", "Kd", "Kh", "7s", "7h");
        assertEquals(-1, lower.compareTo(higher));
        assertEquals(1, higher.compareTo(lower));
    }

	@Test
    public void test_full_house_compare_opposite() {
        Hand lower = generateHand("Qd", "Qd", "7h", "7s", "7d");
        Hand higher = generateHand("Qd", "Qd", "Qh", "7s", "7d");
        assertEquals(-1, lower.compareTo(higher));
        assertEquals(1, higher.compareTo(lower));
    }

	@Test
    public void test_full_house_compare_same() {
        Hand lower = generateHand("Qd", "Qd", "7h", "7s", "7d");
        Hand higher = generateHand("Qd", "Qd", "7h", "7c", "7d");
        assertEquals(0, lower.compareTo(higher));
        assertEquals(0, higher.compareTo(lower));
    }

	@Test
    public void test_two_pair_compare_different() {
        Hand lower = generateHand("Qd", "Qd", "7h", "7s", "6d");
        Hand higher = generateHand("Kd", "Kd", "Qh", "Qs", "7d");
        assertEquals(-1, lower.compareTo(higher));
        assertEquals(1, higher.compareTo(lower));
    }

	@Test
    public void test_two_pair_compare_similar() {
        Hand lower = generateHand("Qd", "Qd", "7h", "7s", "2d");
        Hand higher = generateHand("Qd", "Qd", "7h", "7s", "3d");
        assertEquals(-1, lower.compareTo(higher));
        assertEquals(1, higher.compareTo(lower));
    }

	@Test
    public void test_two_pair_compare_same() {
        Hand lower = generateHand("Qd", "Qd", "7h", "7s", "2d");
        Hand higher = generateHand("Qd", "Qc", "7h", "7c", "2d");
        assertEquals(0, lower.compareTo(higher));
        assertEquals(0, higher.compareTo(lower));
    }

	@Test
    public void test_pair_compare_different() {
        Hand lower = generateHand("Qd", "Qd", "7h", "5s", "2d");
        Hand higher = generateHand("Kd", "Kc", "7h", "5c", "2d");
        assertEquals(-1, lower.compareTo(higher));
        assertEquals(1, higher.compareTo(lower));
    }

	@Test
    public void test_pair_compare_similar() {
        Hand lower = generateHand("Qd", "Qd", "7h", "5s", "2d");
        Hand higher = generateHand("Qd", "Qc", "7h", "6c", "2d");
        assertEquals(-1, lower.compareTo(higher));
        assertEquals(1, higher.compareTo(lower));
    }

	@Test
    public void test_pair_compare_same() {
        Hand lower = generateHand("Qd", "Qd", "7h", "5s", "2d");
        Hand higher = generateHand("Qd", "Qc", "7h", "5h", "2d");
        assertEquals(0, lower.compareTo(higher));
        assertEquals(0, higher.compareTo(lower));
    }

	@Test
    public void test_high_card_compare_different() {
        Hand lower = generateHand("Kd", "Qd", "7h", "5s", "2d");
        Hand higher = generateHand("Ad", "Qc", "7h", "6c", "2d");
        assertEquals(-1, lower.compareTo(higher));
        assertEquals(1, higher.compareTo(lower));
    }

	@Test
    public void test_high_card_compare_similar() {
        Hand lower = generateHand("Kd", "Qd", "7h", "5s", "2d");
        Hand higher = generateHand("Kd", "Qc", "7h", "6c", "2d");
        assertEquals(-1, lower.compareTo(higher));
        assertEquals(1, higher.compareTo(lower));
    }

	@Test
    public void test_high_card_compare_same() {
        Hand lower = generateHand("Kd", "Qd", "7h", "5s", "2d");
        Hand higher = generateHand("Kd", "Qc", "7h", "5c", "2d");
        assertEquals(0, lower.compareTo(higher));
        assertEquals(0, higher.compareTo(lower));
    }
}

