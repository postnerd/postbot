import Board from "./board";
import evaluate from "./evaluate";
import { communicator } from "./utils";

export default function search(board: Board, depth: number) {
	let nodes = 0;
	let startTime = Date.now();

	function negaMax(depthleft: number) {
		if (depthleft === 0) {
			const activeColorScore = board.activeColor === "white" ? 1 : -1;

			return evaluate(board) * activeColorScore;
		}

		nodes++;
		let alpha = -Infinity;

		const moves = board.getPossibleMoves();

		for (let i = 0; i < moves.length; i++) {
			board.makeMove(moves[i]);

			let score = -negaMax(depthleft - 1);

			board.undoLastMove();

			if (score > alpha) {
				alpha = score;
				board.hashTable.addCacheItem(moves[i]);
			}
		}

		return alpha;
	}

	for (let i = 1; i <= depth; i++) {
		board.hashTable.cache = {};

		let score = negaMax(i);

		let currentTime = Date.now() - startTime;
		let nps = nodes / (currentTime / 1000);
		let info = `info depth ${i} score cp ${score} time ${currentTime} nodes ${nodes} nps ${nps} pv ${board.hashTable.getPvFromHashTable(board, i)}`;
		let bestMove = board.hashTable.getCacheItem();

		communicator.log(info);
		communicator.event("bestMove", Board.getFenMoveNotationFromMove(bestMove));

		if (score === 10000 || score === -10000) break;
	}
}
