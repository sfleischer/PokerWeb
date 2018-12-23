
const HIGH_CARD = 0;
const PAIR = 1;
const TWO_PAIR = 2;
const THREE_OF_A_KIND = 3;
const STRAIGHT = 4;
const FLUSH = 5;
const FULL_HOUSE = 6;
const FOUR_OF_A_KIND = 7;
const STRAIGHT_FLUSH = 8;

const SPADE = 0;
const HEART = 1;
const CLUB = 2;
const DIAMOND = 3;

const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
const suits = ['♠', '♥', '♦', '♣'];
const strengths = ["HIGH_CARD", "PAIR", "TWO_PAIR", "THREE_OF_A_KIND", "STRAIGHT",
	"FLUSH", "FULL_HOUSE", "FOUR_OF_A_KIND", "STRAIGHT_FLUSH"];

function formatCard(card) {
	return ranks[card.rank] + suits[card.suit];
}

function getCard(index) {
	if (index > 51 || index < 0) {
		return {};
	}
	var rank = index % 13;
	var suit = (index - (index % 13)) / 13;
	return {
		"rank" : rank,
		"suit" : suit
	}
}

function formatHand(strength, rank, cards, kickers = []) {
	return {
		"strength" : strength,
		"rank" : rank,
		"kickers" : kickers,
		"cards" : cards
	}
}


function computeHand(i1, i2, i3, i4, i5) {
	var arr = [getCard(i1), getCard(i2), getCard(i3), getCard(i4), getCard(i5)];

	var flushCount = [0, 0, 0, 0];
	var rankCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	let cards = arr.map(formatCard);

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
				return formatHand(STRAIGHT_FLUSH, [highestStraight], cards);
			} else {
				var highest = 0;
				var kickers = [];
				for (var j = 0; j < rankCount.length; j++) {
					if (rankCount[j] > 0) {
						highest = j;
						kickers.push(j);
					}
				}
				return formatHand(FLUSH, [highest], cards, kickers);
			}
		}
	}

	// if its not a flush, then must be ordinary straight
	if (highestStraight != -1) {
		return formatHand(STRAIGHT, [highestStraight], cards);
	}

	// check quads, full house, 3 of a kind, two pair, pair
	var kickers = [];
	var strength = HIGH_CARD;
	var rank = -1;
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

	return formatHand(strength, rank, cards, kickers.reverse());
}

function DFS(c1, c2, c3, c4, c5, seen, arr) {
	if (c1 > 51 || c1 < 4 || c2 > 50 || c2 < 3 || c3 > 49 
		|| c3 < 2 || c4 > 48 || c4 < 1 || c5 > 47 || c5 < 0
		|| c1 <= c2 || c2 <= c3 || c3 <= c4 || c4 <= c5) {
		return;
	}
	var hand = (1 << c1) + (1 << c2) + (1 << c3) + (1 << c4) + (1 << c5);

	if (seen.hasOwnProperty(hand)) {
		return;
	}

	seen[hand] = 0;

	var handStrength = computeHand(c1, c2, c3, c4, c5);
	handStrength["hand"] = hand;
	arr.push(handStrength);

	DFS(c1 + 1, c2, c3, c4, c5, seen, arr);
	DFS(c1, c2 + 1, c3, c4, c5, seen, arr);
	DFS(c1, c2, c3 + 1, c4, c5, seen, arr);
	DFS(c1, c2, c3, c4 + 1, c5, seen, arr);
	DFS(c1, c2, c3, c4, c5 + 1, seen, arr);

}

function cmparray(a1, a2) {
	for(var i = 0; i < a1.length; i++) {
		if (a1[i] > a2[i]) {
			return 1;
		} else if (a1[i] < a2[i]) {
			return -1;
		}
	}
	return 0;
}

function compareHands(h1, h2) {
	if (h1.strength > h2.strength) {
		return 1;
	} else if (h1.strength == h2.strength) {
		if (cmparray(h1.rank, h2.rank) == 1) { // works for arrays
			return 1;
		} else if(cmparray(h1.rank, h2.rank) == 0) {
			return cmparray(h1.kickers, h2.kickers);
		}
	}
	return -1;
}


function generateTable() {
	var set = {};
	var arr = [];
	DFS(51, 49, 47, 46, 0, set, arr);

	var sorted = arr.sort(compareHands);

	//sorted.map(x => console.log("[" + x.cards + "] " + strengths[x.strength]));

	var index = 1;
	var table = {};	
	table[sorted[0].hand] = index;
	
	for (var i = 1; i < sorted.length; i++) {
		if (compareHands(sorted[i-1], sorted[i]) != 0) {
			index++;
		}
		table[sorted[i].hand] = index;
	}

	console.log(table)
}

function testWheelStraight() { 
	let strength = computeHand(12, 13, 1, 2, 3);
	console.log("[" + strength.cards + "] " + strengths[strength.strength] + "\r");
	let passed = strength.strength === STRAIGHT && strength.rank == 3;
	console.log(passed);
}

function test6HighStraight() { 
	let strength = computeHand(13, 1, 2, 3, 4);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength === STRAIGHT && strength.rank == 4;
	console.log(passed);
}

function testAHighStraight() { 
	let strength = computeHand(8, 9, 10, 11, 25);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength === STRAIGHT && strength.rank == 12;
	console.log(passed);
}

function testWheelStraightFlush() { 
	let strength = computeHand(12, 0, 1, 2, 3);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == STRAIGHT_FLUSH && strength.rank == 3;
	console.log(passed);
}

function test6HighStraightFlush() { 
	let strength = computeHand(0, 1, 2, 3, 4);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == STRAIGHT_FLUSH && strength.rank == 4;
	console.log(passed);
}

function testAHighStraightFlush() { 
	let strength = computeHand(8, 9, 10, 11, 12);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == STRAIGHT_FLUSH && strength.rank == 12;
	console.log(passed);
}

function testSpadeFlush() {
	let strength = computeHand(8, 9, 2, 4, 12);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == FLUSH && strength.rank == 12;
	console.log(passed);
}

function testHeartFlush() { // (13, 25)
	let strength = computeHand(24, 14, 15, 17, 23);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == FLUSH && strength.rank == 11;
	console.log(passed);
}

function testClubFlush() { // (26, 38)
	let strength = computeHand(26, 27, 28, 29, 31);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == FLUSH && strength.rank == 5;
	console.log(passed);
}

function testDiamondFlush() { // (39, 51)
	let strength = computeHand(45, 43, 42, 41, 39);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == FLUSH && strength.rank == 6;
	console.log(passed);
}

function testAQuads() { 
	let strength = computeHand(51, 38, 25, 12, 39);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == FOUR_OF_A_KIND && strength.rank == 12 && strength.kickers[0] == 0;
	console.log(passed);
}

function test2Quads() { 
	let strength = computeHand(39, 26, 13, 0, 24);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == FOUR_OF_A_KIND && strength.rank == 0 && strength.kickers[0] == 11;
	console.log(passed);
}

function testAOver2() {
	let strength = computeHand(51, 38, 25, 0, 39);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == FULL_HOUSE && strength.rank[0] == 12 && strength.rank[1] == 0;
	console.log(passed);
}

function test2OverA() {
	let strength = computeHand(51, 38, 13, 0, 39);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == FULL_HOUSE && strength.rank[0] == 0 && strength.rank[1] == 12;
	console.log(passed);
}

function testTripA() {
	let strength = computeHand(51, 38, 25, 4, 39);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == THREE_OF_A_KIND && strength.rank == 12 && strength.kickers[0] == 4;
	console.log(passed);
}

function testTrip2() {
	let strength = computeHand(0, 38, 27, 26, 39);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == THREE_OF_A_KIND && strength.rank == 0 && strength.kickers[0] == 12;
	console.log(passed);
}

function testTwoPair() {
	let strength = computeHand(51, 38, 27, 26, 39);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == TWO_PAIR && strength.rank[0] == 12 
		&& strength.rank[1] == 0 && strength.kickers[0] == 1;
	console.log(passed);
}

function testPairA() {
	let strength = computeHand(51, 38, 27, 26, 41);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == PAIR && strength.rank == 12 && strength.kickers[0] == 2;
	console.log(passed);
}

function testPair4() {
	let strength = computeHand(51, 37, 28, 26, 41);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == PAIR && strength.rank == 2 && strength.kickers[0] == 12;
	console.log(passed);
}

function testHighCard() { 
	let strength = computeHand(51, 37, 28, 26, 42);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == HIGH_CARD && strength.rank == -1 && strength.kickers[0] == 12;
	console.log(passed);
}

function testLowestCard() { 
	let strength = computeHand(0, 1, 2, 3, 18);
	console.log("[" + strength.cards + "] " + strengths[strength.strength]);
	let passed = strength.strength == HIGH_CARD && strength.rank == -1 && strength.kickers[0] == 5;
	console.log(passed);
}

function testHighCardCompare() { 
	var arr = [computeHand(12, 13, 1, 2, 4), computeHand(51, 11, 27, 26, 41), computeHand(12, 13, 1, 2, 5),
	computeHand(11, 13, 1, 2, 5), computeHand(11, 13, 14, 2, 6), computeHand(11, 13, 1, 2, 6)];
	var sorted = arr.sort(compareHands);
	sorted.map(x => console.log("[" + x.cards + "] " + strengths[x.strength] + " " + x.kickers));
}

function testPairCompare() { 
	var arr = [computeHand(12, 51, 1, 2, 4), computeHand(51, 12, 27, 26, 41), computeHand(12, 51, 1, 2, 5),
	computeHand(12, 51, 1, 2, 5), computeHand(51, 12, 14, 2, 6), computeHand(51, 12, 1, 2, 6)];
	var sorted = arr.sort(compareHands);
	sorted.map(x => console.log("[" + x.cards + "] " + strengths[x.strength] + " " + x.kickers));
}

function testTwoPairCompare() { 
	var arr = [computeHand(0, 13, 1, 14, 3), computeHand(0, 13, 1, 14, 4), computeHand(39, 13, 1, 14, 4),
	computeHand(0, 13, 2, 15, 5),  computeHand(1, 14, 2, 15, 5), computeHand(0, 13, 2, 15, 6)];
	var sorted = arr.sort(compareHands);
	sorted.map(x => console.log("[" + x.cards + "] " + strengths[x.strength] + " " + x.kickers));
}

function testFullHouseCompare() {
	var arr = [computeHand(0, 13, 1, 14, 26), computeHand(0, 13, 1, 14, 27), computeHand(0, 26, 1, 14, 27),
	computeHand(1, 14, 2, 15, 28), computeHand(0, 13, 2, 15, 26), computeHand(0, 13, 2, 15, 28)];
	var sorted = arr.sort(compareHands);
	sorted.map(x => console.log("[" + x.cards + "] " + strengths[x.strength] + " " + x.kickers));
}

function testStraightCompare() {
	var arr = [computeHand(13, 1, 2, 3, 4), computeHand(12, 11, 10, 9, 21), computeHand(14, 2, 3, 4, 5), 
	computeHand(15, 3, 4, 5, 6), computeHand(15, 16, 4, 5, 6)];
	var sorted = arr.sort(compareHands);
	sorted.map(x => console.log("[" + x.cards + "] " + strengths[x.strength] + " " + x.kickers));
}


function testFlushCompare() {
	var arr = [computeHand(0, 1, 2, 3, 5), computeHand(7, 9, 10, 11, 12), computeHand(2, 3, 4, 6, 7), 
	computeHand(1, 3, 4, 5, 6), computeHand(0, 1, 2, 3, 6), computeHand(1, 3, 4, 6, 7)];
	var sorted = arr.sort(compareHands);
	sorted.map(x => console.log("[" + x.cards + "] " + strengths[x.strength] + " " + x.kickers));
}

function testStraightFlushCompare() {
	var arr = [computeHand(0, 1, 2, 3, 4), computeHand(8, 9, 10, 11, 12), computeHand(2, 3, 4, 5, 6), 
	computeHand(13, 14, 15, 16, 17), computeHand(15, 16, 17, 18, 19)];
	var sorted = arr.sort(compareHands);
	sorted.map(x => console.log("[" + x.cards + "] " + strengths[x.strength] + " " + x.kickers));
}

function integreationCompare() {
	var arr = [computeHand(0, 1, 2, 3, 4), computeHand(8, 9, 10, 11, 12), computeHand(2, 3, 4, 5, 6), 
	computeHand(13, 14, 15, 16, 17), computeHand(15, 16, 17, 18, 19), computeHand(0, 1, 2, 3, 5), computeHand(7, 9, 10, 11, 12), computeHand(2, 3, 4, 6, 7), 
	computeHand(1, 3, 4, 5, 6), computeHand(0, 1, 2, 3, 6), computeHand(1, 3, 4, 6, 7), computeHand(13, 1, 2, 3, 4), computeHand(12, 11, 10, 9, 21), computeHand(14, 2, 3, 4, 5), 
	computeHand(15, 3, 4, 5, 6), computeHand(15, 16, 4, 5, 6), computeHand(0, 13, 1, 14, 26), computeHand(0, 13, 1, 14, 27), computeHand(0, 26, 1, 14, 27),
	computeHand(1, 14, 2, 15, 28), computeHand(0, 13, 2, 15, 26),computeHand(1, 14, 2, 15, 5), computeHand(12, 51, 1, 2, 4), computeHand(51, 12, 27, 26, 41), computeHand(12, 51, 1, 2, 5),
	computeHand(12, 51, 1, 2, 5), computeHand(51, 12, 14, 2, 6), computeHand(51, 12, 1, 2, 6), computeHand(12, 13, 1, 2, 4), computeHand(51, 11, 27, 26, 41), computeHand(12, 13, 1, 2, 5),
	computeHand(11, 13, 1, 2, 5), computeHand(11, 13, 14, 2, 6), computeHand(0, 13, 1, 14, 3), computeHand(0, 13, 1, 14, 4), computeHand(39, 13, 1, 14, 4),
	computeHand(0, 13, 2, 15, 5),  computeHand(1, 14, 2, 15, 5), computeHand(0, 13, 2, 15, 6)];
	//arr.map(x => console.log("[" + x.cards + "] " + strengths[x.strength] + " " + x.kickers));
	var sorted = arr.sort(compareHands);
	sorted.map(x => console.log("[" + x.cards + "] " + strengths[x.strength] + " " + x.kickers));
}

function runEvalTests() {
	testWheelStraight();
	test6HighStraight();
	testAHighStraight();
	testWheelStraightFlush();
	test6HighStraightFlush();
	testAHighStraightFlush();
	testSpadeFlush();
	testHeartFlush();
	testClubFlush();
	testDiamondFlush();
	testAQuads();
	test2Quads();
	testAOver2();
	testTripA();
	testTrip2();
	testTwoPair();
	testPairA();
	testPair4();
	testHighCard();
	testLowestCard();
	testHighCardCompare();
}

function runCompareTests() {
	testHighCardCompare();
	testPairCompare();
	testTwoPairCompare();
	testFullHouseCompare();
	testStraightCompare();
	testFlushCompare();
	testStraightFlushCompare();
}

integreationCompare();
