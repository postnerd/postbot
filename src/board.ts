import Hash from "./hash.js";
import HashTable from "./hashTable.js";

export type Piece = "p" | "P" | "b" | "B" | "n" | "N" | "r" | "R" | "q" | "Q" | "k" | "K" | null;
type Color = "white" | "black" | null;
export type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn" | null;

interface SquareObject {
	piece: Piece;
	color: Color;
	pieceType: PieceType;
}

const CHESS_BOARD_POSITIONS = [
	21,	22,	23,	24,	25,	26,	27,	28,
	31,	32,	33,	34,	35,	36,	37,	38,
	41,	42,	43,	44,	45,	46,	47,	48,
	51,	52,	53,	54,	55,	56,	57,	58,
	61,	62,	63,	64,	65,	66,	67,	68,
	71,	72,	73,	74,	75,	76,	77,	78,
	81,	82,	83,	84,	85,	86,	87,	88,
	91,	92,	93,	94,	95,	96,	97,	98,
];

const CHESS_BOARD_NOTATION: {[key: string]: number} = {
	a8: 21,	b8: 22,	c8: 23,	d8: 24,	e8: 25,	f8: 26,	g8: 27,	h8: 28,
	a7: 31,	b7: 32,	c7: 33,	d7: 34,	e7: 35,	f7: 36,	g7: 37,	h7: 38,
	a6: 41,	b6: 42,	c6: 43,	d6: 44,	e6: 45,	f6: 46,	g6: 47,	h6: 48,
	a5: 51,	b5: 52,	c5: 53,	d5: 54,	e5: 55,	f5: 56,	g5: 57,	h5: 58,
	a4: 61,	b4: 62,	c4: 63,	d4: 64,	e4: 65,	f4: 66,	g4: 67,	h4: 68,
	a3: 71,	b3: 72,	c3: 73,	d3: 74,	e3: 75,	f3: 76,	g3: 77,	h3: 78,
	a2: 81,	b2: 82,	c2: 83,	d2: 84,	e2: 85,	f2: 86,	g2: 87,	h2: 88,
	a1: 91,	b1: 92,	c1: 93,	d1: 94,	e1: 95,	f1: 96,	g1: 97,	h1: 98,
};

const CHESS_BOARD_BOUNDARIES = [
	false, false, false, false, false, false, false, false, false, false,
	false, false, false, false, false, false, false, false, false, false,
	false, true, true, true, true, true, true, true, true, false,
	false, true, true, true, true, true, true, true, true, false,
	false, true, true, true, true, true, true, true, true, false,
	false, true, true, true, true, true, true, true, true, false,
	false, true, true, true, true, true, true, true, true, false,
	false, true, true, true, true, true, true, true, true, false,
	false, true, true, true, true, true, true, true, true, false,
	false, true, true, true, true, true, true, true, true, false,
	false, false, false, false, false, false, false, false, false, false,
	false, false, false, false, false, false, false, false, false, false,
];

interface castlingInformation {
	isWhiteKingSidePossible: boolean,
	isWhiteQueenSidePossible: boolean,
	isBlackKingSidePossible: boolean,
	isBlackQueenSidePossible: boolean,
}

interface currentBoardState {
	activeColor: "white" | "black",
	castlingInformation: castlingInformation,
	enPassantSquarePosition: number | null,
	halfMoveCountSinceLastCaptureOrPawnMove: number,
	moveCount: number,
	hash: {
		valueLow: number,
		valueHigh: number,
	}
}

export interface Move {
	piece: Piece,
	pieceType: PieceType,
	from: number,
	to: number,
	willCapture: boolean,
	capturedSquareInfo?: SquareObject,
	promoteToSquareInfo?: SquareObject,
	isEnPassant?: boolean,
	isCastle?: boolean,
	currentBoardState: currentBoardState,
	score?: number,
}

const MOVE_DIRECTIONS: {[key: string]: number[]} = {
	king: [-9, -10, -11, 1, 11, 10, 9, -1],
	queen: [-9, -10, -11, 1, 11, 10, 9, -1],
	rook: [-10, 1, 10, -1],
	bishop: [-9, -11, 9, 11],
	knight: [-19, -8, 12, 21, 19, -12, 8, -21],
	whitePawnMove: [-10],
	blackPawnMove: [10],
	whitePawnCapture: [-9, -11],
	blackPawnCapture: [9, 11],
};

/**
 * CHESS BOARD REPRESENTATION
 *
 * This chess board is represented by 10x12 squares
 * The first two and the last two ranks are just added to have an easier move generation because we can check if an piece has moved outside the 8x8 chess board
 */
export default class Board {
	squares: SquareObject[] = [];
	activeColor: "white" | "black" = "white";
	castlingInformation: castlingInformation = {
		isWhiteKingSidePossible: false,
		isWhiteQueenSidePossible: false,
		isBlackKingSidePossible: false,
		isBlackQueenSidePossible: false,
	};
	enPassantSquarePosition: number | null = null;
	halfMoveCountSinceLastCaptureOrPawnMove: number = 0;
	moveCount: number = 0;
	moves: Move[] = [];
	hashTable: HashTable;
	hash: Hash;

	static readonly startPosFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

	static getPositionFromNotation(notation: string): number {
		return CHESS_BOARD_NOTATION[notation];
	}

	static getFenNotationFromPosition(position: number): string {
		return Object.keys(CHESS_BOARD_NOTATION).find((key) => CHESS_BOARD_NOTATION[key] === position) || "";
	}

	static getSquareObjectByFenNotation(fenNotation: string | null): SquareObject {
		switch (fenNotation) {
		case "p":
			return { piece: "p", color: "black", pieceType: "pawn" };
		case "P":
			return { piece: "P", color: "white", pieceType: "pawn" };
		case "n":
			return { piece: "n", color: "black", pieceType: "knight" };
		case "N":
			return { piece: "N", color: "white", pieceType: "knight" };
		case "b":
			return { piece: "b", color: "black", pieceType: "bishop" };
		case "B":
			return { piece: "B", color: "white", pieceType: "bishop" };
		case "r":
			return { piece: "r", color: "black", pieceType: "rook" };
		case "R":
			return { piece: "R", color: "white", pieceType: "rook" };
		case "q":
			return { piece: "q", color: "black", pieceType: "queen" };
		case "Q":
			return { piece: "Q", color: "white", pieceType: "queen" };
		case "k":
			return { piece: "k", color: "black", pieceType: "king" };
		case "K":
			return { piece: "K", color: "white", pieceType: "king" };
		case "empty":
			return { piece: null, color: null, pieceType: null };
		default: {
			throw new Error(`Fen notation for ${fenNotation} is not recognized.`);
		}

		}
	}

	static getFenMoveNotationFromMove(move: Move): string {
		const from = move.from;
		const to = move.to;
		const promoteToSquareInfo = move.promoteToSquareInfo;
		let promoteTo = "";

		if (promoteToSquareInfo !== undefined) {
			promoteTo = promoteToSquareInfo.piece !== null ? promoteToSquareInfo.piece.toLowerCase() : "";
		}

		return `${Board.getFenNotationFromPosition(from)}${Board.getFenNotationFromPosition(to)}${promoteTo}`;
	}


	static isOnBoard(position: number): boolean {
		return CHESS_BOARD_BOUNDARIES[position];
	}

	constructor(fen: string) {
		this.setPositionFromFen(fen);
		this.hash = new Hash(this);
		this.hashTable = new HashTable();
		this.hashTable.increasePositionCount(this.hash.valueLow, this.hash.valueHigh);
	}

	getCurrentBoardStateInfo(): currentBoardState {
		return {
			activeColor: this.activeColor,
			castlingInformation: {
				isWhiteKingSidePossible: this.castlingInformation.isWhiteKingSidePossible,
				isWhiteQueenSidePossible: this.castlingInformation.isWhiteQueenSidePossible,
				isBlackKingSidePossible: this.castlingInformation.isBlackKingSidePossible,
				isBlackQueenSidePossible: this.castlingInformation.isBlackQueenSidePossible,
			},
			enPassantSquarePosition: this.enPassantSquarePosition,
			halfMoveCountSinceLastCaptureOrPawnMove: this.halfMoveCountSinceLastCaptureOrPawnMove,
			moveCount: this.moveCount,
			hash: {
				valueLow: this.hash.valueLow,
				valueHigh: this.hash.valueHigh,
			},
		};
	}

	setPositionFromFen(fen: string): void {
		// creating an empty board
		for (let i = 0; i < 120; i++) {
			this.squares.push(Board.getSquareObjectByFenNotation("empty"));
		}

		// Setting up board from fen notation

		// Parsing fen string into an array
		// 0: board information
		// 1: side to play
		// 2: castling information
		// 3: en passant move
		// 4: count of half moves since last capture or advance
		// 5: count of moves
		const inputs: string[] = fen.split(" ");

		// 0: BOARD SETUP for 10x12
		// board information are provided rank by rank separated by "/"
		const rankInformation: string[] = inputs[0].split("/");

		// setting up the board rank by rank with the fen string information
		let boardIndex = 0;
		rankInformation.forEach((rank: string) => {
			const squareInformation: string[] = rank.split("");

			for (let i = 0; i < squareInformation.length; i++) {
				const squareInfo = squareInformation[i];
				if (isNaN(parseInt(squareInfo))) { // if the square info is not a number we know we got an actual piece
					this.squares[CHESS_BOARD_POSITIONS[boardIndex]] = Board.getSquareObjectByFenNotation(squareInfo);
					boardIndex++;
				}
				else { // if it's a number, for the next n (number) squares we have blank ones
					for (let j = 0; j < parseInt(squareInfo); j++) {
						this.squares[CHESS_BOARD_POSITIONS[boardIndex]] = Board.getSquareObjectByFenNotation("empty");
						boardIndex++;
					}
				}
			}
		});

		// 1: WHO`S TO PLAY
		this.activeColor = inputs[1] === "w" ? "white" : "black";

		// 2: Setting the castling information
		inputs[2].split("").forEach((castlingInfo: string) => {
			switch (castlingInfo) {
			case "K": {
				this.castlingInformation.isWhiteKingSidePossible = true;
				break;
			}
			case "Q": {
				this.castlingInformation.isWhiteQueenSidePossible = true;
				break;
			}
			case "k": {
				this.castlingInformation.isBlackKingSidePossible = true;
				break;
			}
			case "q": {
				this.castlingInformation.isBlackQueenSidePossible = true;
				break;
			}
			case "-": {
				break;
			}
			default:
				throw new Error(`Couldn't read castling information "${castlingInfo}" from fen notation "${inputs[2]}".`);
			}
		});

		// 3: Determine if a en passant move from this position will be possible
		if (inputs[3] !== "-") {
			this.enPassantSquarePosition = Board.getPositionFromNotation(inputs[3]);
		}

		// 4: Set the amount of half moves happened so far since the last piece was captured or we had a pawn move
		// this will be relevant cause after 50 half moves without a capture or a pawn move we have a draw
		this.halfMoveCountSinceLastCaptureOrPawnMove = parseInt(inputs[4]);

		// 5: Set the amount of total moves (two half moves are one move / to be considered as a move every player had to move one of his/her pieces)
		this.moveCount = parseInt(inputs[5]);
	}

	/**
	 * Returns all possible moves from current board situation.
	 *
	 * A: PAWN MOVES
	 * B: KING MOVES
	 * C: KNIGHT MOVES
	 * D: QUEEN, ROOK, BISHOP MOVES
	 */
	getPossibleMoves(forceLegal?: boolean): Move[] {
		// TODO: Cache moves
		// TODO: Sort king moves to the front
		let moves: Move[] = [];

		const oppositeColor: "white" | "black" = this.activeColor === "white" ? "black" : "white";

		for (let boardIndex = 0; boardIndex < CHESS_BOARD_POSITIONS.length; boardIndex++) {
			const squarePosition = CHESS_BOARD_POSITIONS[boardIndex];
			const squareInfo = this.squares[squarePosition];

			if (squareInfo.color !== this.activeColor) continue;

			// A: PAWN moves
			// 1: Promotion moves (normal and capture)
			// 2: normal, capture and en passant moves
			// 3: two step moves
			if (squareInfo.pieceType === "pawn") {
				const movesDirections: number[] = MOVE_DIRECTIONS[this.activeColor === "white" ? "whitePawnMove" : "blackPawnMove"];
				const captureDirections: number[] = MOVE_DIRECTIONS[this.activeColor === "white" ? "whitePawnCapture" : "blackPawnCapture"];
				const hasStartPosition: boolean = this.activeColor === "white" ? squarePosition >= 81 : squarePosition <= 38;
				const canPromote: boolean = this.activeColor === "white" ? squarePosition <= 38 : squarePosition >= 81;
				const newPosition: number = squarePosition + movesDirections[0];
				const capturePosition1: number = squarePosition + captureDirections[0];
				const capturePosition2: number = squarePosition + captureDirections[1];

				// 1: Promotion moves
				if (canPromote) {
					const possiblePromotions = this.activeColor === "white" ? ["Q", "R", "B", "N"] : ["q", "r", "b", "n"];

					// normal promotion moves
					if (this.squares[newPosition].piece === null) {
						possiblePromotions.forEach(promotionType => {
							moves.push({
								piece: squareInfo.piece,
								pieceType: squareInfo.pieceType,
								from: squarePosition,
								to: newPosition,
								willCapture: false,
								promoteToSquareInfo: Board.getSquareObjectByFenNotation(promotionType),
								currentBoardState: this.getCurrentBoardStateInfo(),
							});
						});
					}

					// promotion move with capturing a piece at capture position 1
					if (this.squares[capturePosition1].color === oppositeColor) {
						possiblePromotions.forEach(promotionType => {
							moves.push({
								piece: squareInfo.piece,
								pieceType: squareInfo.pieceType,
								from: squarePosition,
								to: capturePosition1,
								willCapture: true,
								capturedSquareInfo: this.squares[capturePosition1],
								promoteToSquareInfo: Board.getSquareObjectByFenNotation(promotionType),
								currentBoardState: this.getCurrentBoardStateInfo(),
							});
						});
					}

					// promotion move with capturing a piece at capture position 1
					if (this.squares[capturePosition2].color === oppositeColor) {
						possiblePromotions.forEach(promotionType => {
							moves.push({
								piece: squareInfo.piece,
								pieceType: squareInfo.pieceType,
								from: squarePosition,
								to: capturePosition2,
								willCapture: true,
								capturedSquareInfo: this.squares[capturePosition2],
								promoteToSquareInfo: Board.getSquareObjectByFenNotation(promotionType),
								currentBoardState: this.getCurrentBoardStateInfo(),
							});
						});
					}
				}
				// 2: normal pawn moves
				else {
					// simple move
					if (Board.isOnBoard(newPosition) && this.squares[newPosition].piece === null) {
						moves.push({
							piece: squareInfo.piece,
							pieceType: squareInfo.pieceType,
							from: squarePosition,
							to: newPosition,
							willCapture: false,
							currentBoardState: this.getCurrentBoardStateInfo(),
						});
					}

					// move with capturing a piece at capture position 1
					if (this.squares[capturePosition1].color === oppositeColor) {
						moves.push({
							piece: squareInfo.piece,
							pieceType: squareInfo.pieceType,
							from: squarePosition,
							to: capturePosition1,
							willCapture: true,
							capturedSquareInfo: this.squares[capturePosition1],
							currentBoardState: this.getCurrentBoardStateInfo(),
						});
					}

					// move with capturing a piece at capture position 2
					if (this.squares[capturePosition2].color === oppositeColor) {
						moves.push({
							piece: squareInfo.piece,
							pieceType: squareInfo.pieceType,
							from: squarePosition,
							to: capturePosition2,
							willCapture: true,
							capturedSquareInfo: this.squares[capturePosition2],
							currentBoardState: this.getCurrentBoardStateInfo(),
						});
					}

					// en passant move
					if (capturePosition1 === this.enPassantSquarePosition || capturePosition2 === this.enPassantSquarePosition) {
						moves.push({
							piece: squareInfo.piece,
							pieceType: squareInfo.pieceType,
							from: squarePosition,
							to: this.enPassantSquarePosition,
							willCapture: true,
							capturedSquareInfo: this.activeColor === "white" ? this.squares[this.enPassantSquarePosition + 10] : this.squares[this.enPassantSquarePosition - 10],
							isEnPassant: true,
							currentBoardState: this.getCurrentBoardStateInfo(),
						});
					}
				}

				// 3: two step move
				if (hasStartPosition) {
					let twoStepPosition = newPosition + movesDirections[0];
					if (this.squares[newPosition].piece === null && this.squares[twoStepPosition].piece === null) {
						moves.push({
							piece: squareInfo.piece,
							pieceType: squareInfo.pieceType,
							from: squarePosition,
							to: twoStepPosition,
							willCapture: false,
							currentBoardState: this.getCurrentBoardStateInfo(),
						});
					}
				}
			}
			// B: KING MOVES
			// 1: normal move with or without capturing
			// 2: castling moves
			else if (squareInfo.pieceType === "king") {
				const movesDirections: number[] = MOVE_DIRECTIONS.king;

				// normal moves
				for (let i = 0; i < movesDirections.length; i++) {
					let newPosition: number = squarePosition + movesDirections[i];

					if (Board.isOnBoard(newPosition) && (this.squares[newPosition].piece === null || this.squares[newPosition].color === oppositeColor)) {
						moves.push({
							piece: squareInfo.piece,
							pieceType: squareInfo.pieceType,
							from: squarePosition,
							to: newPosition,
							willCapture: this.squares[newPosition].color === oppositeColor,
							capturedSquareInfo: this.squares[newPosition].color === oppositeColor ? this.squares[newPosition] : undefined,
							currentBoardState: this.getCurrentBoardStateInfo(),
						});
					}
				}

				// castle moves
				if (this.isCheck()) continue;

				const isKingSideCastlePossible = this.activeColor === "white" ? this.castlingInformation.isWhiteKingSidePossible : this.castlingInformation.isBlackKingSidePossible;
				const isQueenSideCastlePossible = this.activeColor === "white" ? this.castlingInformation.isWhiteQueenSidePossible : this.castlingInformation.isBlackQueenSidePossible;

				if (isKingSideCastlePossible) {
					if (this.squares[squarePosition + 1].piece === null && this.squares[squarePosition + 2].piece === null && !this.isKingPlacedInCheckByMove({ piece: squareInfo.piece, pieceType: "king", from: squarePosition, to: squarePosition + 1, willCapture: false, currentBoardState: this.getCurrentBoardStateInfo() })) {
						moves.push({
							piece: squareInfo.piece,
							pieceType: squareInfo.pieceType,
							from: squarePosition,
							to: squarePosition + 2,
							willCapture: false,
							isCastle: true,
							currentBoardState: this.getCurrentBoardStateInfo(),
						});
					}
				}

				if (isQueenSideCastlePossible) {
					if (this.squares[squarePosition - 1].piece === null && this.squares[squarePosition - 2].piece === null && this.squares[squarePosition - 3].piece === null && !this.isKingPlacedInCheckByMove({ piece: squareInfo.piece, pieceType: "king", from: squarePosition, to: squarePosition - 1, willCapture: false, currentBoardState: this.getCurrentBoardStateInfo() })) {
						moves.push({
							piece: squareInfo.piece,
							pieceType: squareInfo.pieceType,
							from: squarePosition,
							to: squarePosition - 2,
							willCapture: false,
							isCastle: true,
							currentBoardState: this.getCurrentBoardStateInfo(),
						});
					}
				}
			}
			// C: KNIGHT MOVES
			else if (squareInfo.pieceType === "knight") {
				const movesDirections: number[] = MOVE_DIRECTIONS.knight;

				for (let i = 0; i < movesDirections.length; i++) {
					let position: number = squarePosition + movesDirections[i];

					if (Board.isOnBoard(position) && (this.squares[position].piece === null || this.squares[position].color === oppositeColor)) {
						moves.push({
							piece: squareInfo.piece,
							pieceType: squareInfo.pieceType,
							from: squarePosition,
							to: position,
							willCapture: this.squares[position].color === oppositeColor,
							capturedSquareInfo: this.squares[position].color === oppositeColor ? this.squares[position] : undefined,
							currentBoardState: this.getCurrentBoardStateInfo(),
						});
					}
				}
			}
			// D: QUEEN, ROOK, BISHOP MOVES
			// Since all pieces have different possible directions but have the same behavior while moving, we can handle them all the same way
			else {
				const movesDirections = MOVE_DIRECTIONS[String(squareInfo.pieceType)];
				for (let i = 0; i < movesDirections.length; i++) {
					let position = squarePosition + movesDirections[i];
					let captured = false;

					while (Board.isOnBoard(position) && !captured && this.squares[position].color !== this.activeColor) {
						captured = this.squares[position].piece !== null;
						moves.push({
							piece: squareInfo.piece,
							pieceType: squareInfo.pieceType,
							from: squarePosition,
							to: position,
							willCapture: captured,
							capturedSquareInfo: captured ? this.squares[position] : undefined,
							currentBoardState: this.getCurrentBoardStateInfo(),
						});
						position += movesDirections[i];
					}
				}
			}
		}

		if (forceLegal) {
			moves = moves.filter((move: Move) => {
				return !this.isKingPlacedInCheckByMove(move);
			});
		}

		return moves;
	}

	isKingPlacedInCheckByMove(move: Move) {
		const oldTo = this.squares[move.to];

		this.squares[move.to] = this.squares[move.from];
		this.squares[move.from] = Board.getSquareObjectByFenNotation("empty");
		if (move.isEnPassant) {
			if (this.activeColor === "white") {
				this.squares[move.to + 10] = Board.getSquareObjectByFenNotation("empty");
			}
			else {
				this.squares[move.to - 10] = Board.getSquareObjectByFenNotation("empty");
			}
		}

		const isCheck = this.isCheck();

		this.squares[move.from] = this.squares[move.to];
		this.squares[move.to] = oldTo;
		if (move.isEnPassant) {
			if (this.activeColor === "white") {
				this.squares[move.to + 10] = Board.getSquareObjectByFenNotation("p");
			}
			else {
				this.squares[move.to - 10] = Board.getSquareObjectByFenNotation("P");
			}
		}

		return isCheck;
	}

	isCheck(): boolean {
		const kingFen: "K" | "k" = this.activeColor === "white" ? "K" : "k";
		const oppositeQueenFen: "Q" | "q" = this.activeColor !== "white" ? "Q" : "q";
		const oppositeRookFen: "R" | "r" = this.activeColor !== "white" ? "R" : "r";
		const oppositeBishopFen: "B" | "b" = this.activeColor !== "white" ? "B" : "b";
		const oppositeKnightFen: "N" | "n" = this.activeColor !== "white" ? "N" : "n";
		const oppositePawnFen: "P" | "p" = this.activeColor !== "white" ? "P" : "p";

		const kingPosition: number = this.squares.findIndex((squareInformation: SquareObject) => squareInformation.piece === kingFen);

		// check for pawn checks
		const pawnMoves: number[] = kingFen === "K" ? MOVE_DIRECTIONS.whitePawnCapture : MOVE_DIRECTIONS.blackPawnCapture;
		if (this.squares[kingPosition + pawnMoves[0]].piece === oppositePawnFen || this.squares[kingPosition + pawnMoves[1]].piece === oppositePawnFen) return true;


		// check for knight checks
		const knightMoves: number[] = MOVE_DIRECTIONS.knight;
		for (let i = 0; i < knightMoves.length; i++) {
			if (this.squares[kingPosition - knightMoves[i]].piece === oppositeKnightFen) return true;
		}

		// check for queen and rook checks
		const queenAndRookMoves: number[] = MOVE_DIRECTIONS.rook;
		for (let i = 0; i < queenAndRookMoves.length; i++) {
			let position: number = kingPosition + queenAndRookMoves[i];

			while (Board.isOnBoard(position) && this.squares[position].piece === null) {
				position += queenAndRookMoves[i];
			}

			if (this.squares[position].piece === oppositeQueenFen || this.squares[position].piece === oppositeRookFen) return true;
		}

		// check for queen and bishop checks
		const queenAndBishopMoves: number[] = MOVE_DIRECTIONS.bishop;
		for (let i = 0; i < queenAndBishopMoves.length; i++) {
			let position: number = kingPosition + queenAndBishopMoves[i];

			while (Board.isOnBoard(position) && this.squares[position].piece === null) {
				position += queenAndBishopMoves[i];
			}

			if (this.squares[position].piece === oppositeQueenFen || this.squares[position].piece === oppositeBishopFen) return true;
		}

		// check for "king checks"
		const kingMoves: number[] = MOVE_DIRECTIONS.king;
		for (let i = 0; i < kingMoves.length; i++) {
			let position: number = kingPosition + kingMoves[i];

			if (this.squares[position].pieceType === "king") return true;
		}

		return false;
	}

	isCheckmate(): boolean {
		if (!this.isCheck()) return false;

		const possibleMoves = this.getPossibleMoves();

		for (let i = 0; i < possibleMoves.length; i++) {
			if (!this.isKingPlacedInCheckByMove(possibleMoves[i])) return false;
		}

		return true;
	}

	isStalemate(): boolean {
		if (this.isCheck()) return false;

		const possibleMoves = this.getPossibleMoves();

		for (let i = 0; i < possibleMoves.length; i++) {
			if (!this.isKingPlacedInCheckByMove(possibleMoves[i])) return false;
		}

		return true;
	}

	makeMove(move: Move) {
		// Remove en passant square from hash if necessary
		if (this.enPassantSquarePosition !== null) {
			this.hash.updatePiece(this.enPassantSquarePosition, this.squares[this.enPassantSquarePosition].piece);
		}

		// Remove pieces from hash
		this.hash.updatePiece(move.from, this.squares[move.from].piece);
		this.hash.updatePiece(move.to, this.squares[move.to].piece);
		this.hash.updateColor(this.activeColor);

		this.squares[move.to] = this.squares[move.from];
		this.squares[move.from] = Board.getSquareObjectByFenNotation("empty");

		if (move.promoteToSquareInfo) {
			this.squares[move.to] = move.promoteToSquareInfo;
		}

		if (move.isCastle) {
			let rook = {
				from: 0,
				to: 0,
			};

			// Queen side castle for white or black
			if (move.to === 93 || move.to === 23) {
				rook.from = move.to - 2;
				rook.to = move.to + 1;
			}
			// King side castle for white or black
			else if (move.to === 97 || move.to === 27) {
				rook.from = move.to + 1;
				rook.to = move.to - 1;
			}

			// Remove old rook position from hash
			this.hash.updatePiece(rook.from, this.squares[rook.from].piece);
			this.hash.updatePiece(rook.to, this.squares[rook.to].piece);

			this.squares[rook.to] = this.squares[rook.from];
			this.squares[rook.from] = Board.getSquareObjectByFenNotation("empty");

			// Add new rook position to hash
			this.hash.updatePiece(rook.from, this.squares[rook.from].piece);
			this.hash.updatePiece(rook.to, this.squares[rook.to].piece);

			// Update castling information
			if (this.activeColor === "white") {
				if (this.castlingInformation.isWhiteKingSidePossible) {
					this.hash.updateCastle("isWhiteKingSideCastlePossible");
					this.castlingInformation.isWhiteKingSidePossible = false;
				}

				if (this.castlingInformation.isWhiteQueenSidePossible) {
					this.hash.updateCastle("isWhiteQueenSideCastlePossible");
					this.castlingInformation.isWhiteQueenSidePossible = false;
				}
			}
			else {
				if (this.castlingInformation.isBlackKingSidePossible) {
					this.hash.updateCastle("isBlackKingSideCastlePossible");
					this.castlingInformation.isBlackKingSidePossible = false;
				}

				if (this.castlingInformation.isBlackQueenSidePossible) {
					this.hash.updateCastle("isBlackQueenSideCastlePossible");
					this.castlingInformation.isBlackQueenSidePossible = false;
				}
			}
		}

		// Update castling information if we move a king or a rook
		// King
		else if (move.pieceType === "king") {
			if (this.activeColor === "white") {
				if (this.castlingInformation.isWhiteKingSidePossible) this.hash.updateCastle("isWhiteKingSideCastlePossible");
				if (this.castlingInformation.isWhiteQueenSidePossible) this.hash.updateCastle("isWhiteQueenSideCastlePossible");
				this.castlingInformation.isWhiteKingSidePossible = false;
				this.castlingInformation.isWhiteQueenSidePossible = false;
			}
			else {
				if (this.castlingInformation.isBlackKingSidePossible) this.hash.updateCastle("isBlackKingSideCastlePossible");
				if (this.castlingInformation.isBlackQueenSidePossible) this.hash.updateCastle("isBlackQueenSideCastlePossible");
				this.castlingInformation.isBlackKingSidePossible = false;
				this.castlingInformation.isBlackQueenSidePossible = false;
			}
		}

		// Rook
		else if (move.pieceType === "rook") {
			if (move.from === 21) {
				if (this.castlingInformation.isBlackQueenSidePossible) this.hash.updateCastle("isBlackQueenSideCastlePossible");
				this.castlingInformation.isBlackQueenSidePossible = false;
			}
			else if (move.from === 28) {
				if (this.castlingInformation.isBlackKingSidePossible) this.hash.updateCastle("isBlackKingSideCastlePossible");
				this.castlingInformation.isBlackKingSidePossible = false;
			}
			else if (move.from === 91) {
				if (this.castlingInformation.isWhiteQueenSidePossible) this.hash.updateCastle("isWhiteQueenSideCastlePossible");
				this.castlingInformation.isWhiteQueenSidePossible = false;
			}
			else if (move.from === 98) {
				if (this.castlingInformation.isWhiteKingSidePossible) this.hash.updateCastle("isWhiteKingSideCastlePossible");
				this.castlingInformation.isWhiteKingSidePossible = false;
			}
		}

		// If we capture a rook, update castling information
		if (move.willCapture) {
			if (move.to === 21) {
				if (this.castlingInformation.isBlackQueenSidePossible) this.hash.updateCastle("isBlackQueenSideCastlePossible");
				this.castlingInformation.isBlackQueenSidePossible = false;
			}
			else if (move.to === 28) {
				if (this.castlingInformation.isBlackKingSidePossible) this.hash.updateCastle("isBlackKingSideCastlePossible");
				this.castlingInformation.isBlackKingSidePossible = false;
			}
			else if (move.to === 91) {
				if (this.castlingInformation.isWhiteQueenSidePossible) this.hash.updateCastle("isWhiteQueenSideCastlePossible");
				this.castlingInformation.isWhiteQueenSidePossible = false;
			}
			else if (move.to === 98) {
				if (this.castlingInformation.isWhiteKingSidePossible) this.hash.updateCastle("isWhiteKingSideCastlePossible");
				this.castlingInformation.isWhiteKingSidePossible = false;
			}
		}

		if (move.isEnPassant) {
			if (this.activeColor === "white") {
				this.hash.updatePiece(move.to + 10, this.squares[move.to + 10].piece);
				this.squares[move.to + 10] = Board.getSquareObjectByFenNotation("empty");
				this.hash.updatePiece(move.to + 10, this.squares[move.to + 10].piece);
			}
			else {
				this.hash.updatePiece(move.to - 10, this.squares[move.to - 10].piece);
				this.squares[move.to - 10] = Board.getSquareObjectByFenNotation("empty");
				this.hash.updatePiece(move.to - 10, this.squares[move.to - 10].piece);
			}
		}

		// Update en passant square position if we move a pawn two squares
		if (move.pieceType === "pawn" && Math.abs(move.to - move.from) === 20) {
			if (this.activeColor === "white") {
				this.enPassantSquarePosition = move.to + 10;
			}
			else {
				this.enPassantSquarePosition = move.to - 10;
			}
			// Add en passant square to hash
			this.hash.updatePiece(this.enPassantSquarePosition, this.squares[this.enPassantSquarePosition].piece);
		}
		else {
			this.enPassantSquarePosition = null;
		}

		// Update Move count if black made a move
		if (this.activeColor === "black") {
			this.moveCount++;
		}

		// Update half move count since last capture or pawn move
		if (move.willCapture || move.pieceType === "pawn") {
			this.halfMoveCountSinceLastCaptureOrPawnMove = 0;
		}
		else {
			this.halfMoveCountSinceLastCaptureOrPawnMove++;
		}

		// Update active color
		this.activeColor = this.activeColor === "white" ? "black" : "white";

		// Store moves for undo
		this.moves.push(move);

		// Add pieces to hash
		this.hash.updatePiece(move.from, this.squares[move.from].piece);
		this.hash.updatePiece(move.to, this.squares[move.to].piece);
		this.hash.updateColor(this.activeColor);

		this.hashTable.increasePositionCount(this.hash.valueLow, this.hash.valueHigh);
	}

	undoLastMove() {
		const lastMove = this.moves.pop();

		if (lastMove) {
			this.hashTable.decreasePositionCount(this.hash.valueLow, this.hash.valueHigh);

			this.squares[lastMove.from] = Board.getSquareObjectByFenNotation(lastMove.piece);

			if (lastMove.capturedSquareInfo) {
				if (lastMove.isEnPassant) {
					if (lastMove.currentBoardState.activeColor === "white") {
						this.squares[lastMove.to + 10] = Board.getSquareObjectByFenNotation(lastMove.capturedSquareInfo.piece);
					}
					else {
						this.squares[lastMove.to - 10] = Board.getSquareObjectByFenNotation(lastMove.capturedSquareInfo.piece);
					}
					this.squares[lastMove.to] = Board.getSquareObjectByFenNotation("empty");
				}
				else {
					this.squares[lastMove.to] = Board.getSquareObjectByFenNotation(lastMove.capturedSquareInfo.piece);
				}
			}
			else {
				this.squares[lastMove.to] = Board.getSquareObjectByFenNotation("empty");

				if (lastMove.isCastle) {
					if (lastMove.to === 23) {
						this.squares[21] = Board.getSquareObjectByFenNotation("r");
						this.squares[24] = Board.getSquareObjectByFenNotation("empty");
					}
					else if (lastMove.to === 27) {
						this.squares[28] = Board.getSquareObjectByFenNotation("r");
						this.squares[26] = Board.getSquareObjectByFenNotation("empty");
					}
					else if (lastMove.to === 97) {
						this.squares[98] = Board.getSquareObjectByFenNotation("R");
						this.squares[96] = Board.getSquareObjectByFenNotation("empty");
					}
					else if (lastMove.to === 93) {
						this.squares[91] = Board.getSquareObjectByFenNotation("R");
						this.squares[94] = Board.getSquareObjectByFenNotation("empty");
					}
				}
			}

			this.activeColor = lastMove.currentBoardState.activeColor;
			this.castlingInformation.isWhiteKingSidePossible = lastMove.currentBoardState.castlingInformation.isWhiteKingSidePossible;
			this.castlingInformation.isWhiteQueenSidePossible = lastMove.currentBoardState.castlingInformation.isWhiteQueenSidePossible;
			this.castlingInformation.isBlackKingSidePossible = lastMove.currentBoardState.castlingInformation.isBlackKingSidePossible;
			this.castlingInformation.isBlackQueenSidePossible = lastMove.currentBoardState.castlingInformation.isBlackQueenSidePossible;
			this.enPassantSquarePosition = lastMove.currentBoardState.enPassantSquarePosition;
			this.moveCount = lastMove.currentBoardState.moveCount;
			this.halfMoveCountSinceLastCaptureOrPawnMove = lastMove.currentBoardState.halfMoveCountSinceLastCaptureOrPawnMove;
			this.hash.valueLow = lastMove.currentBoardState.hash.valueLow;
			this.hash.valueHigh = lastMove.currentBoardState.hash.valueHigh;
		}
	}

	makeMoveFromNotation(moveFEN: string) {
		// Since we are getting our moves from the GUI, we don't have to check if the move is valid
		const fromFEN: string = moveFEN.slice(0, 2);
		const toFEN: string = moveFEN.slice(2, 4);
		const promoteToFEN: string = moveFEN.slice(4, 5);

		const from = Board.getPositionFromNotation(fromFEN);
		const to = Board.getPositionFromNotation(toFEN);
		const pieceType = this.squares[from].pieceType;
		let isCastle = false;
		let isEnPassant = false;
		let promoteToSquareInfo;
		let willCapture = this.squares[Board.getPositionFromNotation(toFEN)].piece !== null;
		let capturedSquareInfo = willCapture ? this.squares[to] : undefined;

		if (pieceType === "king" && Math.abs(from - to) === 2) {
			isCastle = true;
		}

		// It's an en passant move if we move a pawn diagonally (so the first letter of the fen notation will not be the same) and the destination square is empty
		if (pieceType === "pawn" && fromFEN[0] !== toFEN[0] && this.squares[to].piece === null) {
			isEnPassant = true;
			willCapture = true;
			capturedSquareInfo = this.activeColor === "white" ? this.squares[to + 10] : this.squares[to - 10];
		}

		if (["q", "r", "b", "n"].includes(promoteToFEN)) {
			promoteToSquareInfo = Board.getSquareObjectByFenNotation(this.activeColor === "white" ? promoteToFEN.toUpperCase() : promoteToFEN.toLowerCase());
		}

		const move: Move = {
			piece: this.squares[from].piece,
			pieceType: this.squares[from].pieceType,
			from: from,
			to: to,
			willCapture: willCapture,
			capturedSquareInfo: capturedSquareInfo,
			promoteToSquareInfo: promoteToSquareInfo,
			isCastle: isCastle,
			isEnPassant: isEnPassant,
			currentBoardState: this.getCurrentBoardStateInfo(),
		};

		this.makeMove(move);
	}
}
