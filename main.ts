import path from "path";
import { Worker } from "worker_threads";

import { name, version, author } from "./package.json";

interface WorkerData {
	mode: "analyze" | "game",
	moves: string[],
	fen: string,
	isDebug: boolean,
	time: {
		wtime: number,
		btime: number,
		winc: number,
		binc: number,
		movestogo: number,
		movetime: number,
	},
}

const isDebug: boolean = process.argv.includes("--debug");

function processMoves(commands: string[], start: number): void {
	workerData.moves = [];

	commands.slice(start).forEach((move: string) => {
		workerData.moves.push(move);
	});
}

let workerData: WorkerData = {
	mode: "analyze",
	moves: [],
	fen: "startpos",
	isDebug,
	time: {
		wtime: 0,
		btime: 0,
		winc: 0,
		binc: 0,
		movestogo: 0,
		movetime: 0,
	},
};
let worker: Worker;
let currentBestMove: string;

async function handleUCIInput(inputData: string) {
	const input: string = inputData.toString().trim();
	const commands: string[] = input.split(" ");

	if (isDebug) {
		console.debug(commands);
	}

	if (commands[0] === "uci") {
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

		workerData.fen = fen;

		if (commands[2] === "moves") {
			processMoves(commands, 3);
		}
		else {
			processMoves(commands, 9);
		}
	}
	else if (commands[0] === "go") {
		if (commands[1] === "infinite") {
			workerData.mode = "analyze";
		}
		else {
			workerData.mode = "game";

			workerData.time = {
				wtime: 0,
				btime: 0,
				winc: 0,
				binc: 0,
				movestogo: 0,
				movetime: 0,
			};

			for (let i = 1; i < commands.length; i++) {
				if (commands[i] === "wtime") {
					workerData.time.wtime = parseInt(commands[i + 1]);
				}
				else if (commands[i] === "btime") {
					workerData.time.btime = parseInt(commands[i + 1]);
				}
				else if (commands[i] === "winc") {
					workerData.time.winc = parseInt(commands[i + 1]);
				}
				else if (commands[i] === "binc") {
					workerData.time.binc = parseInt(commands[i + 1]);
				}
				else if (commands[i] === "movestogo") {
					workerData.time.movestogo = parseInt(commands[i + 1]);
				}
				else if (commands[i] === "movetime") {
					workerData.time.movetime = parseInt(commands[i + 1]);
				}
			}
		}

		workerData.isDebug = isDebug;

		worker = new Worker(path.join(__dirname, "chessWorker.js"), { workerData });

		worker.on("message", (message: any) => {
			if (isDebug) {
				console.log(message);
			}

			if (message.event === "log") {
				console.log(message.message);
			}
			else if (message.event === "debug") {
				if (isDebug) {
					console.log(message.message);
				}
			}
			else if (message.event === "bestMove") {
				currentBestMove = message.data;
			}
			else if (message.event === "searchFinished") {
				if (workerData.mode === "game") {
					console.log(`bestmove ${currentBestMove}`);
				}
				else {
					console.log("TODO: What should we do if there is nothing more to analyze?");
				}
			}
			else if (message.event === "timeLeft") {
				setTimeout(() => {
					worker.terminate();
					console.log(`bestmove ${currentBestMove}`);
				}, message.data);
			}
		});

		worker.on("exit", (code: number) => {
			console.log(`Worker stopped with exit code ${code}`);
		});

		worker.on("error", (error: Error) => {
			console.error(error);
		});
	}
	else if (commands[0] === "stop") {
		console.log(`bestmove ${currentBestMove}`);
		worker.terminate();
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
