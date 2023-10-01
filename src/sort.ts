import Board, { Move, PieceType } from "./board";

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

export default function sortMoves(moves: Move[], board: Board) : Move[] {

	// sort moves by best captures first
	moves.sort((a: Move, b: Move) => {
		const aCapturedPieceType = a.capturedSquareInfo ? a.capturedSquareInfo.pieceType : null;
		const bCapturedPieceType = b.capturedSquareInfo ? b.capturedSquareInfo.pieceType : null;

		return (getPieceTypeValue(bCapturedPieceType) / getPieceTypeValue(b.pieceType)) - (getPieceTypeValue(aCapturedPieceType) / getPieceTypeValue(a.pieceType));
	});

	// Current best move should be first in the array
	const currentBestMove = board.hashTable.getBestMove(board.hash.valueLow, board.hash.valueHigh);

	if (currentBestMove !== undefined) {
		moves.sort((a: Move) => {
			if (a.to === currentBestMove.to && a.from === currentBestMove.from) {
				return -1;
			}

			return 0;
		});
	}

	return moves;
}
