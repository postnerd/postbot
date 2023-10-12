import Board from "../../src/board";

const checks = [
	{ fen: "8/8/8/3k4/3r4/8/4N3/3K4 w - - 0 1", result: true },
	{ fen: "8/8/8/3k4/8/8/4N3/r2K4 w - - 0 1", result: true },
	{ fen: "8/8/8/3k4/8/8/4N3/2rK4 w - - 0 1", result: true },
	{ fen: "8/8/8/3k4/8/8/4N3/3Kr3 w - - 0 1", result: true },
	{ fen: "8/8/8/3k4/8/8/4N3/3K3r w - - 0 1", result: true },
	{ fen: "3r4/8/8/3k4/8/8/4N3/3K4 w - - 0 1", result: false },
	{ fen: "8/8/8/3k4/3r4/8/3N4/3K4 w - - 0 1", result: false },
	{ fen: "8/8/8/3k4/3r4/8/3N4/3K3r w - - 0 1", result: true },
	{ fen: "8/8/8/3K4/3R4/8/4n3/3k4 b - - 0 1", result: true },
	{ fen: "8/8/8/3K4/8/8/4n3/R2k4 b - - 0 1", result: true },
	{ fen: "8/8/8/3K4/8/8/4n3/2Rk4 b - - 0 1", result: true },
	{ fen: "8/8/8/3K4/8/8/4n3/3kR3 b - - 0 1", result: true },
	{ fen: "8/8/8/3K4/8/8/4n3/3k3R b - - 0 1", result: true },
	{ fen: "3R4/8/8/3K4/8/8/4n3/3k4 b - - 0 1", result: false },
	{ fen: "8/8/8/3K4/3R4/8/3n4/3k4 b - - 0 1", result: false },
	{ fen: "8/8/8/3K4/3R4/8/3n4/3k3R b - - 0 1", result: true },
];

describe("king is in check by rook", () => {
	checks.forEach(check => {
		test(`rook check ${check.fen}`, () => {
			const board = new Board(check.fen);

			expect(board.isCheck()).toBe(check.result);
		});
	});
});
