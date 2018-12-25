const Combinatorics = require('js-combinatorics')
const fs = require('fs');
const {computeHand, Card, Hand} = require('./hand');

/**
* Iterates through C(52, 5) combinations and populates the arr parameter 
* with all possible poker hands.
* Input: The card indices
* Input: A seen array to prevent backtracking
* Input: The arr to append new hands to.
*/
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

// Range function taken from stack overflow
function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

/**
* Function that generates a table for indexing 5 card poker hands.
* It writes the table output to a file 'Table5.json'
*/
function generate5Table() {
	var set = {};
	var arr = [];

	//DFS(4, 3, 2, 1, 0, set, arr);

	cmb = Combinatorics.bigCombination(range(39), 5);
	while(a = cmb.next()) {
		var hand = computeHand(a[0], a[1], a[2], a[3], a[4]);
		arr.push(hand);
	}

	var sorted = arr.sort(Hand.compareHands);
	console.log(sorted.length)

	var index = 1;
	var table = {};	
	table[sorted[0].hand] = index;
	
	for (var i = 1; i < sorted.length; i++) {
		if (Hand.compareHands(sorted[i-1], sorted[i]) != 0) {
			index++;
		}
		table[sorted[i].hand] = index;
	}
	console.log(Object.keys(table).length)

	let data = JSON.stringify(table);

	fs.writeFile('Table5.json', data, (err) => { 
	    if (err) throw err; 
	}) 
}

/**
* Function that generates a table for indexing 6 card poker hands.
* The function requires 5 table to create the 6 table, and will create the
* 5 table if it already does not exist. It writes the table output to a 
file 'Table6.json'.
*/
function generate6Table() {
	var set = {};
	var arr = [];
	DFS(4, 3, 2, 1, 0, set, arr);

	cmb = Combinatorics.bigCombination(range(52), 5);
	while(a = cmb.next()) {
		var hand = computeHand(a[0], a[1], a[2], a[3], a[4]);
		arr.push(hand);
	}

	var sorted = arr.sort(Hand.compareHands);

	var index = 1;
	var table = {};	
	table[sorted[0].hand] = index;
	
	for (var i = 1; i < sorted.length; i++) {
		if (Hand.compareHands(sorted[i-1], sorted[i]) != 0) {
			index++;
		}
		table[sorted[i].hand] = index;
	}

	let data = JSON.stringify(table);

	fs.writeFile('Table5.json', data, (err) => { 
	    if (err) throw err; 
	}) 
}

generate5Table();

module.exports = {generate5Table, generate6Table};
