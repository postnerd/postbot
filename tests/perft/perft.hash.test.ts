import { describe, expect, test } from "bun:test";

import Board from "../../src/board.js";

function perft(depth: number, board: Board) {
	if (depth === 0) {
		return 1;
	}

	let nodes = 0;
	const moves = board.getPossibleMoves(true);

	for (let i = 0; i < moves.length; i++) {
		board.makeMove(moves[i]);
		if (board.hash.getComputedHash(board)[0] !== board.hash.valueLow) {
			throw new Error(`Hash mismatch at depth ${depth} at make move ${Board.getFenMoveNotationFromMove(moves[i])}`);
		}
		nodes += perft(depth - 1, board);
		board.undoLastMove();
		if (board.hash.getComputedHash(board)[0] !== board.hash.valueLow) {
			throw new Error(`Hash mismatch at depth ${depth} at undo move ${Board.getFenMoveNotationFromMove(moves[i])}`);
		}
	}

	return nodes;
}

describe("Perft for start position", () => {
	const board = new Board(Board.startPosFen);

	test("Depth 1", () => {
		expect(perft(1, board)).toBe(20);
	});

	test("Depth 2", () => {
		expect(perft(2, board)).toBe(400);
	});

	test("Depth 5", () => {
		expect(perft(5, board)).toBe(4865609);
	});
});

describe("Perft for position 2", () => {
	const board = new Board("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - ");

	test("Depth 4", () => {
		expect(perft(4, board)).toBe(4085603);
	});
});

describe("Perft for position 3", () => {
	const board = new Board("8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1");

	test("Depth 4", () => {
		expect(perft(5, board)).toBe(674624);
	});
});

describe("Perft for position 4", () => {
	const board = new Board("r2q1rk1/pP1p2pp/Q4n2/bbp1p3/Np6/1B3NBn/pPPP1PPP/R3K2R b KQ - 0 1");

	test("Depth 4", () => {
		expect(perft(4, board)).toBe(422333);
	});
});

describe("Perft for position 5", () => {
	const board = new Board("rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8");

	test("Depth 4", () => {
		expect(perft(4, board)).toBe(2103487);
	});
});


describe("Perft for position 6", () => {
	const board = new Board("r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10");

	test("Depth 4", () => {
		expect(perft(4, board)).toBe(3894594);
	});
});
