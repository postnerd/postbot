import Board from "./board";

export default class Game {
	id: string;
	board: Board;

	constructor(id: string) {
		this.id = id;
		this.board = new Board(Board.startPosFen);
	}

	makeMove(move: string) {
		this.board.makeMoveFromNotation(move);
	}

	bestMove() {
		const possibleMoves = this.board.getPossibleMoves();
		const lengthOfPossibleMoves = possibleMoves.length;
		const randomIndex = Math.floor(Math.random() * lengthOfPossibleMoves);

		const from = possibleMoves[randomIndex].from;
		const to = possibleMoves[randomIndex].to;
		const promoteToSquareInfo = possibleMoves[randomIndex].promoteToSquareInfo;
		let promoteTo = "";

		if (promoteToSquareInfo !== undefined) {
			promoteTo = promoteToSquareInfo.piece !== null ? promoteToSquareInfo.piece.toLowerCase() : "";
		}

		return `${Board.getFenNotationFromPosition(from)}${Board.getFenNotationFromPosition(to)}${promoteTo}`;
	}

	resetBoard() {
		this.board = new Board(Board.startPosFen);
	}
}
