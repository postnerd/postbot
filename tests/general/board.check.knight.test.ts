import { describe, expect, test } from "bun:test";

import Board from "../../src/board.ts";

const checks = [
	{ fen: "3k4/8/4n3/8/3K4/8/8/8 w - - 0 1", result: true },
	{ fen: "3k4/8/2n5/8/3K4/8/8/8 w - - 0 1", result: true },
	{ fen: "3k4/8/8/1n6/3K4/8/8/8 w - - 0 1", result: true },
	{ fen: "3k4/8/8/8/3K4/1n6/8/8 w - - 0 1", result: true },
	{ fen: "3k4/8/8/8/3K4/8/2n5/8 w - - 0 1", result: true },
	{ fen: "3k4/8/8/8/3K4/8/4n3/8 w - - 0 1", result: true },
	{ fen: "3k4/8/8/8/3K4/5n2/8/8 w - - 0 1", result: true },
	{ fen: "3k4/8/8/5n2/3K4/8/8/8 w - - 0 1", result: true },
	{ fen: "3k4/8/3n4/8/3K4/8/8/8 w - - 0 1", result: false },
	{ fen: "3K4/8/4N3/8/3k4/8/8/8 b - - 0 1", result: true },
	{ fen: "3K4/8/2N5/8/3k4/8/8/8 b - - 0 1", result: true },
	{ fen: "3K4/8/8/1N6/3k4/8/8/8 b - - 0 1", result: true },
	{ fen: "3K4/8/8/8/3k4/1N6/8/8 b - - 0 1", result: true },
	{ fen: "3K4/8/8/8/3k4/8/2N5/8 b - - 0 1", result: true },
	{ fen: "3K4/8/8/8/3k4/8/4N3/8 b - - 0 1", result: true },
	{ fen: "3K4/8/8/8/3k4/5N2/8/8 b - - 0 1", result: true },
	{ fen: "3K4/8/8/5N2/3k4/8/8/8 b - - 0 1", result: true },
	{ fen: "3K4/8/3N4/8/3k4/8/8/8 b - - 0 1", result: false },
];

describe("king is in check by knight", () => {
	checks.forEach(check => {
		test(`knight check ${check.fen}`, () => {
			const board = new Board(check.fen);

			expect(board.isCheck()).toBe(check.result);
		});
	});
});
