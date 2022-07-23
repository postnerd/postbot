interface squareInformation {
	fenNotation: "p" | "P" | "b" | "B" | "n" | "N" | "r" | "R" | "q" | "Q" | "k" | "K" | " " | null,
	color: "white" | "black" | null,
	pieceType: "king" | "queen" | "rook" | "bishop" | "knight" | "pawn" | "empty" | null,
	position: number,
	isEnPassantSquare: boolean,
	isOnBoard: boolean,
	isEmpty: boolean,
}

interface castlingInformation {
	isWhiteKingSidePossible: boolean,
	isWhiteQueenSidePossible: boolean,
	isBlackKingSidePossible: boolean,
	isBlackQueenSidePossible: boolean,
}

const MOVE_DIRECTIONS: {[key: string]: number[]} = {
	"king": [-9, -10, -11, 1, 11, 10, 9, -1],
	"queen": [-9, -10, -11, 1, 11, 10, 9, -1],
	"rook": [-10, 1, 10, -1],
	"bishop": [-9, -11, 9, 11],
	"knight": [-19, -8, 12, 21, 19, -12, 8, -21],
	"whitePawnMove": [-10],
	"blackPawnMove": [10],
	"whitePawnCapture": [-9, -11],
	"blackPawnCapture": [9, 11],
};

const SQUARE_TYPES: {[key: string]: squareInformation } = {
	"outside": {
		fenNotation: null,
		color: null,
		pieceType: null,
		position: 0,
		isEnPassantSquare: false,
		isOnBoard: false,
		isEmpty: false,
	},
	"empty": {
		fenNotation: " ",
		color: null,
		pieceType: "empty",
		position: 0,
		isEnPassantSquare: false,
		isOnBoard: true,
		isEmpty: true,
	},
	"p": {
		fenNotation: "p",
		color: "black",
		pieceType: "pawn",
		position: 0,
		isEnPassantSquare: false,
		isOnBoard: true,
		isEmpty: false,
	},
	"n": {
		fenNotation: "n",
		color: "black",
		pieceType: "knight",
		position: 0,
		isEnPassantSquare: false,
		isOnBoard: true,
		isEmpty: false,
	},
	"b": {
		fenNotation: "b",
		color: "black",
		pieceType: "bishop",
		position: 0,
		isEnPassantSquare: false,
		isOnBoard: true,
		isEmpty: false,
	},
	"r": {
		fenNotation: "r",
		color: "black",
		pieceType: "rook",
		position: 0,
		isEnPassantSquare: false,
		isOnBoard: true,
		isEmpty: false,
	},
	"q": {
		fenNotation: "q",
		color: "black",
		pieceType: "queen",
		position: 0,
		isEnPassantSquare: false,
		isOnBoard: true,
		isEmpty: false,
	},
	"k": {
		fenNotation: "k",
		color: "black",
		pieceType: "king",
		position: 0,
		isEnPassantSquare: false,
		isOnBoard: true,
		isEmpty: false,
	},
	"P": {
		fenNotation: "P",
		color: "white",
		pieceType: "pawn",
		position: 0,
		isEnPassantSquare: false,
		isOnBoard: true,
		isEmpty: false,
	},
	"N": {
		fenNotation: "N",
		color: "white",
		pieceType: "knight",
		position: 0,
		isEnPassantSquare: false,
		isOnBoard: true,
		isEmpty: false,
	},
	"B": {
		fenNotation: "B",
		color: "white",
		pieceType: "bishop",
		position: 0,
		isEnPassantSquare: false,
		isOnBoard: true,
		isEmpty: false,
	},
	"R": {
		fenNotation: "R",
		color: "white",
		pieceType: "rook",
		position: 0,
		isEnPassantSquare: false,
		isOnBoard: true,
		isEmpty: false,
	},
	"Q": {
		fenNotation: "Q",
		color: "white",
		pieceType: "queen",
		position: 0,
		isEnPassantSquare: false,
		isOnBoard: true,
		isEmpty: false,
	},
	"K": {
		fenNotation: "K",
		color: "white",
		pieceType: "king",
		position: 0,
		isEnPassantSquare: false,
		isOnBoard: true,
		isEmpty: false,
	},
};

/**
 * CHESS BOARD REPRESENTATION
 *
 * This chess board is represented by 10x12 squares
 * The first two and the last two ranks are just added to have an easier move generation because we can check if an piece has moved outside the 8x8 chess board
 */
export default class Board {
	_squares: squareInformation[] = [];
	_activeSide: "white" | "black" = "white";
	_castlingInformation: castlingInformation = {
		isWhiteKingSidePossible: false,
		isWhiteQueenSidePossible: false,
		isBlackKingSidePossible: false,
		isBlackQueenSidePossible: false,
	};
	_enPassantSquare: String | null = null;
	_halfMoveCountSinceLastCaptureOrPawnMove: number = 0;
	_moveCount: number = 0;

	static startPosFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

	static getIndexFromNotation(notation: string): number {
		const startSquare: number = 21; // a8 is our staring square
		const filesToAdd: number = notation[0].charCodeAt(0) - 97; // charCode for "a" is 97, so we get the difference from letter notation to our starting square "a"
		const ranksToAdd: number = (8 - parseInt(notation[1])) * 10; // since every rank has 8 squares we get the difference to our starting square and multiply it by 10 because our board is represented by 10 squares per rank
		return startSquare + ranksToAdd + filesToAdd;
	}

	constructor(fen: string) {
		this._setupBoardFromFen(fen);
	}

	_setupBoardFromFen(fen: string) {
		// Parsing fen string into an array
		// 0: board information
		// 1: side to play
		// 2: castling information
		// 3: en passant move
		// 4: count of half moves since last capture or advance
		// 5: count of moves
		const inputs: string[] = fen.split(" ");

		// 0: BOARD SETUP for 10x12
		// board information are provided rank by rank separated by "/"
		const rankInformation: string[] = inputs[0].split("/");

		// first two ranks are filled with outside elements to have a easier move generation later on (to determine of a piece moved outside the board)
		for (let i = 0; i < 20; i++) {
			this._squares.push(Object.assign({}, SQUARE_TYPES.outside));
			this._squares[this._squares.length - 1].position = this._squares.length - 1;
		}

		// setting up the board rank by rank with the fen string information
		rankInformation.forEach((rank: string) => {
			const squares: string[] = rank.split("");

			// first element in rank is again an outside element
			this._squares.push(Object.assign({}, SQUARE_TYPES.outside));
			this._squares[this._squares.length - 1].position = this._squares.length - 1;

			for (let i = 0; i < squares.length; i++) {
				const squareInfo = squares[i];
				if (isNaN(parseInt(squareInfo))) { // if the square info is not a number we know we got an actual piece
					this._squares.push(Object.assign({}, SQUARE_TYPES[squareInfo]));
					this._squares[this._squares.length - 1].position = this._squares.length - 1;
				}
				else { // if it's a number, for the next n (number) squares we have blank ones
					for (let j = 0; j < parseInt(squareInfo); j++) {
						this._squares.push(Object.assign({}, SQUARE_TYPES.empty));
						this._squares[this._squares.length - 1].position = this._squares.length - 1;
					}
				}
			}

			// last element in rank is again an outside element
			this._squares.push(Object.assign({}, SQUARE_TYPES.outside));
			this._squares[this._squares.length - 1].position = this._squares.length - 1;
		});

		// last two ranks are again outside elements
		for (let i = 0; i < 20; i++) {
			this._squares.push(Object.assign({}, SQUARE_TYPES.outside));
			this._squares[this._squares.length - 1].position = this._squares.length - 1;
		}

		// 1: WHO`S TO PLAY
		this._activeSide = inputs[1] === "w" ? "white" : "black";

		// 2: Setting the castling information
		inputs[2].split("").forEach((castlingInfo: string) => {
			if (castlingInfo === "K") this._castlingInformation.isWhiteKingSidePossible = true;
			else if (castlingInfo === "Q") this._castlingInformation.isWhiteQueenSidePossible = true;
			else if (castlingInfo === "k") this._castlingInformation.isBlackKingSidePossible = true;
			else if (castlingInfo === "q") this._castlingInformation.isBlackQueenSidePossible = true;
		});

		// 3: Determine if a en passant move from this position will be possible
		if (inputs[3] !== "-") {
			this._enPassantSquare = inputs[3];
			this._squares[Board.getIndexFromNotation(inputs[3])].isEnPassantSquare = true;
		}

		// 4: Set the amount of half moves happened so far since the last piece was captured or we had a pawn move
		// this will be relevant cause after 50 half moves without a capture or a pawn move we have a draw
		this._halfMoveCountSinceLastCaptureOrPawnMove = parseInt(inputs[4]);

		// 5: Set the amount of total moves (two half moves are one move / to be considered as a move every player had to move one of his/her pieces)
		this._moveCount = parseInt(inputs[5]);
	}

	getPossibleMoves(): any[] {
		let moves: any[] = [];

		const squareInformation: squareInformation[] = this._squares.filter((square: squareInformation) => square.color === this._activeSide);
		const oppositeColor: "white" | "black" = this._activeSide === "white" ? "black" : "white";

		squareInformation.forEach((squareInfo: squareInformation) => {
			if (squareInfo.pieceType === "pawn") {
				const movesDirections: number[] = MOVE_DIRECTIONS[this._activeSide === "white" ? "whitePawnMove" : "blackPawnMove"];
				const captureDirections: number[] = MOVE_DIRECTIONS[this._activeSide === "white" ? "whitePawnCapture" : "blackPawnCapture"];
				const hasStartPosition: boolean = this._activeSide === "white" ? squareInfo.position >= 81 : squareInfo.position <= 38;
				const canPromote: boolean = this._activeSide === "white" ? squareInfo.position <= 38 : squareInfo.position >= 81;
				let position: number = squareInfo.position + movesDirections[0];
				let capturePosition1: number = squareInfo.position + captureDirections[0];
				let capturePosition2: number = squareInfo.position + captureDirections[1];

				// promotion move
				if (canPromote) {
					if (this._squares[position].isEmpty) {
						["queen", "rook", "bishop", "knight"].forEach(promotionType => {
							moves.push({
								"piece": squareInfo.pieceType,
								"from": squareInfo.position,
								"to": position,
								"willCapture": false,
								"promoteTo": promotionType,
							});
						});
					}

					if (this._squares[capturePosition1].color === oppositeColor) {
						["queen", "rook", "bishop", "knight"].forEach(promotionType => {
							moves.push({
								"piece": squareInfo.pieceType,
								"from": squareInfo.position,
								"to": capturePosition1,
								"willCapture": true,
								"promoteTo": promotionType,
							});
						});
					}

					if (this._squares[capturePosition2].color === oppositeColor) {
						["queen", "rook", "bishop", "knight"].forEach(promotionType => {
							moves.push({
								"piece": squareInfo.pieceType,
								"from": squareInfo.position,
								"to": capturePosition2,
								"willCapture": true,
								"promoteTo": promotionType,
							});
						});
					}
				}
				else { // simple move
					if (this._squares[position].isEmpty) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squareInfo.position,
							"to": position,
							"willCapture": false,
						});
					}

					if (this._squares[capturePosition1].color === oppositeColor) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squareInfo.position,
							"to": capturePosition1,
							"willCapture": true,
						});
					}

					if (this._squares[capturePosition2].color === oppositeColor) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squareInfo.position,
							"to": capturePosition2,
							"willCapture": true,
						});
					}

					if (this._squares[capturePosition1].isEnPassantSquare || this._squares[capturePosition2].isEnPassantSquare) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squareInfo.position,
							"to": this._squares[capturePosition1].isEnPassantSquare ? capturePosition1 : capturePosition2,
							"willCapture": true,
							"isEnPassant": true,
						});
					}
				}

				// two steps
				if (hasStartPosition) {
					let twoStepPosition = position + movesDirections[0];
					if (this._squares[position].isEmpty && this._squares[twoStepPosition].isEmpty) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squareInfo.position,
							"to": twoStepPosition,
							"willCapture": false,
						});
					}
				}
			}
			else if (squareInfo.pieceType === "king") {
				const movesDirections: number[] = MOVE_DIRECTIONS.king;

				for (let i = 0; i < movesDirections.length; i++) {
					let position: number = squareInfo.position + movesDirections[i];

					if (this._squares[position].isEmpty || this._squares[position].color === oppositeColor) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squareInfo.position,
							"to": position,
							"willCapture": this._squares[position].color === oppositeColor,
						});
					}
				}

				// castle moves
				const isKingSideCastlePossible = this._activeSide === "white" ? this._castlingInformation.isWhiteKingSidePossible : this._castlingInformation.isBlackKingSidePossible;
				const isQueenSideCastlePossible = this._activeSide === "white" ? this._castlingInformation.isWhiteQueenSidePossible : this._castlingInformation.isBlackQueenSidePossible;

				if (isKingSideCastlePossible) {
					if (this._squares[squareInfo.position + 1].isEmpty && this._squares[squareInfo.position + 2].isEmpty && !this._isKingPlacedInCheckByMove({ from: squareInfo.position, to: squareInfo.position + 1 })) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squareInfo.position,
							"to": squareInfo.position + 2,
							"willCapture": false,
							"castle": true,
						});
					}
				}

				if (isQueenSideCastlePossible) {
					if (this._squares[squareInfo.position - 1].isEmpty && this._squares[squareInfo.position - 2].isEmpty && this._squares[squareInfo.position - 3].isEmpty && !this._isKingPlacedInCheckByMove({ from: squareInfo.position, to: squareInfo.position - 1 })) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squareInfo.position,
							"to": squareInfo.position - 2,
							"willCapture": false,
							"castle": true,
						});
					}
				}
			}
			else if (squareInfo.pieceType === "knight") {
				const movesDirections: number[] = MOVE_DIRECTIONS.knight;

				for (let i = 0; i < movesDirections.length; i++) {
					let position: number = squareInfo.position + movesDirections[i];

					if (this._squares[position].isEmpty || this._squares[position].color === oppositeColor) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squareInfo.position,
							"to": position,
							"willCapture": this._squares[position].color === oppositeColor,
						});
					}
				}
			}
			else { // generate rook, bishop and queen moves
				const movesDirections = MOVE_DIRECTIONS[String(squareInfo.pieceType)];
				for (let i = 0; i < movesDirections.length; i++) {
					let position = squareInfo.position + movesDirections[i];
					let captured = false;

					while (this._squares[position].isOnBoard && !captured && this._squares[position].color !== this._activeSide) {
						captured = this._squares[position].pieceType !== "empty";
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squareInfo.position,
							"to": position,
							"willCapture": captured,
						});
						position += movesDirections[i];
					}
				}
			}
		});

		// filter moves out that would place the king in check
		return moves.filter(move => {
			return !this._isKingPlacedInCheckByMove(move);
		});
	}

	_isKingPlacedInCheckByMove(move: any) {
		const oldTo = this._squares[move.to];
		this._squares[move.to] = this._squares[move.from];
		this._squares[move.to].position = move.to;
		this._squares[move.from] = Object.assign({}, SQUARE_TYPES.empty);
		this._squares[move.from].position = move.from;

		const isCheck = this.isCheck();

		this._squares[move.from] = this._squares[move.to];
		this._squares[move.from].position = move.from;
		this._squares[move.to] = oldTo;
		this._squares[move.to].position = move.to;

		return isCheck;
	}

	isCheck(): boolean {
		const kingFen: "K" | "k" = this._activeSide === "white" ? "K" : "k";
		const oppositeQueenFen: "Q" | "q" = this._activeSide !== "white" ? "Q" : "q";
		const oppositeRookFen: "R" | "r" = this._activeSide !== "white" ? "R" : "r";
		const oppositeBishopFen: "B" | "b" = this._activeSide !== "white" ? "B" : "b";
		const oppositeKnightFen: "N" | "n" = this._activeSide !== "white" ? "N" : "n";
		const oppositePawnFen: "P" | "p" = this._activeSide !== "white" ? "P" : "p";

		const kingPosition: number = this._squares.findIndex((squareInformation: squareInformation) => squareInformation.fenNotation === kingFen);

		// check for pawn checks
		const pawnMoves: number[] = kingFen === "K" ? MOVE_DIRECTIONS.whitePawnCapture : MOVE_DIRECTIONS.blackPawnCapture;
		if (this._squares[kingPosition + pawnMoves[0]].fenNotation === oppositePawnFen || this._squares[kingPosition + pawnMoves[1]].fenNotation === oppositePawnFen) return true;


		// check for knight checks
		const knightMoves: number[] = MOVE_DIRECTIONS.knight;
		for (let i = 0; i < knightMoves.length; i++) {
			if (this._squares[kingPosition - knightMoves[i]].fenNotation === oppositeKnightFen) return true;
		}

		// check for queen and rook checks
		const queenAndRookMoves: number[] = MOVE_DIRECTIONS.rook;
		for (let i = 0; i < queenAndRookMoves.length; i++) {
			let position: number = kingPosition + queenAndRookMoves[i];

			while (this._squares[position].isOnBoard && this._squares[position].isEmpty) {
				position += queenAndRookMoves[i];
			}

			if (this._squares[position].fenNotation === oppositeQueenFen || this._squares[position].fenNotation === oppositeRookFen) return true;
		}

		// check for queen and bishop checks
		const queenAndBishopMoves: number[] = MOVE_DIRECTIONS.bishop;
		for (let i = 0; i < queenAndBishopMoves.length; i++) {
			let position: number = kingPosition + queenAndBishopMoves[i];

			while (this._squares[position].isOnBoard && this._squares[position].isEmpty) {
				position += queenAndBishopMoves[i];
			}

			if (this._squares[position].fenNotation === oppositeQueenFen || this._squares[position].fenNotation === oppositeBishopFen) return true;
		}

		// check for "king checks"
		const kingMoves: number[] = MOVE_DIRECTIONS.king;
		for (let i = 0; i < kingMoves.length; i++) {
			let position: number = kingPosition + kingMoves[i];

			if (this._squares[position].pieceType === "king") return true;
		}

		return false;
	}

	isCheckmate(): boolean {
		if (this.isCheck() && this.getPossibleMoves().length === 0) return true;

		return false;
	}

	isStalemate(): boolean {
		if (!this.isCheck() && this.getPossibleMoves().length === 0) return true;

		return false;
	}
}
