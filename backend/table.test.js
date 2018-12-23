var table = require('./generate');

console.log(table.STRAIGHT);

function testWheelStraight() { 
	let strength = table.computeHand(13, 1, 2, 3, 4);
	let passed = strength.strength == table.STRAIGHT;
	console.log(passed);
}

function test2HighStraight() { 
	let strength = table.computeHand(14, 1, 2, 3, 4);
	let passed = strength.strength == table.STRAIGHT;
	console.log(passed);
}


testWheelStraight();
test2HighStraight();