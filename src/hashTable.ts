import { Move } from "./board.js";

interface HashEntry {
	bestMove: Move | undefined;
	positionCount: number;
	eval: number | undefined;
}

export default class HashTable {
	cache: Map<number, Map<number, HashEntry>>;

	constructor() {
		this.cache = new Map();
	}

	initHashItem(hashLow: number, hashHigh: number) {
		this.cache.set(hashLow, new Map());

		this.cache.get(hashLow)?.set(hashHigh, {
			bestMove: undefined,
			positionCount: 0,
			eval: undefined,
		});
	}

	getPositionCount(hashLow: number, hashHigh: number) {
		return this.cache.get(hashLow)?.get(hashHigh)?.positionCount;
	}

	increasePositionCount(hashLow: number, hashHigh: number) {
		if (!this.cache.has(hashLow)) {
			this.initHashItem(hashLow, hashHigh);
		}

		let entry = this.cache.get(hashLow)?.get(hashHigh);

		if (entry && entry.positionCount !== undefined) entry.positionCount++;
	}

	decreasePositionCount(hashLow: number, hashHigh: number) {
		let entry = this.cache.get(hashLow)?.get(hashHigh);

		if (entry) entry.positionCount--;
	}

	addBestMove(move: Move, hashLow: number, hashHigh: number) {
		if (!this.cache.has(hashLow)) {
			this.initHashItem(hashLow, hashHigh);
		}

		let entry = this.cache.get(hashLow)?.get(hashHigh);
		if (entry) entry.bestMove = move;
	}

	getBestMove(hashLow: number, hashHigh: number) {
		let entry = this.cache.get(hashLow)?.get(hashHigh);

		if (entry) return entry.bestMove;

		return undefined;
	}

	addScore(score: number, hashLow: number, hashHigh: number) {
		if (!this.cache.has(hashLow)) {
			this.initHashItem(hashLow, hashHigh);
		}

		let entry = this.cache.get(hashLow)?.get(hashHigh);
		if (entry) entry.eval = score;
	}

	getScore(hashLow: number, hashHigh: number) {
		return this.cache.get(hashLow)?.get(hashHigh)?.eval;
	}
}
