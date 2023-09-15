import Board from "../src/board";
import { printBoardToConsole } from "../src/utils";

describe("Testing board move undo for simple pawn move", () => {
	let board = new Board(Board.startPosFen);
	const initialBoardHash = board.hash;

	test("Test move and undo", () => {
		board.makeMoveFromNotation("e2e4");
		board.undoLastMove();
		expect(board.hash).toBe(initialBoardHash);
		expect(initialBoardHash).toBe(board.hashTable.getComputedHash());
	});
});
// rnbqkbnr/ppppppp1/7p/4P3/8/8/PPPP1PPP/RNBQKBNR b KQkq f6 0 8
describe("Testing board move undo for en passant move white", () => {
	let board = new Board("rnbqkbnr/ppppp1p1/7p/4Pp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 4");
	const initialBoardHash = board.hash;

	test("Test move and undo", () => {
		board.makeMoveFromNotation("e5f6");
		board.undoLastMove();
		expect(board.hash).toBe(initialBoardHash);
		expect(initialBoardHash).toBe(board.hashTable.getComputedHash());
	});
});

describe("Testing board move undo for en passant move black", () => {
	let board = new Board("rnbqkbnr/pp1pp1p1/7p/4Pp2/PPpP4/8/2P2PPP/RNBQKBNR b KQkq d3 0 10");
	const initialBoardHash = board.hash;

	test("Test move and undo", () => {
		board.makeMoveFromNotation("c4d3");
		board.undoLastMove();
		expect(board.hash).toBe(initialBoardHash);
		expect(initialBoardHash).toBe(board.hashTable.getComputedHash());
	});
});

describe("Testing board move undo for capturing move", () => {
	let board = new Board("r1b1kbnr/pp1p2p1/2n1p2p/4Ppq1/PPpP4/5NP1/2P2P1P/RNBQKB1R w KQkq - 0 56");
	const initialBoardHash = board.hash;

	test("Test move and undo", () => {
		board.makeMoveFromNotation("f3g5");
		board.undoLastMove();
		expect(board.hash).toBe(initialBoardHash);
		expect(initialBoardHash).toBe(board.hashTable.getComputedHash());
	});
});

describe("Testing board move undo castling moves", () => {
	let board = new Board("r3k2r/pb1pb1p1/1pn1pn1p/4Ppq1/PPpP4/2N2NP1/1BPQBP1P/R3K2R w KQkq - 2 56");

	test("Test white castles king side", () => {
		const initialBoardHash = board.hash;

		board.makeMoveFromNotation("e1g1");
		board.undoLastMove();
		expect(board.hash).toBe(initialBoardHash);
		expect(initialBoardHash).toBe(board.hashTable.getComputedHash());
	});

	test("Test black castles king side", () => {
		board.makeMoveFromNotation("e1g1");

		const initialBoardHash = board.hash;
		board.makeMoveFromNotation("e8g8");
		board.undoLastMove();

		expect(board.hash).toBe(initialBoardHash);
		expect(initialBoardHash).toBe(board.hashTable.getComputedHash());
		board.undoLastMove();
	});

	test("Test white castles queen side", () => {
		const initialBoardHash = board.hash;

		board.makeMoveFromNotation("e1c1");
		board.undoLastMove();
		expect(board.hash).toBe(initialBoardHash);
		expect(initialBoardHash).toBe(board.hashTable.getComputedHash());
	});

	test("Test black castles queen side", () => {
		board.makeMoveFromNotation("e1g1");

		const initialBoardHash = board.hash;

		board.makeMoveFromNotation("e8c8");
		board.undoLastMove();
		expect(board.hash).toBe(initialBoardHash);
		expect(initialBoardHash).toBe(board.hashTable.getComputedHash());
	});
});

describe("Testing board move undo for promotion moves", () => {
	let board = new Board("2kr3r/pb1pb1P1/1Pn1p2p/5pq1/2pP4/2N2NP1/1pPQBP1P/R4RK1 w - - 0 56");
	const initialBoardHash1 = board.hash;
	board.makeMoveFromNotation("g7h8q");
	const initialBoardHash2 = board.hash;
	board.makeMoveFromNotation("b2a1q");

	test("Test undo promotions", () => {
		board.undoLastMove();
		expect(board.hash).toBe(initialBoardHash2);
		expect(initialBoardHash2).toBe(board.hashTable.getComputedHash());

		board.undoLastMove();
		expect(board.hash).toBe(initialBoardHash1);
		expect(initialBoardHash1).toBe(board.hashTable.getComputedHash());
	});
});
