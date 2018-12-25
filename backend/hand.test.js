var {Card, Hand, computeHand, HIGH_CARD, PAIR, TWO_PAIR, 
	THREE_OF_A_KIND, STRAIGHT, FLUSH, FULL_HOUSE, FOUR_OF_A_KIND, STRAIGHT_FLUSH} = require('./hand');

test('Wheel straight', () => {
  let hand = computeHand(25, 1, 2, 3, 0);
  expect(hand.strength).toBe(STRAIGHT);
  expect(hand.rank).toEqual([3]);
});

test('6 high straight', () => {
	let hand = computeHand(18, 1, 2, 3, 4);
	expect(hand.strength).toBe(STRAIGHT);
	expect(hand.rank).toEqual([5]);
});

test('A high straight', () => {
	let hand = computeHand(8, 9, 10, 11, 25);
	expect(hand.strength).toBe(STRAIGHT);
	expect(hand.rank).toEqual([12]);
});

test('Wheel straight flush', () => {
	let hand = computeHand(12, 0, 1, 2, 3);
	expect(hand.strength).toBe(STRAIGHT_FLUSH);
	expect(hand.rank).toEqual([3]);
});

test('6 high straight flush', () => {
	let hand = computeHand(0, 1, 2, 3, 4);
	expect(hand.strength).toBe(STRAIGHT_FLUSH);
	expect(hand.rank).toEqual([4]);
});

test('A high straight flush', () => {
	let hand = computeHand(8, 9, 10, 11, 12);
	expect(hand.strength).toBe(STRAIGHT_FLUSH);
	expect(hand.rank).toEqual([12]);
});

test('Spade flush', () => {
	let hand = computeHand(8, 9, 2, 4, 12);
	expect(hand.strength).toBe(FLUSH);
	expect(hand.rank).toEqual([12]);
});

test('Heart flush', () => {
	let hand = computeHand(24, 14, 15, 17, 23);
	expect(hand.strength).toBe(FLUSH);
	expect(hand.rank).toEqual([11]);
});

test('Club flush', () => {
	let hand = computeHand(26, 27, 28, 29, 31);
	expect(hand.strength).toBe(FLUSH);
	expect(hand.rank).toEqual([5]);
});

test('Diamond flush', () => {
	let hand = computeHand(45, 43, 42, 41, 39);
	expect(hand.strength).toBe(FLUSH);
	expect(hand.rank).toEqual([6]);
});

test('A Quads', () => {
	let hand = computeHand(51, 38, 25, 12, 39);
	expect(hand.strength).toBe(FOUR_OF_A_KIND);
	expect(hand.rank).toEqual([12]);
	expect(hand.kickers).toEqual([0]);
});

test('2 Quads', () => {
	let hand = computeHand(39, 26, 13, 0, 24);
	expect(hand.strength).toBe(FOUR_OF_A_KIND);
	expect(hand.rank).toEqual([0]);
	expect(hand.kickers).toEqual([11]);
});

test('A over 2', () => {
	let hand = computeHand(51, 38, 25, 0, 39);
	expect(hand.strength).toBe(FULL_HOUSE);
	expect(hand.rank).toEqual([12, 0]);
});

test('2 over A', () => {
	let hand = computeHand(51, 38, 13, 0, 39);
	expect(hand.strength).toBe(FULL_HOUSE);
	expect(hand.rank).toEqual([0, 12]);
});

test('Trip A', () => {
	let hand = computeHand(51, 38, 25, 4, 39);
	expect(hand.strength).toBe(THREE_OF_A_KIND);
	expect(hand.rank).toEqual([12]);
	expect(hand.kickers).toEqual([4, 0]);
});

test('Trip 2', () => {
	let hand = computeHand(0, 38, 27, 26, 39);
	expect(hand.strength).toBe(THREE_OF_A_KIND);
	expect(hand.rank).toEqual([0]);
	expect(hand.kickers).toEqual([12, 1]);
});

test('Two Pair', () => {
	let hand = computeHand(51, 38, 27, 26, 39);
	expect(hand.strength).toBe(TWO_PAIR);
	expect(hand.rank).toEqual([12, 0]);
	expect(hand.kickers).toEqual([1]);
});

test('Pair A', () => {
	let hand = computeHand(51, 38, 27, 26, 41);
	expect(hand.strength).toBe(PAIR);
	expect(hand.rank).toEqual([12]);
	expect(hand.kickers).toEqual([2, 1, 0]);
});

test('Pair 4', () => {
	let hand = computeHand(51, 37, 28, 26, 41);
	expect(hand.strength).toBe(PAIR);
	expect(hand.rank).toEqual([2]);
	expect(hand.kickers).toEqual([12, 1, 0]);
});

test('High Card', () => {
	let hand = computeHand(51, 37, 28, 26, 42);
	expect(hand.strength).toBe(HIGH_CARD);
	expect(hand.rank).toEqual([-1]);
	expect(hand.kickers).toEqual([12, 11, 3, 2, 0]);
});

test('Low Card', () => {
	let hand = computeHand(0, 1, 2, 3, 18);
	expect(hand.strength).toBe(HIGH_CARD);
	expect(hand.rank).toEqual([-1]);
	expect(hand.kickers).toEqual([5, 3, 2, 1, 0]);
});

test('High Card Compare', () => {
	let hand = computeHand(0, 1, 2, 3, 18);
	expect(hand.strength).toBe(HIGH_CARD);
	expect(hand.rank).toEqual([-1]);
	expect(hand.kickers).toEqual([5, 3, 2, 1, 0]);
});


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

function integrationCompare() {
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

integrationCompare();