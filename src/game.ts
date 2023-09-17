import Board from "./board";
import search from "./search";

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

	undoLastMove() {
		this.board.undoLastMove();
	}

	analyze() {
		search(this.board, 10);
	}

	randomMove() {
		const possibleMoves = this.board.getPossibleMoves();
		const lengthOfPossibleMoves = possibleMoves.length;
		const randomIndex = Math.floor(Math.random() * lengthOfPossibleMoves);
		const randomMove = possibleMoves[randomIndex];

		return Board.getFenMoveNotationFromMove(randomMove);
	}

	findBestMove() {
		search(this.board, 4);
		return this.currentBestMove();
	}

	currentBestMove() {
		const bestMove = this.board.bestMove;

		if (bestMove === null) return this.randomMove();

		return Board.getFenMoveNotationFromMove(bestMove);
	}


	resetBoard() {
		this.board = new Board(this.fen);
	}
}
