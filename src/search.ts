import Board from "./board";
import { Move } from "./board";
import evaluate from "./evaluate";

export default function search(board: Board, depth: number) {
	let bestMove: Move[];

	function negaMax(depthleft: number) {
		if (depthleft === 0) {
			const activeColorScore = board.activeColor === "white" ? 1 : -1;

			return evaluate(board) * activeColorScore;
		}

		let alpha = -Infinity;

		const moves = board.getPossibleMoves();

		for (let i = 0; i < moves.length; i++) {
			board.makeMove(moves[i]);

			let score = -negaMax(depthleft - 1);

			board.undoLastMove();

			if (score > alpha) {
				alpha = score;
				bestMove[depthleft] = moves[i];
			}
		}

		return alpha;
	}

	for (let i = 1; i <= depth; i++) {
		bestMove = [];

		let score = negaMax(i);

		let info = `info depth ${i} score cp ${score} pv ${Board.getFenNotationFromPosition(bestMove[i].from)}${Board.getFenNotationFromPosition(bestMove[i].to)}`;
		console.log(info);
	}
}
