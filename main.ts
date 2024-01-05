#! /usr/bin/env node
import { URL } from "url";
import { Worker } from "worker_threads";

import { name, version, author } from "./package.json";
import { WorkerData } from "./src/chessWorker.js";

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
		white: 0,
		black: 0,
		whiteIncrement: 0,
		blackIncrement: 0,
		movesToGo: 0,
		moveTime: 0,
	},
	depth: 9999,
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
		workerData.time = {
			white: 0,
			black: 0,
			whiteIncrement: 0,
			blackIncrement: 0,
			movesToGo: 0,
			moveTime: 0,
		};
		workerData.depth = 9999;

		if (commands[1] === "infinite") {
			workerData.mode = "analyze";
		}
		else {
			workerData.mode = "game";

			for (let i = 1; i < commands.length; i++) {
				if (commands[i] === "wtime") {
					workerData.time.white = parseInt(commands[i + 1]);
				}
				else if (commands[i] === "btime") {
					workerData.time.black = parseInt(commands[i + 1]);
				}
				else if (commands[i] === "winc") {
					workerData.time.whiteIncrement = parseInt(commands[i + 1]);
				}
				else if (commands[i] === "binc") {
					workerData.time.blackIncrement = parseInt(commands[i + 1]);
				}
				else if (commands[i] === "movestogo") {
					workerData.time.movesToGo = parseInt(commands[i + 1]);
				}
				else if (commands[i] === "movetime") {
					workerData.time.moveTime = parseInt(commands[i + 1]);
				}
				else if (commands[i] === "depth") {
					workerData.depth = parseInt(commands[i + 1]);
				}
			}
		}

		workerData.isDebug = isDebug;

		worker = new Worker(new URL("chessWorker.js", import.meta.url), { workerData });

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
