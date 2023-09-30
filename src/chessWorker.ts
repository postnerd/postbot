import { workerData } from "worker_threads";
import { communicator } from "./utils";

import Board from "./board";
import search from "./search";

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

if (workerData.mode === "game") {
	let myTimeLeft = 0;
	// adding 2 extra moves if movestogo is provided to avoid time loss
	let movesToGo = workerData.time.movestogo ? (workerData.time.movestogo + 2) : 40;

	if (board.activeColor === "white") {
		myTimeLeft += workerData.time.wtime / movesToGo  + workerData.time.winc;
	}
	else {
		myTimeLeft += workerData.time.btime / movesToGo + workerData.time.binc;
	}

	communicator.event("timeLeft", myTimeLeft);
}

search(board, 9999);

communicator.event("searchFinished");
