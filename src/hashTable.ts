import Board, { Piece, Move } from "./board";

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

export default class HashTable {
	board: Board;
	zobristTable: number[][] = new Array(99);
	zobristWhite = randomInt();
	zobristBlack = randomInt();
	cache: {[key: string]: Move} = {};

	constructor(board: Board) {
		this.board = board;

		this.initZobristTable();
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

	addCacheItem(move: Move, hash?: number) {
		if (hash === undefined) {
			hash = this.board.hash;
		}

		this.cache[hash] = move;
	}

	getCacheItem(hash?: number) {
		if (hash === undefined) {
			hash = this.board.hash;
		}

		return this.cache[hash];
	}

	// TODO: Include informations like castling rights, en passant square, active color
	getComputedHash(): number {
		let hash = 0;
		for (let i = 21; i < 99; i++) {
			if (this.board.squares[i] !== null) {
				const piece = this.board.squares[i].piece;

				hash ^= this.zobristTable[i][getPieceZobristIndex(piece)];
			}
		}

		if (this.board.activeColor === "white") {
			hash ^= this.zobristWhite;
		}
		else {
			hash ^= this.zobristBlack;
		}

		return hash;
	}

	getHashFromSquareAndPiece(square: number, piece: Piece): number {
		return this.zobristTable[square][getPieceZobristIndex(piece)];
	}

	getPvFromHashTable(depth: number) {
		let moves: Move[] = [];
		let pv = "";
		const board = this.board;

		for (let i = 0; i < depth; i++) {
			if (board.hashTable.cache[board.hash] !== undefined) {
				moves[i] = board.hashTable.getCacheItem();
				pv += Board.getFenMoveNotationFromMove(moves[i]) + " ";
				board.makeMove(moves[i]);
			}
			else {
				break;
			}
		}

		for (let i = moves.length - 1; i >= 0; i--) {
			board.undoLastMove();
		}

		return pv;
	}
}
