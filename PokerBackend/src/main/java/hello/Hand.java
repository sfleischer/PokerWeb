package hello;
import java.util.ArrayList;

public class Hand implements Comparable<Hand>{
	final int strength;
	final int[] rank;
	final long hand;
	final Card[] cards;
	final int[] kickers;

	public static final int HIGH_CARD       = 1;
	public static final int PAIR            = 2;
	public static final int TWO_PAIR        = 3;
	public static final int THREE_OF_A_KIND = 4;
	public static final int STRAIGHT        = 5;
	public static final int FLUSH           = 6;
	public static final int FULL_HOUSE      = 7;
	public static final int FOUR_OF_A_KIND  = 8;
	public static final int STRAIGHT_FLUSH  = 9;

    Hand(int strength, int[] rank, long hand, Card[] cards, int[] kickers) {
        this.strength = strength;
        this.rank = rank;
        this.hand = hand;
        this.cards = cards;
        this.kickers = kickers;
    }

    private static int compareArrays(int[] here, int[] there) {
    	for(int i = 0; i < here.length; i++) {
    		if (here[i] > there[i]) {
    			return 1;
    		} else if(here[i] < there[i]) {
    			return -1;
    		}
    	}
    	return 0;
    }

    public int compareTo(Hand other) {
    	if (this.strength > other.strength) {
            return 1;
    	} else if (this.strength == other.strength) {
    		int cmp = compareArrays(this.rank, other.rank);
            if (cmp == 1) {
                return 1;
            } else if (cmp == 0) {
                return compareArrays(this.kickers, other.kickers);
            }
        }
        return -1;
    } 

    private static int[] reverse(int[] arr) {
    	for(int i = 0; i < arr.length / 2; i++){
		    int temp = arr[i];
		    arr[i] = arr[arr.length - i - 1];
		    arr[arr.length - i - 1] = temp;
		}
		return arr;
    }

    private static int[] getSingleton(int elem) {
    	int[] arr = new int[1];
    	arr[0] = elem;
    	return arr;
    }

    private static int[] getDoubleton(int e1, int e2) {
    	int[] arr = new int[2];
    	arr[0] = e1;
    	arr[1] = e2;
    	return arr;
    }

    public static Hand computeHand(int i1, int i2, int i3, int i4, int i5) {
    	Card[] arr = {new Card(i1), new Card(i2), new Card(i3), new Card(i4), new Card(i5)};

    	int[] flushCount = {0, 0, 0, 0};
    	int[] rankCount = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

    	long hand = (1L << i1) + (1L << i2) + (1L << i3) + (1L << i4) + (1L << i5);

	    for (int i = 0; i < arr.length; i++) {
	        rankCount[arr[i].rank] += 1;
	        flushCount[arr[i].suit] += 1;
	    }

	    // find straight
	    int scount = rankCount[12] > 0 ? 1 : 0; // for the wheel straight
	    int highestStraight = -1;
	    for(int i = 0; i < rankCount.length; i++) {
	        if (rankCount[i] > 0) {
	        	scount += 1;
	            if (scount >= 5) {
	                highestStraight = i;
	            }
	        } else {
	           scount = 0;     
	        }
	     }

	    // find flush
	    for (int i = 0; i < flushCount.length; i++) {
	        if (flushCount[i] >= 5) {
	            if (highestStraight != -1) {
	            	// if its a flush and straight, must be a straight flush
	                return new Hand(STRAIGHT_FLUSH, getSingleton(highestStraight), hand, arr, new int[0]);
	            } else {
	            	int highest = 0;
	                int[] kickers = new int[5];
	                int k = 0;
	                for (int j = 0; j < rankCount.length; j++){
	                    if (rankCount[j] > 0) { 
	                        highest = j;
	                        kickers[k++] = j;
	                    }
	                }
	                return new Hand(FLUSH, getSingleton(highest), hand, arr, reverse(kickers));
	            }
	        }  
	    }

	    // if its not a flush, then must be ordinary straight
	    if (highestStraight != -1){
	        return new Hand(STRAIGHT, getSingleton(highestStraight), hand, arr, new int[0]);
	    }

	    // check quads, full house, 3 of a kind, two pair, pair
	    ArrayList<Integer> kickers = new ArrayList<Integer>();
	    int strength = HIGH_CARD;
	    int[] rank = {-1};
	    for (int i = 0; i < rankCount.length; i++) {
	        if (rankCount[i] == 4) {
	        	strength = FOUR_OF_A_KIND;
	            rank[0] = i;
	        } else if(rankCount[i] == 3) {
	            if (strength == PAIR) {
	                strength = FULL_HOUSE;
	                rank = getDoubleton(i, rank[0]);
	            } else {
	                strength = THREE_OF_A_KIND;
	                rank[0] = i;
	            }
	        } else if (rankCount[i] == 2) {
	            if (strength == THREE_OF_A_KIND) {
	                strength = FULL_HOUSE;
	                rank = getDoubleton(rank[0], i);
	            } else if (strength == PAIR) {
	                strength = TWO_PAIR;
	                rank = getDoubleton(i, rank[0]);
	            } else {
	                strength = PAIR;
	                rank[0] = i;
	            }
	        } else if (rankCount[i] == 1){
	            kickers.add(i);
	        }
	    }

	    int[] revkickers = new int[kickers.size()];
	    for (int i = kickers.size() - 1; i >= 0; i--) {
	    	revkickers[kickers.size() - i - 1] = kickers.get(i);
	    }

	    return new Hand(strength, rank, hand, arr, revkickers);
	} 
}