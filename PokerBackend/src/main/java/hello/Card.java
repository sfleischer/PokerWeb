package hello;



class Card implements Comparable<Card>{
	final int rank;
	final int suit;
	final int index;

	static String[] ranks = {"2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"};
	static char[] suits = {'\u2660', '\u2665', '\u2666', '\u2663'};  //['♠', '♥', '♦', '♣'};

    Card(int index) {
        if(index > 51 || index < 0) {
            throw new IllegalArgumentException();
        }
        this.rank = index % 13;
        this.suit = index / 13;
        this.index = index;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Card card = (Card) o;
        return this.rank == card.rank
            && this.suit == card.suit;
    }

    @Override
    public int hashCode() {
    	return index;
    }

    @Override
    public int compareTo(Card other) {
        if (this.rank > other.rank) {
        	return 1;
        } else if (this.rank < other.rank) {
        	return -1;
        } else {
        	return 0;
        }
    }

    @Override
    public String toString() {
        return ranks[this.rank] + suits[this.suit];
    }

}