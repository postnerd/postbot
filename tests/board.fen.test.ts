import Board from "../src/board";

describe("Testing static board functions", () => {
	test("Getting index of a8", () => {
		expect(Board.getIndexFromNotation("a8")).toBe(21);
	});

	test("Getting index of h1", () => {
		expect(Board.getIndexFromNotation("h1")).toBe(98);
	});
});

describe("Testing board with standard start position ...", () => {
	const board = new Board(Board.startPosFen);

	test("board has 120 elements", () => {
		expect(board.squares.length).toBe(120);
	});

	test("white to play", () => {
		expect(board.activeColor).toBe("white");
	});

	test("white king side castle is possible", () => {
		expect(board.castlingInformation.isWhiteKingSidePossible).toBe(true);
	});

	test("white queen side castle is possible", () => {
		expect(board.castlingInformation.isWhiteQueenSidePossible).toBe(true);
	});

	test("black king side castle is possible", () => {
		expect(board.castlingInformation.isBlackKingSidePossible).toBe(true);
	});

	test("black queen side castle is possible", () => {
		expect(board.castlingInformation.isBlackQueenSidePossible).toBe(true);
	});

	test("no en passant move possible", () => {
		expect(board.enPassantSquare).toBe(null);
	});

	test("half moves should be 0", () => {
		expect(board.halfMoveCountSinceLastCaptureOrPawnMove).toBe(0);
	});

	test("full moves should be 1", () => {
		expect(board.moveCount).toBe(1);
	});
});

describe("Testing board with middle game position ...", () => {
	const board = new Board("1rbqkb1r/2p2ppp/p1n2n2/1pPpp3/3PP3/2N2N2/PP2BPPP/R1BQ1RK1 b k - 5 8");

	test("board has 120 elements", () => {
		expect(board.squares.length).toBe(120);
	});

	test("black to play", () => {
		expect(board.activeColor).toBe("black");
	});

	test("white king side castle is NOT possible", () => {
		expect(board.castlingInformation.isWhiteKingSidePossible).toBe(false);
	});

	test("white queen side castle is NOT possible", () => {
		expect(board.castlingInformation.isWhiteQueenSidePossible).toBe(false);
	});

	test("black king side castle is possible", () => {
		expect(board.castlingInformation.isBlackKingSidePossible).toBe(true);
	});

	test("black queen side castle is NOT possible", () => {
		expect(board.castlingInformation.isBlackQueenSidePossible).toBe(false);
	});

	test("no en passant move possible", () => {
		expect(board.enPassantSquare).toBe(null);
	});

	test("half moves should be 5", () => {
		expect(board.halfMoveCountSinceLastCaptureOrPawnMove).toBe(5);
	});

	test("full moves should be 8", () => {
		expect(board.moveCount).toBe(8);
	});
});

describe("Testing board with en passant move ...", () => {
	const board = new Board("r1bqkbnr/2p2ppp/p1n5/1pPpp3/3PP3/5N2/PP3PPP/RNBQKB1R w KQkq b6 0 6");

	test("en passant move on b6", () => {
		expect(board.enPassantSquare).toBe("b6");
	});

	test("square information should be set to true for en passant", () => {
		expect(board.squares[Board.getIndexFromNotation("b6")].isEnPassantSquare).toBe(true);
	});
});
