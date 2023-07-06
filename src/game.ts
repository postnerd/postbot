import Board from "./board";

export default class Game {
	id: string;
	board: Board;
	fen: string;

	constructor(id: string, fen: string) {
		this.id = id;
		this.fen = fen === "startpos" ? Board.startPosFen : fen;
		this.board = new Board(this.fen);
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
		this.board = new Board(this.fen);
	}
}
