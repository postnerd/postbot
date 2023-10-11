import Board, { type Move } from "./board";
import { parentPort } from "worker_threads";

export function printBoardToConsole(board: Board) {
	const getComputedHash = board.hash.getComputedHash(board);

	let boardString: string = " —————————————————————————————————\n";
	for (let i = 20; i < 100; i++) {
		if (i !== 20 && i % 10 === 0) boardString += " |\n —————————————————————————————————\n";

		if (!Board.isOnBoard(i)) continue;

		boardString += ` | ${board.squares[i].piece ?? " "}`;
	}
	boardString += " |\n —————————————————————————————————\n";
	communicator.log(boardString);

	communicator.log(`${board.activeColor} to play | Possible moves: ${board.getPossibleMoves().length} | King check: ${board.isCheck()} | Checkmate: ${board.isCheckmate()}`);
	communicator.log(`Move: ${board.moveCount} (${board.halfMoveCountSinceLastCaptureOrPawnMove}) | O-O: ${board.castlingInformation.isWhiteKingSidePossible} | O-O-O: ${board.castlingInformation.isWhiteQueenSidePossible} | o-o: ${board.castlingInformation.isBlackKingSidePossible} | o-o-o: ${board.castlingInformation.isBlackQueenSidePossible} | en passant: ${board.enPassantSquarePosition}`);
	communicator.log(`Current Hash: low ${board.hash.valueLow} | high ${board.hash.valueHigh}`);
	communicator.log(`Computed Hash: low ${getComputedHash[0]} | high ${getComputedHash[1]}`);
	let movesPlayed = "";
	board.moves.forEach((move) => {
		movesPlayed += Board.getFenMoveNotationFromMove(move) + " ";
	});
	communicator.log(`Moves played: ${movesPlayed}`);
}

export const communicator = {
	event(event: string, data?: any) {
		if (parentPort !== null) {
			parentPort.postMessage({
				event,
				data,
			});
		}
	},
	log(message: any) {
		if (parentPort !== null) {
			parentPort.postMessage({
				event: "log",
				message,
			});
		}
	},
	debug(message: any) {
		if (parentPort !== null) {
			parentPort.postMessage({
				event: "debug",
				message,
			});
		}
	},
};

export function getPvFromHashTable(depth: number, board: Board) {
	let moves: Move[] = [];
	let pv = "";

	for (let i = 0; i < depth; i++) {
		const bestmove = board.hashTable.getBestMove(board.hash.valueLow, board.hash.valueHigh);
		if (bestmove !== undefined) {
			moves[i] = bestmove;
			pv += Board.getFenMoveNotationFromMove(moves[i]) + " ";
			board.makeMove(moves[i]);
		}
		else {
			break;
		}
	}

	for (let i = moves.length - 1; i >= 0; i--) {
		board.undoLastMove();
	}

	return pv;
}
