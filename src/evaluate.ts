import Board from "./board";
import { communicator, printBoardToConsole } from "./utils";

const PIECE_VALUES = {
	p: -100,
	n: -300,
	b: -300,
	r: -500,
	q: -900,
	k: -10000,
	P: 100,
	N: 300,
	B: 300,
	R: 500,
	Q: 900,
	K: 10000,
};

// Middle game white pawn table
const MG_WHITE_PAWN = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 50, 50, 50, 50, 50, 50, 50, 50, 0,
	0, 10, 25, 35, 35, 35, 35, 25, 10, 0,
	0, 5, 10, 15, 25, 25, 15, 10, 5, 0,
	0, 0, 0, 0, 20, 20, 0, 0, 0, 0,
	0, 5, -5, -10, 0, 0, -10, -5, 5, 0,
	0, 5, 10, 10, -10, -10, 10, 10, 5, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

// Middle game white knight table
const MG_WHITE_KNIGHT = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, -50, -40, -30, -30, -30, -30, -40, -50, 0,
	0, -40, -20,  0,  0,  0,  0, -20, -40, 0,
	0, -30,  0, 10, 15, 15, 10,  0, -30, 0,
	0, -30,  5, 15, 20, 20, 15,  5, -30, 0,
	0, -30,  0, 15, 20, 20, 15,  0, -30, 0,
	0, -30,  5, 10, 15, 15, 10,  5, -30, 0,
	0, -40, -20,  0,  5,  5,  0, -20, -40, 0,
	0, -50, -40, -30, -30, -30, -30, -40, -50, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

// Middle game white bishop table
const MG_WHITE_BISHOP = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, -20, -10, -10, -10, -10, -10, -10, -20, 0,
	0, -10,  0,  0,  0,  0,  0,  0, -10, 0,
	0, -10,  0,  5, 10, 10,  5,  0, -10, 0,
	0, -10,  5,  5, 10, 10,  5,  5, -10, 0,
	0, -10,  0, 10, 10, 10, 10,  0, -10, 0,
	0, -10, 10, 10, 10, 10, 10, 10, -10, 0,
	0, -10,  5,  0,  0,  0,  0,  5, -10, 0,
	0, -20, -10, -10, -10, -10, -10, -10, -20, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

// Middle game white rook table
const MG_WHITE_ROOK = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0,  0,  0,  0,  0,  0,  0,  0, 0,
	0, 5, 10, 10, 10, 10, 10, 10,  5, 0,
	0, -5,  0,  0,  0,  0,  0,  0, -5, 0,
	0, -5,  0,  0,  0,  0,  0,  0, -5, 0,
	0, -5,  0,  0,  0,  0,  0,  0, -5, 0,
	0, -5,  0,  0,  0,  0,  0,  0, -5, 0,
	0, -5,  0,  0,  0,  0,  0,  0, -5, 0,
	0, 0,  0,  0,  5,  5,  0,  0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

//	Middle game white queen table
const MG_WHITE_QUEEN = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, -20, -10, -10, -5, -5, -10, -10, -20, 0,
	0, -10,  0,  0,  0,  0,  0,  0, -10, 0,
	0, -10,  0,  5,  5,  5,  5,  0, -10, 0,
	0, -5,  0,  5,  5,  5,  5,  0, -5, 0,
	0,  0,  0,  5,  5,  5,  5,  0, -5, 0,
	0, -10,  5,  5,  5,  5,  5,  0, -10, 0,
	0, -10,  0,  5,  0,  0,  0,  0, -10, 0,
	0, -20, -10, -10, -5, -5, -10, -10, -20, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

//	Middle game white king table
const MG_WHITE_KING = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, -30, -40, -40, -50, -50, -40, -40, -30, 0,
	0, -30, -40, -40, -50, -50, -40, -40, -30, 0,
	0, -30, -40, -40, -50, -50, -40, -40, -30, 0,
	0, -30, -40, -40, -50, -50, -40, -40, -30, 0,
	0, -20, -30, -30, -40, -40, -30, -30, -20, 0,
	0, -10, -20, -20, -20, -20, -20, -20, -10, 0,
	0, 20, 20,  0,  0,  0,  0, 20, 20, 0,
	0, 20, 30, 10,  0,  0, 10, 30, 20, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

// TODO: Add endgame tables
const pieceValueTable = {
	"P": MG_WHITE_PAWN,
	"N": MG_WHITE_KNIGHT,
	"B": MG_WHITE_BISHOP,
	"R": MG_WHITE_ROOK,
	"Q": MG_WHITE_QUEEN,
	"K": MG_WHITE_KING,
	"p": MG_WHITE_PAWN.map(v => v * -1).reverse(),
	"n": MG_WHITE_KNIGHT.map(v => v * -1).reverse(),
	"b": MG_WHITE_BISHOP.map(v => v * -1).reverse(),
	"r": MG_WHITE_ROOK.map(v => v * -1).reverse(),
	"q": MG_WHITE_QUEEN.map(v => v * -1).reverse(),
	"k": MG_WHITE_KING.map(v => v * -1).reverse(),
};


export default function evaluate(board: Board): number {
	const hashedScore = board.hashTable.getScore(board.hash.valueLow, board.hash.valueHigh);
	if (hashedScore !== undefined) {
		return hashedScore;
	}

	let score = 0;

	if (board.isCheckmate()) {
		if (board.activeColor === "white") {
			board.hashTable.addScore(-10000, board.hash.valueLow, board.hash.valueHigh);
			return -10000;
		}
		else {
			board.hashTable.addScore(10000, board.hash.valueLow, board.hash.valueHigh);
			return 10000;
		}
	}

	// detect threefold repetition
	if (board.hashTable.getPositionCount(board.hash.valueLow, board.hash.valueHigh) === 3) {
		board.hashTable.addScore(0, board.hash.valueLow, board.hash.valueHigh);
		return 0;
	}

	for (let i = 21; i <= 98; i++) {
		const square = board.squares[i];

		if (square.piece) {
			score += PIECE_VALUES[square.piece];
			score += pieceValueTable[square.piece][i];
		}
	}

	// if (hashedScore !== undefined && score !== hashedScore) {
	// 	communicator.log(`Hash table score mismatch for ${board.hash.valueLow}: ${score} vs ${hashedScore}`);
	// 	printBoardToConsole(board);
	// }

	board.hashTable.addScore(score, board.hash.valueLow, board.hash.valueHigh);

	return score;
}
