import Board from "../../src/board.js";

describe("Test basic moves and information handling", () => {
	const board = new Board(Board.startPosFen);

	test("Make simple pawn move with white", () => {
		board.makeMoveFromNotation("e2e4");
		expect(board.squares[Board.getPositionFromNotation("e4")].piece).toBe("P");
		expect(board.squares[Board.getPositionFromNotation("e2")].piece).toBe(null);
		expect(board.activeColor).toBe("black");
		expect(board.enPassantSquarePosition).toBe(Board.getPositionFromNotation("e3"));
	});

	test("Make simple pawn move with black", () => {
		board.makeMoveFromNotation("e7e5");
		expect(board.squares[Board.getPositionFromNotation("e5")].piece).toBe("p");
		expect(board.squares[Board.getPositionFromNotation("e7")].piece).toBe(null);
		expect(board.activeColor).toBe("white");
	});

	test("Make simple king move with white", () => {
		board.makeMoveFromNotation("e1e2");
		expect(board.squares[Board.getPositionFromNotation("e2")].piece).toBe("K");
		expect(board.squares[Board.getPositionFromNotation("e1")].piece).toBe(null);
		expect(board.activeColor).toBe("black");
	});

	test("Make simple king move with black", () => {
		board.makeMoveFromNotation("e8e7");
		expect(board.squares[Board.getPositionFromNotation("e7")].piece).toBe("k");
		expect(board.squares[Board.getPositionFromNotation("e8")].piece).toBe(null);
		expect(board.activeColor).toBe("white");
	});

	test("Test en passant", () => {
		board.makeMoveFromNotation("a2a4");
		board.makeMoveFromNotation("h7h5");
		board.makeMoveFromNotation("a4a5");
		board.makeMoveFromNotation("b7b5");
		expect(board.enPassantSquarePosition).toBe(Board.getPositionFromNotation("b6"));
		board.makeMoveFromNotation("a5b6");
		expect(board.squares[Board.getPositionFromNotation("b5")].piece).toBe(null);
		expect(board.squares[Board.getPositionFromNotation("a5")].piece).toBe(null);
		expect(board.squares[Board.getPositionFromNotation("b6")].piece).toBe("P");
	});

	test("Test move and half move count", () => {
		expect(board.halfMoveCountSinceLastCaptureOrPawnMove).toBe(0);
		board.makeMoveFromNotation("a7a6");
		board.makeMoveFromNotation("e2e3");
		expect(board.halfMoveCountSinceLastCaptureOrPawnMove).toBe(1);
		board.makeMoveFromNotation("e7e6");
		expect(board.halfMoveCountSinceLastCaptureOrPawnMove).toBe(2);
		board.makeMoveFromNotation("g1f3");
		expect(board.halfMoveCountSinceLastCaptureOrPawnMove).toBe(3);
		board.makeMoveFromNotation("d8h4");
		expect(board.halfMoveCountSinceLastCaptureOrPawnMove).toBe(4);
		board.makeMoveFromNotation("f3h4");
		expect(board.halfMoveCountSinceLastCaptureOrPawnMove).toBe(0);
		board.makeMoveFromNotation("e6e7");
		expect(board.halfMoveCountSinceLastCaptureOrPawnMove).toBe(1);
		board.makeMoveFromNotation("e3e2");
		expect(board.halfMoveCountSinceLastCaptureOrPawnMove).toBe(2);
		board.makeMoveFromNotation("g7g6");
		expect(board.halfMoveCountSinceLastCaptureOrPawnMove).toBe(0);
		expect(board.moveCount).toBe(10);
		expect(board.moves.length).toBe(18);
	});
});

describe("Make moves that affect castling rights", () => {
	test("Make King moves to affect castle rights", () => {
		let board = new Board("r3k2r/p1pppp1p/2B2B2/8/8/2b2b2/P1PPPP1P/R3K2R w KQkq - 0 4");

		expect(board.castlingInformation.isWhiteKingSidePossible).toBe(true);
		expect(board.castlingInformation.isWhiteQueenSidePossible).toBe(true);
		expect(board.castlingInformation.isBlackKingSidePossible).toBe(true);
		expect(board.castlingInformation.isBlackQueenSidePossible).toBe(true);

		board.makeMoveFromNotation("e1d1");
		board.makeMoveFromNotation("e8d8");

		expect(board.castlingInformation.isWhiteKingSidePossible).toBe(false);
		expect(board.castlingInformation.isWhiteQueenSidePossible).toBe(false);
		expect(board.castlingInformation.isBlackKingSidePossible).toBe(false);
		expect(board.castlingInformation.isBlackQueenSidePossible).toBe(false);
	});


	test("Make rook moves to affect castle rights", () => {
		let board = new Board("r3k2r/p1pppp1p/2B2B2/8/8/2b2b2/P1PPPP1P/R3K2R w KQkq - 0 4");

		expect(board.castlingInformation.isWhiteKingSidePossible).toBe(true);
		expect(board.castlingInformation.isWhiteQueenSidePossible).toBe(true);
		expect(board.castlingInformation.isBlackKingSidePossible).toBe(true);
		expect(board.castlingInformation.isBlackQueenSidePossible).toBe(true);

		board.makeMoveFromNotation("a1b1");

		expect(board.castlingInformation.isWhiteKingSidePossible).toBe(true);
		expect(board.castlingInformation.isWhiteQueenSidePossible).toBe(false);
		expect(board.castlingInformation.isBlackKingSidePossible).toBe(true);
		expect(board.castlingInformation.isBlackQueenSidePossible).toBe(true);

		board.makeMoveFromNotation("a8b8");

		expect(board.castlingInformation.isWhiteKingSidePossible).toBe(true);
		expect(board.castlingInformation.isWhiteQueenSidePossible).toBe(false);
		expect(board.castlingInformation.isBlackKingSidePossible).toBe(true);
		expect(board.castlingInformation.isBlackQueenSidePossible).toBe(false);

		board.makeMoveFromNotation("h1g1");

		expect(board.castlingInformation.isWhiteKingSidePossible).toBe(false);
		expect(board.castlingInformation.isWhiteQueenSidePossible).toBe(false);
		expect(board.castlingInformation.isBlackKingSidePossible).toBe(true);
		expect(board.castlingInformation.isBlackQueenSidePossible).toBe(false);

		board.makeMoveFromNotation("h8g8");

		expect(board.castlingInformation.isWhiteKingSidePossible).toBe(false);
		expect(board.castlingInformation.isWhiteQueenSidePossible).toBe(false);
		expect(board.castlingInformation.isBlackKingSidePossible).toBe(false);
		expect(board.castlingInformation.isBlackQueenSidePossible).toBe(false);
	});

	test("Capture rooks to affect castle rights", () => {
		let board = new Board("r3k2r/p1pppp1p/2B2B2/8/8/2b2b2/P1PPPP1P/R3K2R w KQkq - 0 4");

		expect(board.castlingInformation.isWhiteKingSidePossible).toBe(true);
		expect(board.castlingInformation.isWhiteQueenSidePossible).toBe(true);
		expect(board.castlingInformation.isBlackKingSidePossible).toBe(true);
		expect(board.castlingInformation.isBlackQueenSidePossible).toBe(true);

		board.makeMoveFromNotation("c3a1");

		expect(board.castlingInformation.isWhiteKingSidePossible).toBe(true);
		expect(board.castlingInformation.isWhiteQueenSidePossible).toBe(false);
		expect(board.castlingInformation.isBlackKingSidePossible).toBe(true);
		expect(board.castlingInformation.isBlackQueenSidePossible).toBe(true);

		board.makeMoveFromNotation("c6a8");

		expect(board.castlingInformation.isWhiteKingSidePossible).toBe(true);
		expect(board.castlingInformation.isWhiteQueenSidePossible).toBe(false);
		expect(board.castlingInformation.isBlackKingSidePossible).toBe(true);
		expect(board.castlingInformation.isBlackQueenSidePossible).toBe(false);

		board.makeMoveFromNotation("f3h1");

		expect(board.castlingInformation.isWhiteKingSidePossible).toBe(false);
		expect(board.castlingInformation.isWhiteQueenSidePossible).toBe(false);
		expect(board.castlingInformation.isBlackKingSidePossible).toBe(true);
		expect(board.castlingInformation.isBlackQueenSidePossible).toBe(false);

		board.makeMoveFromNotation("f6h8");

		expect(board.castlingInformation.isWhiteKingSidePossible).toBe(false);
		expect(board.castlingInformation.isWhiteQueenSidePossible).toBe(false);
		expect(board.castlingInformation.isBlackKingSidePossible).toBe(false);
		expect(board.castlingInformation.isBlackQueenSidePossible).toBe(false);
	});
});

describe("Test promotion handling", () => {
	let board = new Board("8/4PPPP/k7/8/8/K7/4pppp/8 w - - 0 32");

	test("Promote to queen", () => {
		board.makeMoveFromNotation("e7e8q");
		board.makeMoveFromNotation("e2e1q");
		expect(board.squares[Board.getPositionFromNotation("e8")].piece).toBe("Q");
		expect(board.squares[Board.getPositionFromNotation("e1")].piece).toBe("q");
	});
	test("Promote to rook", () => {
		board.makeMoveFromNotation("f7f8r");
		board.makeMoveFromNotation("f2f1r");
		expect(board.squares[Board.getPositionFromNotation("f8")].piece).toBe("R");
		expect(board.squares[Board.getPositionFromNotation("f1")].piece).toBe("r");
	});
	test("Promote to bishop", () => {
		board.makeMoveFromNotation("g7g8b");
		board.makeMoveFromNotation("g2g1b");
		expect(board.squares[Board.getPositionFromNotation("g8")].piece).toBe("B");
		expect(board.squares[Board.getPositionFromNotation("g1")].piece).toBe("b");
	});
	test("Promote to knight", () => {
		board.makeMoveFromNotation("h7h8n");
		board.makeMoveFromNotation("h2h1n");
		expect(board.squares[Board.getPositionFromNotation("h8")].piece).toBe("N");
		expect(board.squares[Board.getPositionFromNotation("h1")].piece).toBe("n");
	});
});
