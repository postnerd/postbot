import Board from "./board";

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

export default function evaluate(board: Board): number {
	let score = 0;

	if (board.isCheckmate()) {
		if (board.activeColor === "white") return -10000;
		else return 10000;
	}

	board.squares.forEach((square) => {
		if (square.piece) score += PIECE_VALUES[square.piece];
	});

	return score;
}
