
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

function getIndex(card) {
	return card.rank + card.suit * 13;
}

function DFS(c1, c2, c3, c4, c5, seen, arr, illegal) {
	if (c1 > 51 || c1 < 4 || c2 > 50 || c2 < 3 || c3 > 49 
		|| c3 < 2 || c4 > 48 || c4 < 1 || c5 > 47 || c5 < 0
		|| c1 <= c2 || c2 <= c3 || c3 <= c4 || c4 <= c5) {
		return;
	}
	if (illegal.hasOwnProperty(c1) || illegal.hasOwnProperty(c2) || illegal.hasOwnProperty(c3) 
		|| illegal.hasOwnProperty(c4) || illegal.hasOwnProperty(c5)) {
		return;
	}

	var hand = (1 << c1) + (1 << c2) + (1 << c3) + (1 << c4) + (1 << c5);

	if (seen.hasOwnProperty(hand)) {
		return;
	}

	seen[hand] = 0;
	arr.push([c1, c2, c3, c4, c5]);

	DFS(c1 + 1, c2, c3, c4, c5, seen, arr);
	DFS(c1, c2 + 1, c3, c4, c5, seen, arr);
	DFS(c1, c2, c3 + 1, c4, c5, seen, arr);
	DFS(c1, c2, c3, c4 + 1, c5, seen, arr);
	DFS(c1, c2, c3, c4, c5 + 1, seen, arr);
}

function selectHand(board, hole, table) {
	var texture = board.push(hole[0], hole[1]);
	var best = 0;
	var seen = {};
	function choose(c1, c2, c3, c4, c5) {
		if (c1 > 7 || c2 > 6 || c3 > 5 || c4 > 4 || c5 > 3 || 
			c1 < 4 || c2 < 3 || c3 < 2 || c4 < 1 || c5 < 0 ||
			c1 == c2 || c2 == c3 || c3 == c4 || c4 == c5) {
			return;
		}
		let i1 = texture[c1];
		let i2 = texture[c2];
		let i3 = texture[c3];
		let i4 = texture[c4];
		let i5 = texture[c5];
		let hash = (1 << i1) + (1 << i2) + (1 << i3) + (1 << i4) + (1 << i5);
		if (seen.hasOwnProperty(hash)) {
			return;
		}
		seen[hash] = 0;

		let score = table[hash];
		best = best > score ? best : score;
		choose(c1 + 1, c2, c3, c4, c5);
		choose(c1, c2 + 1, c3, c4, c5);
		choose(c1, c2, c3 + 1, c4, c5);
		choose(c1, c2, c3, c4 + 1, c5);
		choose(c1, c2, c3, c4, c5 + 1);
	}
	return best;
}

function calculate(holeCards) {
	var illegal = {};
	var table = {};
	for(var i = 0; i < holeCards.length; i++) {
		var card1 = holeCards[i][0];
		var card2 = holeCards[i][1];
		illegal[getIndex(card1)] = 0;
		illegal[getIndex(card2)] = 0;
	}

	var wins = new Array(holeCards.length);
	var combos = [];
	var seen = {};
	DFS(4, 3, 2, 1, 0, seen, combos, illegal);
	for(var i = 0; i < combos.length; i++) {
		for(var j = 0; j < holeCards.length; j++) {
			var board = combos[i];
		}
	}

}