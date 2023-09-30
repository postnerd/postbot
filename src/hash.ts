import Board, { Piece } from "./board";

function randomInt() {
	let min = 0;
	let max = Math.pow(2, 64);
	return Math.floor(Math.random() * (max - min) + min);
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
	zobristTable: number[][] = new Array(99);
	zobristWhite = randomInt();
	zobristBlack = randomInt();
	value: number = 0;

	constructor(board: Board) {
		this.initZobristTable();
		this.value = this.getComputedHash(board);
	}

	initZobristTable() {
		for (let i = 0; i < 99; i++) {
			this.zobristTable[i] = new Array(13);
		}

		for (let i = 0; i < 99; i++) {
			for (let j = 0; j < 13; j++) {
				this.zobristTable[i][j] = randomInt();
			}
		}
	}

	// TODO: Include informations like castling rights, en passant square, active color
	getComputedHash(board: Board): number {
		let hash = 0;
		for (let i = 21; i < 99; i++) {
			if (board.squares[i] !== null) {
				const piece = board.squares[i].piece;

				hash ^= this.zobristTable[i][getPieceZobristIndex(piece)];
			}
		}

		if (board.activeColor === "white") {
			hash ^= this.zobristWhite;
		}
		else {
			hash ^= this.zobristBlack;
		}

		return hash;
	}

	updatePiece(square: number, piece: Piece | null) {
		this.value ^= this.zobristTable[square][getPieceZobristIndex(piece)];
	}

	updateColor(color: "white" | "black") {
		this.value ^= color === "white" ? this.zobristWhite : this.zobristBlack;
	}

}
