import { name, version } from "./package.json";
import Board from "./src/board";

const isDev: boolean = process.argv.includes("--dev");
const isDebug: boolean = process.argv.includes("--debug");

function printBoardToConsole(board: Board) {
	let boardString: string = " —————————————————————————————————\n";
	for (let i = 20; i < 100; i++) {
		if (i !== 20 && i % 10 === 0) boardString += " |\n —————————————————————————————————\n";

		if (!board._squares[i].isOnBoard) continue;

		boardString += ` | ${board._squares[i].fenNotation}`;
	}
	boardString += " |\n —————————————————————————————————\n";
	console.log(boardString);

	if (isDebug) {
		console.log(`${board._activeSide} to play | Possible moves: ${board.getPossibleMoves().length} | King check: ${board.isCheck()} | Checkmate: ${board.isCheckmate()}`);
		console.log(`Move: ${board._moveCount} (${board._halfMoveCountSinceLastCaptureOrPawnMove}) | O-O: ${board._castlingInformation.isWhiteKingSidePossible} | O-O-O: ${board._castlingInformation.isWhiteQueenSidePossible} | o-o: ${board._castlingInformation.isBlackKingSidePossible} | o-o-o: ${board._castlingInformation.isBlackQueenSidePossible} | en passant: ${board._enPassantSquare} (${board._enPassantSquare ? Board.getIndexFromNotation(board._enPassantSquare.toString()) : "-"})`);
	}
}

console.log(`${name} ${version} is starting and working in ${isDev ? "development" : "production"} mode ${isDebug ? "and debugging is activated" : ""} ...`);

process.stdin.on("data", (inputData: string) => {
	const input: string = inputData.toString();
	if (isDev) {
		if (input.split(" ")[0] === "fen") {
			board = new Board(input.substring(4));
			printBoardToConsole(board);
		}
	}
});

let board = new Board(Board.startPosFen);
printBoardToConsole(board);
