import { workerData } from "worker_threads";
import { communicator } from "./utils.js";

import Board from "./board.js";
import search from "./search.js";
import search_as from "./search_as.js";
import search_bm from "./search_bm.js";
import search_as_bm from "./search_as_bm.js";
import search_as_bm_10 from "./search_as_bm_10.js";
import search_as_bm_50 from "./search_as_bm_50.js";
import search_as_bm_25plus from "./search_as_bm_25+.js";

if (workerData.isDebug) {
	communicator.log("Initializing worker with following data: ");
	communicator.log(workerData);
}

let fen = workerData.fen === "startpos" ? Board.startPosFen : workerData.fen;
const board = new Board(fen);

if (workerData.moves.length > 0) {
	workerData.moves.forEach((move: string) => {
		board.makeMoveFromNotation(move);
	});
}

// Set a default best move in case we don't have time to search for a proper one
communicator.event("bestMove", Board.getFenMoveNotationFromMove(board.getPossibleMoves()[0]));

if (workerData.mode === "game" && workerData.depth === 9999) {
	let myTimeLeft = 0;

	if (workerData.time.movetime > 0) {
		myTimeLeft = workerData.time.movetime;
	}
	else {
		// adding 2 extra moves if movestogo is provided to avoid time loss
		let movesToGo = workerData.time.movestogo ? (workerData.time.movestogo + 2) : 40;

		if (board.activeColor === "white") {
			myTimeLeft += workerData.time.wtime / movesToGo  + workerData.time.winc;

			if (workerData.time.wtime < workerData.time.winc * 2) {
				// If we have less than two times the increment left, we should try to spend less time
				myTimeLeft -= workerData.time.winc / 2;
			}
		}
		else {
			myTimeLeft += workerData.time.btime / movesToGo + workerData.time.binc;

			if (workerData.time.btime < workerData.time.binc * 2) {
				// If we have less than two times the increment left, we should try to spend less time
				myTimeLeft -= workerData.time.binc / 2;
			}
		}
	}

	communicator.event("timeLeft", myTimeLeft);
}

switch (workerData.variant) {
case "bm":
	search_bm(board, workerData.depth);
	break;
case "as":
	search_as(board, workerData.depth);
	break;
case "as_bm":
	search_as_bm(board, workerData.depth);
	break;
case "as_bm_10":
	search_as_bm_10(board, workerData.depth);
	break;
case "as_bm_25":
	search_as_bm_25plus (board, workerData.depth);
	break;
case "as_bm_50":
	search_as_bm_50(board, workerData.depth);
	break;
case "raw":
	search(board, workerData.depth);
	break;
default:
	search(board, workerData.depth);
	break;
}

communicator.event("searchFinished");
