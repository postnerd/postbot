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

communicator.event("bestMove", Board.getFenMoveNotationFromMove(board.getPossibleMoves()[0]));

if (workerData.mode === "analyze") {
	search(board, 9999);
}
else {
	search(board, 4);
}

communicator.event("searchFinished");
