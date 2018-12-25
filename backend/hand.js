
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
const suits = ['♠', '♥', '♦', '♣'];

const HIGH_CARD = 0;
const PAIR = 1;
const TWO_PAIR = 2;
const THREE_OF_A_KIND = 3;
const STRAIGHT = 4;
const FLUSH = 5;
const FULL_HOUSE = 6;
const FOUR_OF_A_KIND = 7;
const STRAIGHT_FLUSH = 8;

class Card {
	constructor(index) {
		if (index > 51 || index < 0) {
			throw "Invalid Card Index";
		}
		this.rank = index % 13;
		this.suit = (index - (index % 13)) / 13;
		this.index = index;
	}

	toString() {
		return ranks[this.rank] + suits[this.suit];
	}
}

class Hand {

	constructor(strength, rank, hand, cards, kickers=[]) {
		if (strength < 0 || strength > 8) {
			throw "Invalid strength argument";
		}
		this.strength = strength;
		this.rank = rank;
		this.hand = hand;
		this.cards = cards;
		this.kickers = kickers;
	}

	/**
	* Helper function that compares arrays or scalars
	* Input: Two arrays to compare
	* Returns: 1 if a1 is bigger, -1 if a1 is smaller, or 0 if they're equal
	*/
	static cmparray(a1, a2) {
		for(var i = 0; i < a1.length; i++) {
			if (a1[i] > a2[i]) {
				return 1;
			} else if (a1[i] < a2[i]) {
				return -1;
			}
		}
		return 0;
	}

	/**
	* Function that compares two hands
	* Input: Two hands to compare
	* Returns: 1 if h1 is bigger, -1 if h1 is smaller, or 0 if they're equal
	*/
	static compareHands(h1, h2) {
		if (h1.strength > h2.strength) {
			return 1;
		} else if (h1.strength == h2.strength) {
			if (Hand.cmparray(h1.rank, h2.rank) == 1) { // works for arrays
				return 1;
			} else if(Hand.cmparray(h1.rank, h2.rank) == 0) {
				return Hand.cmparray(h1.kickers, h2.kickers);
			}
		}
		return -1;
	}

	toString() {
		return "[" + this.cards + "]";
	}
}

/**
* Factory method that returns the strength of a hand given five cards
* Input: The indices of the five cards. Must be valid indices (0 <= i <= 51) and
* 	all indices must be unique.
* Returns: A Hand object that indicates the strength, rank, and kickers for a hand
*/
function computeHand(i1, i2, i3, i4, i5) {
	var arr = [new Card(i1), new Card(i2), new Card(i3), new Card(i4), new Card(i5)];

	var flushCount = [0, 0, 0, 0];
	var rankCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	let hand = (1 << i1) + (1 << i2) + (1 << i3) + (1 << i4) + (1 << i5);

	let cards = arr;

	for (var i in arr) {
		rankCount[arr[i].rank]++;
		flushCount[arr[i].suit]++;
	}

	// find straight
	var scount = rankCount[12] > 0; // for the wheel straight
	var highestStraight = -1;
	for (var i = 0; i < rankCount.length; i++) {
		if (rankCount[i] > 0) {
			scount++;
			if (scount >= 5) {
				highestStraight = i;
			}
		} else {
			scount = 0;
		}
	}

	// find flush
	for (var i = 0; i < flushCount.length; i++) {
		if (flushCount[i] >= 5) {
			if (highestStraight != -1) {
				// if its a flush and straight, must be a straight flush
				return new Hand(STRAIGHT_FLUSH, [highestStraight], hand, cards);
			} else {
				var highest = 0;
				var kickers = [];
				for (var j = 0; j < rankCount.length; j++) {
					if (rankCount[j] > 0) {
						highest = j;
						kickers.push(j);
					}
				}
				return new Hand(FLUSH, [highest], hand, cards, kickers);
			}
		}
	}

	// if its not a flush, then must be ordinary straight
	if (highestStraight != -1) {
		return new Hand(STRAIGHT, [highestStraight], hand, cards);
	}

	// check quads, full house, 3 of a kind, two pair, pair
	var kickers = [];
	var strength = HIGH_CARD;
	var rank = [-1];
	for (var i = 0; i < rankCount.length; i++) {
		if (rankCount[i] == 4) {
			strength = FOUR_OF_A_KIND;
			rank = [i];
		} else if (rankCount[i] == 3) {
			if (strength == PAIR) {
				strength = FULL_HOUSE;
				rank = [i, rank[0]];
			} else {
				strength = THREE_OF_A_KIND;
				rank = [i];
			}
		} else if (rankCount[i] == 2) {
			if (strength == THREE_OF_A_KIND) { 
				strength = FULL_HOUSE;
				rank = [rank[0], i];
			} else if (strength == PAIR) {
				strength = TWO_PAIR;
				rank = [i, rank[0]];
			} else {
				strength = PAIR;
				rank = [i];
			}
		} else if (rankCount[i] == 1) {
			kickers.push(i);
		}
	}

	return new Hand(strength, rank, hand, cards, kickers.reverse());
}

module.exports = {Card, Hand, computeHand, HIGH_CARD, PAIR, TWO_PAIR, 
	THREE_OF_A_KIND, STRAIGHT, FLUSH, FULL_HOUSE, FOUR_OF_A_KIND, STRAIGHT_FLUSH}