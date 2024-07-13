import { describe, expect, test } from "bun:test";

import Board from "../../src/board.ts";

const checks = [
	{ fen: "8/8/8/3k1b2/8/3KN3/8/8 w - - 0 1", result: true },
	{ fen: "8/8/8/1b1k4/8/3KN3/8/8 w - - 0 1", result: true },
	{ fen: "8/8/8/3k4/8/3KN3/8/1b6 w - - 0 1", result: true },
	{ fen: "8/8/8/3k4/8/3KN3/8/5b2 w - - 0 1", result: true },
	{ fen: "8/8/8/3k4/8/3KN3/4b3/8 w - - 0 1", result: true },
	{ fen: "8/8/6b1/1b1k4/4N3/3K4/8/8 w - - 0 1", result: true },
	{ fen: "8/8/6b1/3k4/4N3/3K4/8/8 w - - 0 1", result: false },
	{ fen: "8/8/6b1/1b1k4/2N1N3/3K4/8/8 w - - 0 1", result: false },
	{ fen: "8/8/8/3K1B2/8/3kn3/8/8 b - - 0 1", result: true },
	{ fen: "8/8/8/1B1K4/8/3kn3/8/8 b - - 0 1", result: true },
	{ fen: "8/8/8/3K4/8/3kn3/8/1B6 b - - 0 1", result: true },
	{ fen: "8/8/8/3K4/8/3kn3/8/5B2 b - - 0 1", result: true },
	{ fen: "8/8/8/3K4/8/3kn3/4B3/8 b - - 0 1", result: true },
	{ fen: "8/8/6B1/1B1K4/4n3/3k4/8/8 b - - 0 1", result: true },
	{ fen: "8/8/6B1/3K4/4n3/3k4/8/8 b - - 0 1", result: false },
	{ fen: "8/8/6B1/1B1K4/2n1n3/3k4/8/8 b - - 0 1", result: false },
];

describe("king is in check by bishop", () => {
	checks.forEach(check => {
		test(`bishop check ${check.fen}`, () => {
			const board = new Board(check.fen);

			expect(board.isCheck()).toBe(check.result);
		});
	});
});
