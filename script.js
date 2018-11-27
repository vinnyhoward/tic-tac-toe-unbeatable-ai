let originalBoard;
let humanWins = 0;
let aiWins = 0;

const humanPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[ 0, 1, 2 ],
	[ 3, 4, 5 ],
	[ 6, 7, 8 ],
	[ 0, 3, 6 ],
	[ 1, 4, 7 ],
	[ 2, 5, 8 ],
	[ 0, 4, 8 ],
	[ 6, 4, 2 ]
];

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	document.querySelector('.ai-score').innerText = aiWins;
	document.querySelector('.human-score').innerText = humanWins;
	document.querySelector('.endgame').style.display = 'none';
	originalBoard = Array.from(Array(9).keys());

	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].style.removeProperty('box-shadow');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof originalBoard[square.target.id] === 'number') {
		turn(square.target.id, humanPlayer);
		if (!checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	originalBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	document.getElementById(squareId).style.background = '#7983ff';
	let gameWon = checkWin(originalBoard, player);

	if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
	let plays = board.reduce((acum, elem, idx) => (elem === player ? acum.concat(idx) : acum), []);
	let gameWon = null;

	for (let [ index, win ] of winCombos.entries()) {
		if (win.every((elem) => plays.indexOf(elem) > -1)) {
			gameWon = { index: index, player: player };

			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	gameWon.player == humanPlayer ? humanWins++ : aiWins++;
	for (let index of winCombos[gameWon.index]) {
		console.log('humans:', humanWins, 'ai:', aiWins);
		document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? 'blue' : '#56598a';
		document.getElementById(index).style.boxShadow =
			gameWon.player == humanPlayer ? 'inset 0 0 5px #00000012' : 'inset 0 0 10px #0000003b';
	}

	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player === humanPlayer ? 'You Win!' : aiGloating());
}

function aiGloating() {
	const gloating = [
		'AI takeover here we come',
		'AI schooled you boy',
		'First AI will takeover tic tac toe, then your job',
		'AI, Flawless Victory'
	];
	return gloating[Math.floor(Math.random() * gloating.length)];
}

function declareWinner(who) {
	document.querySelector('.endgame').style.display = 'block';
	document.querySelector('.endgame .text').innerText = who;
}

function emptySquares() {
	return originalBoard.filter((s) => typeof s === 'number');
}

function bestSpot() {
	return minMax(originalBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length === 0) {
		for (let i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = '#a7aada';
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner('Tie Game');
		return true;
	}
	return false;
}

function minMax(newBoard, player) {
	let availSpots = emptySquares();

	if (checkWin(newBoard, humanPlayer)) {
		return { score: -10 };
	} else if (checkWin(newBoard, aiPlayer)) {
		return { score: 10 };
	} else if (availSpots.length === 0) {
		return { score: 0 };
	}

	let moves = [];

	for (var i = 0; i < availSpots.length; i++) {
		let move = {};

		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player === aiPlayer) {
			var result = minMax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			var result = minMax(newBoard, aiPlayer);
			move.score = result.score;
		}
		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if (player === aiPlayer) {
		var bestScore = -1000;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 1000;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}

var btn = document.querySelector('.btn-start');

btn.onmousemove = function(e) {
	var x = e.pageX - btn.offsetLeft - btn.offsetParent.offsetLeft;
	var y = e.pageY - btn.offsetTop - btn.offsetParent.offsetTop;
	btn.style.setProperty('--x', x + 'px');
	btn.style.setProperty('--y', y + 'px');
};
