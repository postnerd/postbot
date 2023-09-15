import Board from "./board";

export function printBoardToConsole(board: Board, isDebug: boolean) {
	let boardString: string = " —————————————————————————————————\n";
	for (let i = 20; i < 100; i++) {
		if (i !== 20 && i % 10 === 0) boardString += " |\n —————————————————————————————————\n";

		if (!Board.isOnBoard(i)) continue;

		boardString += ` | ${board.squares[i].piece ?? " "}`;
	}
	boardString += " |\n —————————————————————————————————\n";
	console.log(boardString);

	if (isDebug) {
		console.log(`${board.activeColor} to play | Possible moves: ${board.getPossibleMoves().length} | King check: ${board.isCheck()} | Checkmate: ${board.isCheckmate()}`);
		console.log(`Move: ${board.moveCount} (${board.halfMoveCountSinceLastCaptureOrPawnMove}) | O-O: ${board.castlingInformation.isWhiteKingSidePossible} | O-O-O: ${board.castlingInformation.isWhiteQueenSidePossible} | o-o: ${board.castlingInformation.isBlackKingSidePossible} | o-o-o: ${board.castlingInformation.isBlackQueenSidePossible} | en passant: ${board.enPassantSquarePosition}`);
		console.log(`Current Hash: ${board.hash}`);
		if (board.bestMove !== null)
			console.log(`Current best move: ${board.bestMove.from} ${board.bestMove.to}`);
	}
}
