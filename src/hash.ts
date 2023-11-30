import Board, { Piece } from "./board.js";
import { Random, MersenneTwister19937 } from "random-js";

// -940586136 is just a crazy random number, kudo to mattiasahlsen ;-)
const random = new Random(MersenneTwister19937.seed(-940586136));

function randomInt() {
	return random.integer(-Math.pow(2, 31), Math.pow(2, 31) - 1);
}

function getPieceZobristIndex(piece: string | null) {

	switch (piece) {
	case "K": return 0;
	case "Q": return 1;
	case "R": return 2;
	case "B": return 3;
	case "N": return 4;
	case "P": return 5;
	case "k": return 6;
	case "q": return 7;
	case "r": return 8;
	case "b": return 9;
	case "n": return 10;
	case "p": return 11;
	case null: return 12;
	}

	throw new Error(`Can't get zobrist index for invalid piece ${piece}`);
}

export default class Hash {
	zobristTableLow: number[][] = new Array(99);
	zobristTableHigh: number[][] = new Array(99);
	zobristWhiteLow = randomInt();
	zobristWhiteHigh = randomInt();
	zobristBlackLow = randomInt();
	zobristBlackHigh = randomInt();
	zobristIsWhiteKingSideCastlePossibleLow = randomInt();
	zobristIsWhiteKingSideCastlePossibleHigh = randomInt();
	zobristIsWhiteQueenSideCastlePossibleLow = randomInt();
	zobristIsWhiteQueenSideCastlePossibleHigh = randomInt();
	zobristIsBlackKingSideCastlePossibleLow = randomInt();
	zobristIsBlackKingSideCastlePossibleHigh = randomInt();
	zobristIsBlackQueenSideCastlePossibleLow = randomInt();
	zobristIsBlackQueenSideCastlePossibleHigh = randomInt();
	valueLow: number = 0;
	valueHigh: number = 0;

	constructor(board: Board) {
		this.initZobristTable();
		const hashes = this.getComputedHash(board);
		this.valueLow = hashes[0];
		this.valueHigh = hashes[1];
	}

	initZobristTable() {
		for (let i = 0; i < 99; i++) {
			this.zobristTableLow[i] = new Array(13);
			this.zobristTableHigh[i] = new Array(13);
		}

		for (let i = 0; i < 99; i++) {
			for (let j = 0; j < 13; j++) {
				this.zobristTableLow[i][j] = randomInt();
				this.zobristTableHigh[i][j] = randomInt();
			}
		}
	}

	// TODO: Include information like castling rights, en passant square, active color
	getComputedHash(board: Board): number[] {
		let hashLow = 0;
		let hashHigh = 0;
		for (let i = 21; i < 99; i++) {
			if (board.squares[i] !== null) {
				const piece = board.squares[i].piece;

				hashLow ^= this.zobristTableLow[i][getPieceZobristIndex(piece)];
				hashHigh ^= this.zobristTableHigh[i][getPieceZobristIndex(piece)];
			}
		}

		if (board.activeColor === "white") {
			hashLow ^= this.zobristWhiteLow;
			hashHigh ^= this.zobristWhiteHigh;
		}
		else {
			hashLow ^= this.zobristBlackLow;
			hashHigh ^= this.zobristBlackHigh;
		}

		if (board.enPassantSquarePosition !== null) {
			const piece = board.squares[board.enPassantSquarePosition].piece;
			hashLow ^= this.zobristTableLow[board.enPassantSquarePosition][getPieceZobristIndex(piece)];
			hashHigh ^= this.zobristTableHigh[board.enPassantSquarePosition][getPieceZobristIndex(piece)];
		}

		if (board.castlingInformation.isWhiteKingSidePossible) {
			hashLow ^= this.zobristIsWhiteKingSideCastlePossibleLow;
			hashHigh ^= this.zobristIsWhiteKingSideCastlePossibleHigh;
		}

		if (board.castlingInformation.isWhiteQueenSidePossible) {
			hashLow ^= this.zobristIsWhiteQueenSideCastlePossibleLow;
			hashHigh ^= this.zobristIsWhiteQueenSideCastlePossibleHigh;
		}

		if (board.castlingInformation.isBlackKingSidePossible) {
			hashLow ^= this.zobristIsBlackKingSideCastlePossibleLow;
			hashHigh ^= this.zobristIsBlackKingSideCastlePossibleHigh;
		}

		if (board.castlingInformation.isBlackQueenSidePossible) {
			hashLow ^= this.zobristIsBlackQueenSideCastlePossibleLow;
			hashHigh ^= this.zobristIsBlackQueenSideCastlePossibleHigh;
		}

		return [hashLow, hashHigh];
	}

	updatePiece(square: number, piece: Piece | null) {
		this.valueLow ^= this.zobristTableLow[square][getPieceZobristIndex(piece)];
		this.valueHigh ^= this.zobristTableHigh[square][getPieceZobristIndex(piece)];
	}

	updateColor(color: "white" | "black") {
		this.valueLow ^= color === "white" ? this.zobristWhiteLow : this.zobristBlackLow;
		this.valueHigh ^= color === "white" ? this.zobristWhiteHigh : this.zobristBlackHigh;
	}

	updateCastle(castleInformation: "isWhiteKingSideCastlePossible" | "isWhiteQueenSideCastlePossible" | "isBlackKingSideCastlePossible" | "isBlackQueenSideCastlePossible") {
		if (castleInformation === "isWhiteKingSideCastlePossible") {
			this.valueLow ^= this.zobristIsWhiteKingSideCastlePossibleLow;
			this.valueHigh ^= this.zobristIsWhiteKingSideCastlePossibleHigh;
		}
		else if (castleInformation === "isWhiteQueenSideCastlePossible") {
			this.valueLow ^= this.zobristIsWhiteQueenSideCastlePossibleLow;
			this.valueHigh ^= this.zobristIsWhiteQueenSideCastlePossibleHigh;
		}
		else if (castleInformation === "isBlackKingSideCastlePossible") {
			this.valueLow ^= this.zobristIsBlackKingSideCastlePossibleLow;
			this.valueHigh ^= this.zobristIsBlackKingSideCastlePossibleHigh;
		}
		else if (castleInformation === "isBlackQueenSideCastlePossible") {
			this.valueLow ^= this.zobristIsBlackQueenSideCastlePossibleLow;
			this.valueHigh ^= this.zobristIsBlackQueenSideCastlePossibleHigh;
		}
	}
}
