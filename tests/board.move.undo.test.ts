import Board from "../src/board";

function generateBoardHash(board: Board) {
	let hash = "";
	board.squares.forEach((square) => {
		hash += square.piece || "0";
	});

	hash += board.castlingInformation.isWhiteKingSidePossible ? "1" : "0";
	hash += board.castlingInformation.isWhiteQueenSidePossible ? "1" : "0";
	hash += board.castlingInformation.isBlackKingSidePossible ? "1" : "0";
	hash += board.castlingInformation.isBlackQueenSidePossible ? "1" : "0";
	hash += board.enPassantSquarePosition ? board.enPassantSquarePosition : "0";
	hash += board.halfMoveCountSinceLastCaptureOrPawnMove;
	hash += board.moveCount;
	hash += board.activeColor;

	return hash;
}

describe("Testing board move undo for simple pawn move", () => {
	let board = new Board(Board.startPosFen);
	const possibleMoveCount = board.getPossibleMoves().length;
	const boardHash = generateBoardHash(board);

	test("Test move and undo", () => {
		board.makeMoveFromNotation("e2e4");
		board.undoLastMove();
		expect(generateBoardHash(board)).toBe(boardHash);
		expect(board.getPossibleMoves().length).toBe(possibleMoveCount);
	});
});

describe("Testing board move undo for en passant move white", () => {
	let board = new Board("rnbqkbnr/ppppp1p1/7p/4Pp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 4");
	const possibleMoveCount = board.getPossibleMoves().length;
	const boardHash = generateBoardHash(board);

	test("Test move and undo", () => {
		board.makeMoveFromNotation("e5f6");
		board.undoLastMove();
		expect(generateBoardHash(board)).toBe(boardHash);
		expect(board.getPossibleMoves().length).toBe(possibleMoveCount);
	});
});

describe("Testing board move undo for en passant move black", () => {
	let board = new Board("rnbqkbnr/pp1pp1p1/7p/4Pp2/PPpP4/8/2P2PPP/RNBQKBNR b KQkq d3 0 10");
	const possibleMoveCount = board.getPossibleMoves().length;
	const boardHash = generateBoardHash(board);

	test("Test move and undo", () => {
		board.makeMoveFromNotation("c4d3");
		board.undoLastMove();
		expect(generateBoardHash(board)).toBe(boardHash);
		expect(board.getPossibleMoves().length).toBe(possibleMoveCount);
	});
});

describe("Testing board move undo for capturing move", () => {
	let board = new Board("r1b1kbnr/pp1p2p1/2n1p2p/4Ppq1/PPpP4/5NP1/2P2P1P/RNBQKB1R w KQkq - 0 56");
	const possibleMoveCount = board.getPossibleMoves().length;
	const boardHash = generateBoardHash(board);

	test("Test move and undo", () => {
		board.makeMoveFromNotation("f3g5");
		board.undoLastMove();
		expect(generateBoardHash(board)).toBe(boardHash);
		expect(board.getPossibleMoves().length).toBe(possibleMoveCount);
	});
});

describe("Testing board move undo castling moves", () => {
	let board = new Board("r3k2r/pb1pb1p1/1pn1pn1p/4Ppq1/PPpP4/2N2NP1/1BPQBP1P/R3K2R w KQkq - 2 56");

	test("Test white castles king side", () => {
		const possibleMoveCount = board.getPossibleMoves().length;
		const boardHash = generateBoardHash(board);

		board.makeMoveFromNotation("e1g1");
		board.undoLastMove();
		expect(generateBoardHash(board)).toBe(boardHash);
		expect(board.getPossibleMoves().length).toBe(possibleMoveCount);
	});

	test("Test black castles king side", () => {
		board.makeMoveFromNotation("e1g1");

		const possibleMoveCount = board.getPossibleMoves().length;
		const boardHash = generateBoardHash(board);

		board.makeMoveFromNotation("e8g8");
		board.undoLastMove();
		expect(generateBoardHash(board)).toBe(boardHash);
		expect(board.getPossibleMoves().length).toBe(possibleMoveCount);
		board.undoLastMove();
	});

	test("Test white castles queen side", () => {
		const possibleMoveCount = board.getPossibleMoves().length;
		const boardHash = generateBoardHash(board);

		board.makeMoveFromNotation("e1c1");
		board.undoLastMove();
		expect(generateBoardHash(board)).toBe(boardHash);
		expect(board.getPossibleMoves().length).toBe(possibleMoveCount);
	});

	test("Test black castles queen side", () => {
		board.makeMoveFromNotation("e1g1");

		const possibleMoveCount = board.getPossibleMoves().length;
		const boardHash = generateBoardHash(board);

		board.makeMoveFromNotation("e8c8");
		board.undoLastMove();
		expect(generateBoardHash(board)).toBe(boardHash);
		expect(board.getPossibleMoves().length).toBe(possibleMoveCount);
	});
});

describe("Testing board move undo for promotion moves", () => {
	let board = new Board("2kr3r/pb1pb1P1/1Pn1p2p/5pq1/2pP4/2N2NP1/1pPQBP1P/R4RK1 w - - 0 56");
	const possibleMoveCount1 = board.getPossibleMoves().length;
	const boardHash1 = generateBoardHash(board);
	board.makeMoveFromNotation("g7h8q");
	const possibleMoveCount2 = board.getPossibleMoves().length;
	const boardHash2 = generateBoardHash(board);
	board.makeMoveFromNotation("b2a1q");

	test("Test undo promotions", () => {
		board.undoLastMove();
		expect(generateBoardHash(board)).toBe(boardHash2);
		expect(board.getPossibleMoves().length).toBe(possibleMoveCount2);

		board.undoLastMove();
		expect(generateBoardHash(board)).toBe(boardHash1);
		expect(board.getPossibleMoves().length).toBe(possibleMoveCount1);
	});
});
