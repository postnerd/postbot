import Board, { Move, PieceType } from "./board.js";
import evaluate from "./evaluate.js";
import { communicator, getPvFromHashTable } from "./utils.js";

interface TtEntry {
	depth: number;
	score: number;
	type: "exact" | "lowerBound" | "upperBound";
}

const killerMoves: Map<number, Move[]> = new Map();

function getPieceTypeValue(pieceType: PieceType) {
	switch (pieceType) {
	case "pawn": return 1;
	case "knight": return 3;
	case "bishop": return 3;
	case "rook": return 5;
	case "queen": return 9;
	case "king": return 12;
	default: return 0;
	}
}

function sortMoves(moves: Move[], board: Board, ply: number) : Move[] {
	// Current best move should be first in the array
	const currentBestMove = board.hashTable.getBestMove(board.hash.valueLow, board.hash.valueHigh);

	// Giving a move score
	for (let i = 0; i < moves.length; i++) {
		const move = moves[i];

		// Current best move should be first in the array
		if (currentBestMove !== undefined && move.to === currentBestMove.to && move.from === currentBestMove.from) {
			move.score = 100000;
		}
		// Captures should be sorted by best captures
		else if (move.willCapture) {
			move.score = getPieceTypeValue(move.capturedSquareInfo!.pieceType) / getPieceTypeValue(move.pieceType) * 100;
		}
		// Killer moves
		else if (killerMoves.get(ply)!.length > 0) {
			const killers = killerMoves.get(ply);
			const count = killers!.length > 1 ? 2 : 1;

			for (let j = 0; j < count; j++) {
				if (killers![j].from === move.from && killers![j].to === move.to) {
					move.score = 1;
				}
			}
		}
	}

	moves.sort((moveA: Move, moveB: Move) => {
		const scoreA = moveA.score || 0;
		const scoreB = moveB.score || 0;
		return scoreB - scoreA;
	});

	return moves;
}

export default function search(board: Board, depth: number) {
	let nodes = 0;
	let startTime = Date.now();
	let finalScore: number | null = null;
	let tt: {[key: number]: {[key: number]: TtEntry}} = {};

	for (let i = 0; i < 9999; i++) {
		killerMoves.set(i, []);
	}

	function captureSearch(alpha: number, beta: number, ply: number) {
		if (board.halfMoveCountSinceLastCaptureOrPawnMove >= 100 || board.hashTable.getPositionCount(board.hash.valueLow, board.hash.valueHigh) === 3 || board.isStalemate()) {
			return 0;
		}

		const activeColorScore = board.activeColor === "white" ? 1 : -1;
		const score = evaluate(board) * activeColorScore;

		if (score >= beta) {
			return beta;
		}

		if (alpha < score) {
			alpha = score;
		}

		const moves = sortMoves(board.getPossibleMoves(), board, ply);

		for (let i = 0; i < moves.length; i++) {
			if (moves[i].willCapture) {
				nodes++;

				board.makeMove(moves[i]);

				let score = -captureSearch(-beta, -alpha, ply + 1);

				board.undoLastMove();

				if (score >= beta) {
					return beta;
				}

				if (score > alpha) {
					board.hashTable.addBestMove(moves[i], board.hash.valueLow, board.hash.valueHigh);
					alpha = score;
				}
			}
		}

		return alpha;
	}

	function mainSearch(alpha: number, beta: number, depthLeft: number, ply: number) {
		const alphaOriginal = alpha;
		let hashEntry = tt[board.hash.valueLow] ? tt[board.hash.valueLow][board.hash.valueHigh] : undefined;

		if (hashEntry) {
			if (hashEntry.depth >= depthLeft) {
				if (hashEntry.type === "exact") {
					return hashEntry.score;
				}
				else if (hashEntry.type === "lowerBound") {
					alpha = Math.max(alpha, hashEntry.score);
				}
				else if (hashEntry.type === "upperBound") {
					beta = Math.min(beta, hashEntry.score);
				}

				if (alpha >= beta) {
					return hashEntry.score;
				}
			}
		}

		if (board.halfMoveCountSinceLastCaptureOrPawnMove >= 100 || board.hashTable.getPositionCount(board.hash.valueLow, board.hash.valueHigh) === 3) {
			return 0;
		}

		if (depthLeft === 0) {
			return captureSearch(alpha, beta, ply);
		}

		nodes++;

		const moves = sortMoves(board.getPossibleMoves(), board, ply);

		if (moves.length === 0) {
			return captureSearch(alpha, beta, ply + 1);
		}

		let evaluationScore = -Infinity;

		for (let i = 0; i < moves.length; i++) {
			board.makeMove(moves[i]);

			let score = -mainSearch(-beta, -alpha, depthLeft - 1, ply + 1);

			board.undoLastMove();

			if (score > evaluationScore) {
				board.hashTable.addBestMove(moves[i], board.hash.valueLow, board.hash.valueHigh);
				evaluationScore = score;
			}

			alpha = Math.max(alpha, evaluationScore);

			if (alpha >= beta) {
				if (!moves[i].willCapture) {
					killerMoves.get(ply)!.unshift(moves[i]);
				}
				break;
			}
		}

		let ttEntry: TtEntry = {
			depth: depthLeft,
			score: evaluationScore,
			type: "exact",
		};

		if (evaluationScore <= alphaOriginal) {
			ttEntry.type = "upperBound";
		}
		else if (evaluationScore >= beta) {
			ttEntry.type = "lowerBound";
		}
		tt[board.hash.valueLow] = {};
		tt[board.hash.valueLow][board.hash.valueHigh] = ttEntry;

		return evaluationScore;
	}

	for (let i = 1; i <= depth; i++) {
		let alpha = finalScore === null ? -Infinity : finalScore - 25;
		let beta = finalScore === null ? Infinity : finalScore + 25;

		let score = mainSearch(alpha, beta, i, 0);

		while (score <= alpha || score >= beta) {
			if (score <= alpha) {
				communicator.debug(`Score is lower than alpha (${score} <= ${alpha})`);
				alpha = alpha === 0 ? alpha -= 0.1 : alpha - Math.abs(alpha * 2);
				score = mainSearch(alpha, beta, i, 0);
			}
			else if (score >= beta) {
				communicator.debug(`Score is higher than beta (${score} >= ${beta})`);
				beta = beta === 0 ? beta += 0.1 : beta + Math.abs(beta * 2);
				score = mainSearch(alpha, beta, i, 0);
			}
		}

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
		let bestMove = board.hashTable.getBestMove(board.hash.valueLow, board.hash.valueHigh);

		communicator.log(info);
		if (bestMove !== undefined) {
			communicator.event("bestMove", Board.getFenMoveNotationFromMove(bestMove));
		}

		finalScore = score;
	}

	return finalScore;
}
