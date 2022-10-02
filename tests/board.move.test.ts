import Board from "../src/board";

const fenMoveCount: any[] = [
	{ fen: "8/3k4/8/8/3K4/8/8/8 w - - 0 1", result: 8 },
	{ fen: "8/3k4/8/8/3K4/8/8/8 b - - 0 1", result: 8 },
	{ fen: "8/3k4/8/8/3K4/8/8/R7 w - - 0 1", result: 22 },
	{ fen: "7R/3k4/8/8/3K4/8/8/R7 w - - 0 1", result: 36 },
	{ fen: "7r/3k4/8/8/3K4/8/8/r7 b - - 0 1", result: 36 },
	{ fen: "q7/3k4/8/8/3K4/8/8/7q b - - 0 1", result: 48 },
	{ fen: "Q7/3k4/8/8/3K4/8/8/7Q w - - 0 1", result: 48 },
	{ fen: "B7/3k4/8/8/3K4/8/8/4B3 w - - 0 1", result: 22 },
	{ fen: "b7/3k4/8/8/3K4/8/8/4b3 b - - 0 1", result: 22 },
	{ fen: "n7/3k4/8/8/3K4/8/8/4n3 b - - 0 1", result: 14 },
	{ fen: "N7/3k4/8/8/3K4/8/8/4N3 w - - 0 1", result: 14 },
	{ fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", result: 20 },
	{ fen: "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1", result: 20 },
	// { fen: "", result: 0 },
	// { fen: "", result: 0 },
	// { fen: "", result: 0 },
	// { fen: "", result: 0 },
	// { fen: "", result: 0 },
];

const fenEnPassantMoveCount: any[] = [
	{ fen: "4k3/p1pppppp/8/PpP1P1P1/8/8/1P1P1P1P/4K3 w - b6 0 2", result: 17 },
	{ fen: "4k3/p1ppp1pp/8/PpP1PpP1/1P6/8/3P1P1P/4K3 w - f6 0 3", result: 15 },
	{ fen: "4k3/p1p1p1p1/P3P1p1/1p3p2/1PpP4/8/5P1P/4K3 b - d3 0 7", result: 8 },
	{ fen: "4k3/p1p1p1p1/P3P3/1p1P1p2/1Pp2Pp1/8/7P/4K3 b - f3 0 9", result: 9 },
	// { fen: "", result: 0 },
	// { fen: "", result: 0 },
	// { fen: "", result: 0 },
];

const fenCaptureMoveCount: any[] = [
	{ fen: "3k4/8/2ppp3/2pQp3/2ppp3/8/8/3K4 w - - 0 1", result: 13 },
	{ fen: "3k4/8/2ppp3/2pRp3/2ppp3/8/8/3K4 w - - 0 1", result: 9 },
	{ fen: "3k4/8/2ppp3/2pBp3/2ppp3/8/8/3K4 w - - 0 1", result: 9 },
	{ fen: "3k4/8/3p4/2pKp3/2ppp3/8/8/8 w - - 0 1", result: 5 },
	{ fen: "8/8/2PPP3/2PkP3/3P4/8/8/3K4 b - - 0 1", result: 5 },
	{ fen: "3k4/8/2PPP3/2PqP3/2PPP3/8/8/3K4 b - - 0 1", result: 10 },
	{ fen: "3k4/8/2PPP3/2PrP3/2PPP3/8/8/3K4 b - - 0 1", result: 6 },
	{ fen: "3k4/8/2PPP3/2PbP3/2PPP3/8/8/3K4 b - - 0 1", result: 6 },
	// { fen: "", result: 0 },
];

const fenPromotionMoveCount: any[] = [
	{ fen: "3k4/PP1P1PPP/8/8/8/8/8/3K4 w - - 0 1", result: 25 },
	{ fen: "3k4/PP1P1PPP/8/8/8/8/pp1p1ppp/3K4 b - - 0 1", result: 23 },
];

const fenTiedUpMoveCount: any[] = [
	{ fen: "3k4/8/8/5b2/4N3/3K4/8/8 w - - 0 1", result: 7 },
	{ fen: "3k4/8/8/1q3b2/2N1N3/3K4/8/8 w - - 0 1", result: 6 },
	{ fen: "3k4/8/8/1q3b2/2N1N3/3K4/3B4/3r4 w - - 0 1", result: 5 },
	{ fen: "3k4/8/8/1q3b2/2N1N3/3K4/3BR3/3r1q2 w - - 0 1", result: 4 },
	{ fen: "3k4/8/8/1q3b2/2N1P3/3K4/3BR3/3r1q2 w - - 0 1", result: 5 },
	{ fen: "3K4/8/8/1Q3B2/2n1p3/3k4/3br3/3R1Q2 b - - 0 1", result: 4 },
	{ fen: "3K4/8/8/1Q3B2/2n1p3/3k4/3b4/3R4 b - - 0 1", result: 5 },
	{ fen: "3K4/8/8/1Q3B2/2n1p3/3k4/8/8 b - - 0 1", result: 6 },
];

const castleMoveCount: any[] = [
	{ fen: "rnbqk1nr/pppppppp/8/8/8/4b3/P6P/R3K2R w KQkq - 0 1", result: 12 },
	{ fen: "rnbqkbnr/pppppppp/8/8/8/8/P6P/R3K2R w KQkq - 0 1", result: 16 },
];

describe("Testing general move generation", () => {
	fenMoveCount.forEach(testFen => {
		test(`Testing move count with ${testFen.fen}`, () => {
			const board = new Board(testFen.fen);
			expect(board.getPossibleMoves().length).toBe(testFen.result);
		});
	});
});

describe("Testing en passant moves", () => {
	fenEnPassantMoveCount.forEach(testFen => {
		test(`Testing move count with ${testFen.fen}`, () => {
			const board = new Board(testFen.fen);
			expect(board.getPossibleMoves().length).toBe(testFen.result);
		});
	});
});

describe("Testing capture moves", () => {
	fenCaptureMoveCount.forEach(testFen => {
		test(`Testing move count with ${testFen.fen}`, () => {
			const board = new Board(testFen.fen);
			expect(board.getPossibleMoves().length).toBe(testFen.result);
		});
	});
});

describe("Testing promotion moves", () => {
	fenPromotionMoveCount.forEach(testFen => {
		test(`Testing move count with ${testFen.fen}`, () => {
			const board = new Board(testFen.fen);
			expect(board.getPossibleMoves().length).toBe(testFen.result);
		});
	});
});

describe("Testing tied up moves", () => {
	fenTiedUpMoveCount.forEach(testFen => {
		test(`Testing move count with ${testFen.fen}`, () => {
			const board = new Board(testFen.fen);
			expect(board.getPossibleMoves().length).toBe(testFen.result);
		});
	});
});

describe("Testing castle moves", () => {
	castleMoveCount.forEach(testFen => {
		test(`Testing move count with ${testFen.fen}`, () => {
			const board = new Board(testFen.fen);
			expect(board.getPossibleMoves().length).toBe(testFen.result);
		});
	});
});
