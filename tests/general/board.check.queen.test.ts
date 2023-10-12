import Board from "../../src/board";

const checks = [
	{ fen: "8/8/8/3k4/3q4/8/4N3/3K4 w - - 0 1", result: true },
	{ fen: "8/8/8/3k4/8/8/4N3/q2K4 w - - 0 1", result: true },
	{ fen: "8/8/8/3k4/8/8/4N3/2qK4 w - - 0 1", result: true },
	{ fen: "8/8/8/3k4/8/8/4N3/3Kq3 w - - 0 1", result: true },
	{ fen: "8/8/8/3k4/8/8/4N3/3K3q w - - 0 1", result: true },
	{ fen: "3q4/8/8/3k4/8/8/4N3/3K4 w - - 0 1", result: false },
	{ fen: "8/8/8/3k4/3q4/8/3N4/3K4 w - - 0 1", result: false },
	{ fen: "8/8/8/3k4/3q4/8/3N4/3K3q w - - 0 1", result: true },
	{ fen: "8/8/8/3K4/3Q4/8/4n3/3k4 b - - 0 1", result: true },
	{ fen: "8/8/8/3K4/8/8/4n3/Q2k4 b - - 0 1", result: true },
	{ fen: "8/8/8/3K4/8/8/4n3/2Qk4 b - - 0 1", result: true },
	{ fen: "8/8/8/3K4/8/8/4n3/3kQ3 b - - 0 1", result: true },
	{ fen: "8/8/8/3K4/8/8/4n3/3k3Q b - - 0 1", result: true },
	{ fen: "3Q4/8/8/3K4/8/8/4n3/3k4 b - - 0 1", result: false },
	{ fen: "8/8/8/3K4/3Q4/8/3n4/3k4 b - - 0 1", result: false },
	{ fen: "8/8/8/3K4/3Q4/8/3n4/3k3Q b - - 0 1", result: true },
	{ fen: "8/8/8/3k4/q7/8/3N4/3K4 w - - 0 1", result: true },
	{ fen: "8/8/8/3k4/6q1/8/3N4/3K4 w - - 0 1", result: true },
	{ fen: "8/8/6q1/3k4/8/3K4/3N4/8 w - - 0 1", result: true },
	{ fen: "8/8/6q1/1q1k4/8/3K4/3N4/8 w - - 0 1", result: true },
	{ fen: "8/8/6q1/1q1k4/4N3/3K4/8/8 w - - 0 1", result: true },
	{ fen: "8/8/6q1/1q1k4/2N1N3/3K4/8/8 w - - 0 1", result: false },
	{ fen: "8/8/6q1/1q1k4/2N1N3/3K4/1q6/8 w - - 0 1", result: false },
	{ fen: "8/8/8/3K4/Q7/8/3n4/3k4 b - - 0 1", result: true },
	{ fen: "8/8/8/3K4/6Q1/8/3n4/3k4 b - - 0 1", result: true },
	{ fen: "8/8/6Q1/3K4/8/3k4/3n4/8 b - - 0 1", result: true },
	{ fen: "8/8/6Q1/1Q1K4/8/3k4/3n4/8 b - - 0 1", result: true },
	{ fen: "8/8/6Q1/1Q1K4/4n3/3k4/8/8 b - - 0 1", result: true },
	{ fen: "8/8/6Q1/1Q1K4/2n1n3/3k4/8/8 b - - 0 1", result: false },
	{ fen: "8/8/6Q1/1Q1K4/2n1n3/3k4/1q6/8 b - - 0 1", result: false },
];

describe("king is in check by queen", () => {
	checks.forEach(check => {
		test(`queen check ${check.fen}`, () => {
			const board = new Board(check.fen);

			expect(board.isCheck()).toBe(check.result);
		});
	});
});
