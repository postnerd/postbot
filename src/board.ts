interface squareInformation {
	piece: "p" | "P" | "b" | "B" | "n" | "N" | "r" | "R" | "q" | "Q" | "k" | "K" | null,
	color: "white" | "black" | null,
	pieceType: "king" | "queen" | "rook" | "bishop" | "knight" | "pawn" | null,
	isOnBoard: boolean
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
		piece: null,
		color: null,
		pieceType: null,
		isOnBoard: false,
	},
	"empty": {
		piece: null,
		color: null,
		pieceType: null,
		isOnBoard: true,
	},
	"p": {
		piece: "p",
		color: "black",
		pieceType: "pawn",
		isOnBoard: true,
	},
	"n": {
		piece: "n",
		color: "black",
		pieceType: "knight",
		isOnBoard: true,
	},
	"b": {
		piece: "b",
		color: "black",
		pieceType: "bishop",
		isOnBoard: true,
	},
	"r": {
		piece: "r",
		color: "black",
		pieceType: "rook",
		isOnBoard: true,
	},
	"q": {
		piece: "q",
		color: "black",
		pieceType: "queen",
		isOnBoard: true,
	},
	"k": {
		piece: "k",
		color: "black",
		pieceType: "king",
		isOnBoard: true,
	},
	"P": {
		piece: "P",
		color: "white",
		pieceType: "pawn",
		isOnBoard: true,
	},
	"N": {
		piece: "N",
		color: "white",
		pieceType: "knight",
		isOnBoard: true,
	},
	"B": {
		piece: "B",
		color: "white",
		pieceType: "bishop",
		isOnBoard: true,
	},
	"R": {
		piece: "R",
		color: "white",
		pieceType: "rook",
		isOnBoard: true,
	},
	"Q": {
		piece: "Q",
		color: "white",
		pieceType: "queen",
		isOnBoard: true,
	},
	"K": {
		piece: "K",
		color: "white",
		pieceType: "king",
		isOnBoard: true,
	},
};

/**
 * CHESS BOARD REPRESENTATION
 *
 * This chess board is represented by 10x12 squares
 * The first two and the last two ranks are just added to have an easier move generation because we can check if an piece has moved outside the 8x8 chess board
 */
export default class Board {
	squares: squareInformation[] = [];
	activeColor: "white" | "black" = "white";
	castlingInformation: castlingInformation = {
		isWhiteKingSidePossible: false,
		isWhiteQueenSidePossible: false,
		isBlackKingSidePossible: false,
		isBlackQueenSidePossible: false,
	};
	enPassantSquarePosition: number | null = null;
	halfMoveCountSinceLastCaptureOrPawnMove: number = 0;
	moveCount: number = 0;

	static readonly startPosFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
	static readonly startIndexBoard = 21;
	static readonly endIndexBoard = 98;

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
			this.squares.push(Object.assign({}, SQUARE_TYPES.outside));
		}

		// setting up the board rank by rank with the fen string information
		rankInformation.forEach((rank: string) => {
			const squares: string[] = rank.split("");

			// first element in rank is again an outside element
			this.squares.push(Object.assign({}, SQUARE_TYPES.outside));

			for (let i = 0; i < squares.length; i++) {
				const squareInfo = squares[i];
				if (isNaN(parseInt(squareInfo))) { // if the square info is not a number we know we got an actual piece
					this.squares.push(Object.assign({}, SQUARE_TYPES[squareInfo]));
				}
				else { // if it's a number, for the next n (number) squares we have blank ones
					for (let j = 0; j < parseInt(squareInfo); j++) {
						this.squares.push(Object.assign({}, SQUARE_TYPES.empty));
					}
				}
			}

			// last element in rank is again an outside element
			this.squares.push(Object.assign({}, SQUARE_TYPES.outside));
		});

		// last two ranks are again outside elements
		for (let i = 0; i < 20; i++) {
			this.squares.push(Object.assign({}, SQUARE_TYPES.outside));
		}

		// 1: WHO`S TO PLAY
		this.activeColor = inputs[1] === "w" ? "white" : "black";

		// 2: Setting the castling information
		inputs[2].split("").forEach((castlingInfo: string) => {
			if (castlingInfo === "K") this.castlingInformation.isWhiteKingSidePossible = true;
			else if (castlingInfo === "Q") this.castlingInformation.isWhiteQueenSidePossible = true;
			else if (castlingInfo === "k") this.castlingInformation.isBlackKingSidePossible = true;
			else if (castlingInfo === "q") this.castlingInformation.isBlackQueenSidePossible = true;
		});

		// 3: Determine if a en passant move from this position will be possible
		if (inputs[3] !== "-") {
			this.enPassantSquarePosition = Board.getIndexFromNotation(inputs[3]);
		}

		// 4: Set the amount of half moves happened so far since the last piece was captured or we had a pawn move
		// this will be relevant cause after 50 half moves without a capture or a pawn move we have a draw
		this.halfMoveCountSinceLastCaptureOrPawnMove = parseInt(inputs[4]);

		// 5: Set the amount of total moves (two half moves are one move / to be considered as a move every player had to move one of his/her pieces)
		this.moveCount = parseInt(inputs[5]);
	}

	getPossibleMoves(): any[] {
		let moves: any[] = [];

		const oppositeColor: "white" | "black" = this.activeColor === "white" ? "black" : "white";

		for (let squarePosition = Board.startIndexBoard; squarePosition <= Board.endIndexBoard; squarePosition++) {
			const squareInfo = this.squares[squarePosition];

			if (squareInfo.color !== this.activeColor) continue;

			if (squareInfo.pieceType === "pawn") {
				const movesDirections: number[] = MOVE_DIRECTIONS[this.activeColor === "white" ? "whitePawnMove" : "blackPawnMove"];
				const captureDirections: number[] = MOVE_DIRECTIONS[this.activeColor === "white" ? "whitePawnCapture" : "blackPawnCapture"];
				const hasStartPosition: boolean = this.activeColor === "white" ? squarePosition >= 81 : squarePosition <= 38;
				const canPromote: boolean = this.activeColor === "white" ? squarePosition <= 38 : squarePosition >= 81;
				let position: number = squarePosition + movesDirections[0];
				let capturePosition1: number = squarePosition + captureDirections[0];
				let capturePosition2: number = squarePosition + captureDirections[1];

				// promotion move
				if (canPromote) {
					if (this.squares[position].piece === null) {
						["queen", "rook", "bishop", "knight"].forEach(promotionType => {
							moves.push({
								"piece": squareInfo.pieceType,
								"from": squarePosition,
								"to": position,
								"willCapture": false,
								"promoteTo": promotionType,
							});
						});
					}

					if (this.squares[capturePosition1].color === oppositeColor) {
						["queen", "rook", "bishop", "knight"].forEach(promotionType => {
							moves.push({
								"piece": squareInfo.pieceType,
								"from": squarePosition,
								"to": capturePosition1,
								"willCapture": true,
								"promoteTo": promotionType,
							});
						});
					}

					if (this.squares[capturePosition2].color === oppositeColor) {
						["queen", "rook", "bishop", "knight"].forEach(promotionType => {
							moves.push({
								"piece": squareInfo.pieceType,
								"from": squarePosition,
								"to": capturePosition2,
								"willCapture": true,
								"promoteTo": promotionType,
							});
						});
					}
				}
				else { // simple move
					if (this.squares[position].isOnBoard && this.squares[position].piece === null) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squarePosition,
							"to": position,
							"willCapture": false,
						});
					}

					if (this.squares[capturePosition1].color === oppositeColor) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squarePosition,
							"to": capturePosition1,
							"willCapture": true,
						});
					}

					if (this.squares[capturePosition2].color === oppositeColor) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squarePosition,
							"to": capturePosition2,
							"willCapture": true,
						});
					}

					if (capturePosition1 === this.enPassantSquarePosition || capturePosition2 === this.enPassantSquarePosition) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squarePosition,
							"to": this.enPassantSquarePosition,
							"willCapture": true,
							"isEnPassant": true,
						});
					}
				}

				// two steps
				if (hasStartPosition) {
					let twoStepPosition = position + movesDirections[0];
					if (this.squares[position].piece === null && this.squares[twoStepPosition].piece === null) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squarePosition,
							"to": twoStepPosition,
							"willCapture": false,
						});
					}
				}
			}
			else if (squareInfo.pieceType === "king") {
				const movesDirections: number[] = MOVE_DIRECTIONS.king;

				for (let i = 0; i < movesDirections.length; i++) {
					let position: number = squarePosition + movesDirections[i];

					if (this.squares[position].isOnBoard && (this.squares[position].piece === null || this.squares[position].color === oppositeColor)) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squarePosition,
							"to": position,
							"willCapture": this.squares[position].color === oppositeColor,
						});
					}
				}

				// castle moves
				const isKingSideCastlePossible = this.activeColor === "white" ? this.castlingInformation.isWhiteKingSidePossible : this.castlingInformation.isBlackKingSidePossible;
				const isQueenSideCastlePossible = this.activeColor === "white" ? this.castlingInformation.isWhiteQueenSidePossible : this.castlingInformation.isBlackQueenSidePossible;

				if (isKingSideCastlePossible) {
					if (this.squares[squarePosition + 1].piece === null && this.squares[squarePosition + 2].piece === null && !this._isKingPlacedInCheckByMove({ from: squarePosition, to: squarePosition + 1 })) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squarePosition,
							"to": squarePosition + 2,
							"willCapture": false,
							"castle": true,
						});
					}
				}

				if (isQueenSideCastlePossible) {
					if (this.squares[squarePosition - 1].piece === null && this.squares[squarePosition - 2].piece === null && this.squares[squarePosition - 3].piece === null && !this._isKingPlacedInCheckByMove({ from: squarePosition, to: squarePosition - 1 })) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squarePosition,
							"to": squarePosition - 2,
							"willCapture": false,
							"castle": true,
						});
					}
				}
			}
			else if (squareInfo.pieceType === "knight") {
				const movesDirections: number[] = MOVE_DIRECTIONS.knight;

				for (let i = 0; i < movesDirections.length; i++) {
					let position: number = squarePosition + movesDirections[i];

					if (this.squares[position].isOnBoard && (this.squares[position].piece === null || this.squares[position].color === oppositeColor)) {
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squarePosition,
							"to": position,
							"willCapture": this.squares[position].color === oppositeColor,
						});
					}
				}
			}
			else { // generate rook, bishop and queen moves
				const movesDirections = MOVE_DIRECTIONS[String(squareInfo.pieceType)];
				for (let i = 0; i < movesDirections.length; i++) {
					let position = squarePosition + movesDirections[i];
					let captured = false;

					while (this.squares[position].isOnBoard && !captured && this.squares[position].color !== this.activeColor) {
						captured = this.squares[position].piece !== null;
						moves.push({
							"piece": squareInfo.pieceType,
							"from": squarePosition,
							"to": position,
							"willCapture": captured,
						});
						position += movesDirections[i];
					}
				}
			}
		}

		// filter moves out that would place the king in check
		return moves.filter(move => {
			return !this._isKingPlacedInCheckByMove(move);
		});
	}

	_isKingPlacedInCheckByMove(move: any) {
		const oldTo = this.squares[move.to];
		this.squares[move.to] = this.squares[move.from];
		this.squares[move.from] = Object.assign({}, SQUARE_TYPES.empty);

		const isCheck = this.isCheck();

		this.squares[move.from] = this.squares[move.to];
		this.squares[move.to] = oldTo;

		return isCheck;
	}

	isCheck(): boolean {
		const kingFen: "K" | "k" = this.activeColor === "white" ? "K" : "k";
		const oppositeQueenFen: "Q" | "q" = this.activeColor !== "white" ? "Q" : "q";
		const oppositeRookFen: "R" | "r" = this.activeColor !== "white" ? "R" : "r";
		const oppositeBishopFen: "B" | "b" = this.activeColor !== "white" ? "B" : "b";
		const oppositeKnightFen: "N" | "n" = this.activeColor !== "white" ? "N" : "n";
		const oppositePawnFen: "P" | "p" = this.activeColor !== "white" ? "P" : "p";

		const kingPosition: number = this.squares.findIndex((squareInformation: squareInformation) => squareInformation.piece === kingFen);

		// check for pawn checks
		const pawnMoves: number[] = kingFen === "K" ? MOVE_DIRECTIONS.whitePawnCapture : MOVE_DIRECTIONS.blackPawnCapture;
		if (this.squares[kingPosition + pawnMoves[0]].piece === oppositePawnFen || this.squares[kingPosition + pawnMoves[1]].piece === oppositePawnFen) return true;


		// check for knight checks
		const knightMoves: number[] = MOVE_DIRECTIONS.knight;
		for (let i = 0; i < knightMoves.length; i++) {
			if (this.squares[kingPosition - knightMoves[i]].piece === oppositeKnightFen) return true;
		}

		// check for queen and rook checks
		const queenAndRookMoves: number[] = MOVE_DIRECTIONS.rook;
		for (let i = 0; i < queenAndRookMoves.length; i++) {
			let position: number = kingPosition + queenAndRookMoves[i];

			while (this.squares[position].isOnBoard && this.squares[position].piece === null) {
				position += queenAndRookMoves[i];
			}

			if (this.squares[position].piece === oppositeQueenFen || this.squares[position].piece === oppositeRookFen) return true;
		}

		// check for queen and bishop checks
		const queenAndBishopMoves: number[] = MOVE_DIRECTIONS.bishop;
		for (let i = 0; i < queenAndBishopMoves.length; i++) {
			let position: number = kingPosition + queenAndBishopMoves[i];

			while (this.squares[position].isOnBoard && this.squares[position].piece === null) {
				position += queenAndBishopMoves[i];
			}

			if (this.squares[position].piece === oppositeQueenFen || this.squares[position].piece === oppositeBishopFen) return true;
		}

		// check for "king checks"
		const kingMoves: number[] = MOVE_DIRECTIONS.king;
		for (let i = 0; i < kingMoves.length; i++) {
			let position: number = kingPosition + kingMoves[i];

			if (this.squares[position].pieceType === "king") return true;
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
