import Board from "../../src/board";
import evaluate from "../../src/evaluate";
import search from "../../src/search";

describe("Threefold Repetition", () => {
	const board = new Board(Board.startPosFen);

	test("Detect repetition after certain moves ", () => {
		board.makeMoveFromNotation("e2e4");
		board.makeMoveFromNotation("e7e5");
		board.makeMoveFromNotation("e1e2");
		board.makeMoveFromNotation("e8e7");
		board.makeMoveFromNotation("e2e1");
		board.makeMoveFromNotation("e7e8");
		board.makeMoveFromNotation("e1e2");
		board.makeMoveFromNotation("e8e7");
		board.makeMoveFromNotation("e2e1");
		board.makeMoveFromNotation("e7e8");

		// This isn't a repetition, because first time we had this position, castling was possible
		expect(board.hashTable.getPositionCount(board.hash.valueLow, board.hash.valueHigh)).toBe(2);

		board.makeMoveFromNotation("e1e2");
		board.makeMoveFromNotation("e8e7");

		// But now it is a repetition
		expect(board.hashTable.getPositionCount(board.hash.valueLow, board.hash.valueHigh)).toBe(3);
		expect(evaluate(board)).toBe(0);
	});
});

describe("Stalemate", () => {
	const board = new Board("3k4/8/8/8/8/1q6/8/K7 w - - 1 64");

	test("Detect stalemate", () => {
		expect(board.isStalemate()).toBe(true);
	});
});

describe("Fifty Move Rule", () => {
	const board = new Board("3k4/8/1b6/3B4/6P1/8/8/3K4 w - - 99 16");

	test("Detect fifty move rule", () => {
		expect(board.halfMoveCountSinceLastCaptureOrPawnMove).toBe(99);
		expect(evaluate(board)).toBeGreaterThan(0);

		board.makeMoveFromNotation("d1d2");

		expect(board.halfMoveCountSinceLastCaptureOrPawnMove).toBe(100);
		expect(search(board, 1)).toBe(0);
	});
});

describe("Checkmate", () => {
	const board = new Board("5k2/3Rpppp/8/8/7r/8/PPPPPPP1/5K2 w - - 0 256");

	test("Detect checkmate", () => {
		board.makeMoveFromNotation("d7d8");
		expect(board.isCheckmate()).toBe(true);
		expect(evaluate(board)).toBe(10000);

		board.undoLastMove();

		board.makeMoveFromNotation("d7c7");
		board.makeMoveFromNotation("h4h1");
		expect(board.isCheckmate()).toBe(true);
		expect(evaluate(board)).toBe(-10000);
	});
});

