import Board from "./board";
import evaluate from "./evaluate";
import { communicator } from "./utils";

export default function search(board: Board, depth: number) {
	let nodes = 0;
	let startTime = Date.now();

	function mainSearch(alpha: number, beta: number, depthleft: number) {
		if (depthleft === 0) {
			const activeColorScore = board.activeColor === "white" ? 1 : -1;

			return evaluate(board) * activeColorScore;
		}

		nodes++;

		const moves = board.getPossibleMoves();

		for (let i = 0; i < moves.length; i++) {
			board.makeMove(moves[i]);

			let score = -mainSearch(-beta, -alpha, depthleft - 1);

			board.undoLastMove();

			if (score >= beta) {
				return beta;
			}

			if (score > alpha) {
				alpha = score;
				board.hashTable.addCacheItem(moves[i]);
			}
		}

		return alpha;
	}

	for (let i = 1; i <= depth; i++) {
		board.hashTable.cache = {};

		let score = mainSearch(-Infinity, Infinity, i);

		let currentTime = Date.now() - startTime + 1; // +1 to avoid division by zero
		let nps = Math.floor(nodes / (currentTime / 1000));
		let scoreInfo = "";
		if (score === 10000) {
			scoreInfo = "mate " + Math.round(i / 2);
		}
		else if (score === -10000) {
			scoreInfo = "mate -" + Math.round(i / 2);
		}
		else {
			scoreInfo = `cp ${score}`;
		}

		let info = `info depth ${i} score ${scoreInfo} time ${currentTime} nodes ${nodes} nps ${nps} pv ${board.hashTable.getPvFromHashTable(i)}`;
		let bestMove = board.hashTable.getCacheItem();

		communicator.log(info);
		communicator.event("bestMove", Board.getFenMoveNotationFromMove(bestMove));

		if (score === 10000 || score === -10000) break;
	}
}
