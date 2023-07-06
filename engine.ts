import { name, version, author } from "./package.json";
import Game from "./src/game";
import { printBoardToConsole } from "./src/utils";

const isDebug: boolean = process.argv.includes("--debug");

interface Engine {
	isUCIRunning: boolean,
}

const engine: Engine = {
	isUCIRunning: false,
};

function processMoves(commands: string[], start: number): void {
	commands.slice(start).forEach((move: string) => {
		currentGame.makeMove(move);
	});
}

let currentGame: Game;

function handleUCIInput(inputData: string) {
	const input: string = inputData.toString().trim();
	const commands: string[] = input.split(" ");

	if (isDebug) {
		console.debug(commands);
	}

	if (commands[0] === "uci") {
		engine.isUCIRunning = true;
		console.log(`id name ${name} ${version}`);
		console.log(`id author ${author}`);
		// console.log("option name Debug Log File type string default");
		// console.log("option name Threads type spin default 1 min 1 max 512");
		// console.log("option name Hash type spin default 16 min 1 max 33554432");
		// console.log("option name Clear Hash type button");
		// console.log("option name Ponder type check default false");
		// console.log("option name MultiPV type spin default 1 min 1 max 500");
		// console.log("option name Skill Level type spin default 20 min 0 max 20");
		// console.log("option name Move Overhead type spin default 10 min 0 max 5000");
		// console.log("option name Slow Mover type spin default 100 min 10 max 1000");
		// console.log("option name nodestime type spin default 0 min 0 max 10000");
		// console.log("option name UCI_Chess960 type check default false");
		// console.log("option name UCI_AnalyseMode type check default false");
		// console.log("option name UCI_LimitStrength type check default false");
		// console.log("option name UCI_Elo type spin default 1350 min 1350 max 2850");
		// console.log("option name UCI_ShowWDL type check default false");
		// console.log("option name SyzygyPath type string default<empty>");
		// console.log("option name SyzygyProbeDepth type spin default 1 min 1 max 100");
		// console.log("option name Syzygy50MoveRule type check default true");
		// console.log("option name SyzygyProbeLimit type spin default 7 min 0 max 7");
		// console.log("option name Use NNUE type check default true");
		// console.log("option name EvalFile type string default nn - 6877cd24400e.nnue");
		console.log("uciok");
	}
	else if (commands[0] === "isready") {
		console.log("readyok");
	}
	else if (commands[0] === "ucinewgame") {
		// Noting to do here at the moment
	}
	else if (commands[0] === "position") {
		let fen = "startpos";

		if (commands[1] === "fen") {
			fen = (`${commands[2]} ${commands[3]} ${commands[4]} ${commands[5]} ${commands[6]} ${commands[7]}`);
		}

		// Is needed because the position command can be used without ucinewgame
		if (currentGame === undefined) {
			currentGame = new Game(Date.now().toString(), fen);
		}
		else {
			currentGame.resetBoard();
		}

		if (commands[2] === "moves") {
			processMoves(commands, 3);
		}
		else {
			processMoves(commands, 9);
		}

		if (isDebug) {
			printBoardToConsole(currentGame.board, true);
		}
	}
	else if (commands[0] === "go") {
		console.log(`bestmove ${currentGame.bestMove()}`);
	}
	else if (commands[0] === "quit") {
		process.exit();
	}
}

// Since the UCI protocol is line-based, we need to listen to the stdin stream and handle each line separately
process.stdin.on("data", (input: string) => {
	const lines = input.toString().trim().split("\n");

	lines.forEach((line: string) => {
		handleUCIInput(line);
	});
});
