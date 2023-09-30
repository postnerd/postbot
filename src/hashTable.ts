import Board, { Piece, Move } from "./board";

interface HashEntry {
	bestMove: Move | undefined;
	positionCount: number;
}

export default class HashTable {
	cache: {[key: string]: HashEntry} = {};

	constructor() {
	}

	initHashItem(hash: number) {
		this.cache[hash] = {
			bestMove: undefined,
			positionCount: 0,
		};
	}

	getPositionCount(hash: number) {
		return this.cache[hash].positionCount;
	}

	increasePositionCount(hash: number) {
		if (this.cache[hash] === undefined) {
			this.initHashItem(hash);
		}

		this.cache[hash].positionCount++;
	}

	decreasePositionCount(hash: number) {
		this.cache[hash].positionCount--;
	}

	addBestMove(move: Move, hash: number) {
		if (this.cache[hash] === undefined) {
			this.initHashItem(hash);
		}

		this.cache[hash].bestMove = move;
	}

	getBestMove(hash: number) {
		if (!this.cache[hash]) return undefined;

		return this.cache[hash].bestMove;
	}
}
