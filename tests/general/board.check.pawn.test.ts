import { describe, expect, test } from "bun:test";

import Board from "../../src/board.ts";

describe("King is in check by pawn", () => {
	test("pawn check for white king", () => {
		const board = new Board("3k4/8/8/2p5/3K4/8/8/8 w - - 0 1");

		expect(board.isCheck()).toBe(true);
	});

	test("pawn check for white king", () => {
		const board = new Board("3k4/8/8/4p3/3K4/8/8/8 w - - 0 1");

		expect(board.isCheck()).toBe(true);
	});

	test("no pawn check for white king", () => {
		const board = new Board("3k4/8/8/3p4/3K4/8/8/8 w - - 0 1");

		expect(board.isCheck()).toBe(false);
	});

	test("pawn check for black king", () => {
		const board = new Board("8/8/8/3k4/2P5/8/8/3K4 b - - 0 1");

		expect(board.isCheck()).toBe(true);
	});

	test("pawn check for black king", () => {
		const board = new Board("8/8/8/3k4/4P3/8/8/3K4 b - - 0 1");

		expect(board.isCheck()).toBe(true);
	});

	test("no pawn check for black king", () => {
		const board = new Board("8/8/8/3k4/3P4/8/8/3K4 b - - 0 1");

		expect(board.isCheck()).toBe(false);
	});
});
