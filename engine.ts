import { name, version } from "./package.json";
import Board from "./src/board";

const isDev: boolean = process.argv.includes("--dev");
const isDebug: boolean = process.argv.includes("--debug");

function printBoardToConsole(board: Board) {
	let boardString: string = " —————————————————————————————————\n";
	for (let i = 20; i < 100; i++) {
		if (i !== 20 && i % 10 === 0) boardString += " |\n —————————————————————————————————\n";

		if (!board.squares[i].isOnBoard) continue;

		boardString += ` | ${board.squares[i].piece ?? " "}`;
	}
	boardString += " |\n —————————————————————————————————\n";
	console.log(boardString);

	if (isDebug) {
		console.log(`${board.activeColor} to play | Possible moves: ${board.getPossibleMoves().length} | King check: ${board.isCheck()} | Checkmate: ${board.isCheckmate()}`);
		console.log(`Move: ${board.moveCount} (${board.halfMoveCountSinceLastCaptureOrPawnMove}) | O-O: ${board.castlingInformation.isWhiteKingSidePossible} | O-O-O: ${board.castlingInformation.isWhiteQueenSidePossible} | o-o: ${board.castlingInformation.isBlackKingSidePossible} | o-o-o: ${board.castlingInformation.isBlackQueenSidePossible} | en passant: ${board.enPassantSquarePosition} (${board.enPassantSquarePosition ? Board.getIndexFromNotation(board.enPassantSquarePosition.toString()) : "-"})`);
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
