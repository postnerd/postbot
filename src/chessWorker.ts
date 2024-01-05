import { workerData as data } from "worker_threads";
import { communicator, printBoardToConsole } from "./utils.js";

import Board from "./board.js";
import search from "./search.js";

export interface WorkerData {
	mode: "analyze" | "game",
	moves: string[],
	fen: string,
	isDebug: boolean,
	time: {
		white: number,
		black: number,
		whiteIncrement: number,
		blackIncrement: number,
		movesToGo: number,
		moveTime: number,
	},
	depth: number,
}

const workerData: WorkerData = data;

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
communicator.event("bestMove", Board.getFenMoveNotationFromMove(board.getPossibleMoves(true)[0]));

if (workerData.mode === "game" && workerData.depth === 9999) {
	let myTimeLeft = 0;

	if (workerData.time.moveTime > 0) {
		myTimeLeft = workerData.time.moveTime;
	}
	else {
		// adding 2 extra moves if movestogo is provided to avoid time loss
		const movesToGo = workerData.time.movesToGo ? (workerData.time.movesToGo + 2) : 40;
		const time = board.activeColor === "white" ? workerData.time.white : workerData.time.black;
		const timeIncrement = board.activeColor === "white" ? workerData.time.whiteIncrement : workerData.time.blackIncrement;

		myTimeLeft += time / movesToGo  + timeIncrement;

		if (time < timeIncrement * 2) {
			// If we have less than two times the increment left, we should try to spend less time
			myTimeLeft -= timeIncrement / 2;
		}
	}

	communicator.event("timeLeft", myTimeLeft);
}

try {
	search(board, workerData.depth);
}
catch (error) {
	communicator.log(error);
	printBoardToConsole(board);
	process.exit(1);
}

communicator.event("searchFinished");
