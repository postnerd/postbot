import Board from "./board";
import evaluate from "./evaluate";
import { communicator, getPvFromHashTable } from "./utils";

export default function search(board: Board, depth: number) {
	let nodes = 0;
	let startTime = Date.now();

	function captureSearch(alpha: number, beta: number) {
		const activeColorScore = board.activeColor === "white" ? 1 : -1;
		const score = evaluate(board) * activeColorScore;

		if (score >= beta) {
			return beta;
		}

		if (alpha < score) {
			alpha = score;
		}

		const moves = board.getPossibleMoves();

		for (let i = 0; i < moves.length; i++) {
			if (moves[i].willCapture) {
				nodes++;

				board.makeMove(moves[i]);

				let score = -captureSearch(-beta, -alpha);

				board.undoLastMove();

				if (score >= beta) {
					return beta;
				}

				if (score > alpha) {
					alpha = score;
				}
			}
		}

		return alpha;
	}

	function mainSearch(alpha: number, beta: number, depthleft: number) {
		if (depthleft === 0) {
			return captureSearch(alpha, beta);
		}

		nodes++;

		const moves = board.getPossibleMoves();

		if (moves.length === 0) {
			return captureSearch(alpha, beta);
		}

		for (let i = 0; i < moves.length; i++) {
			board.makeMove(moves[i]);

			let score = -mainSearch(-beta, -alpha, depthleft - 1);

			board.undoLastMove();

			if (score >= beta) {
				return beta;
			}

			if (score > alpha) {
				alpha = score;
				board.hashTable.addBestMove(moves[i], board.hash.value);
			}
		}

		return alpha;
	}

	for (let i = 1; i <= depth; i++) {
		let score = mainSearch(-Infinity, Infinity, i);

		let currentTime = Date.now() - startTime + 1; // +1 to avoid division by zero
		let nps = Math.floor(nodes / (currentTime / 1000));
		let pv = getPvFromHashTable(i, board);

		let scoreInfo = "";
		if (score === 10000) {
			scoreInfo = "mate " + Math.round(pv.split(" ").length / 2);
		}
		else if (score === -10000) {
			scoreInfo = "mate -" + Math.round(pv.split(" ").length / 2);
		}
		else {
			scoreInfo = `cp ${score}`;
		}



		let info = `info depth ${i} score ${scoreInfo} time ${currentTime} nodes ${nodes} nps ${nps} pv ${pv}`;
		let bestMove = board.hashTable.getBestMove(board.hash.value);

		communicator.log(info);
		if (bestMove !== undefined) {
			communicator.event("bestMove", Board.getFenMoveNotationFromMove(bestMove));
		}
	}
}
