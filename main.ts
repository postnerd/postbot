#! /usr/bin/env node
import { URL } from "url";
import { Worker } from "worker_threads";

import { name, version, author } from "./package.json";
import { WorkerData } from "./src/chessWorker.js";

const isDebug: boolean = process.argv.includes("--debug");

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
	const [mainCommand, ...commandArguments] = input.split(" ");

	if (isDebug) {
		console.debug("Main command: " + mainCommand);
		console.debug("Command arguments: " + commandArguments);
	}

	if (mainCommand === "uci") {
		console.log(`id name ${name} ${version}`);
		console.log(`id author ${author}`);
		console.log("uciok");
	}
	else if (mainCommand === "isready") {
		console.log("readyok");
	}
	else if (mainCommand === "ucinewgame") {
		// Noting to do here at the moment
	}
	else if (mainCommand === "position") {
		let fen = "startpos";

		if (commandArguments[0] === "fen") {
			fen = commandArguments.slice(1, 7).join(" ");
		}

		workerData.fen = fen;

		if (commandArguments[1] === "moves") {
			workerData.moves = [...commandArguments.slice(2)];
		}
		else {
			workerData.moves = [...commandArguments.slice(8)];
		}
	}
	else if (mainCommand === "go") {
		workerData.time = {
			white: 0,
			black: 0,
			whiteIncrement: 0,
			blackIncrement: 0,
			movesToGo: 0,
			moveTime: 0,
		};
		workerData.depth = 9999;

		if (commandArguments[0] === "infinite") {
			workerData.mode = "analyze";
		}
		else {
			workerData.mode = "game";

			for (let i = 0; i < commandArguments.length; i++) {
				if (commandArguments[i] === "wtime") {
					workerData.time.white = parseInt(commandArguments[i + 1]);
				}
				else if (commandArguments[i] === "btime") {
					workerData.time.black = parseInt(commandArguments[i + 1]);
				}
				else if (commandArguments[i] === "winc") {
					workerData.time.whiteIncrement = parseInt(commandArguments[i + 1]);
				}
				else if (commandArguments[i] === "binc") {
					workerData.time.blackIncrement = parseInt(commandArguments[i + 1]);
				}
				else if (commandArguments[i] === "movestogo") {
					workerData.time.movesToGo = parseInt(commandArguments[i + 1]);
				}
				else if (commandArguments[i] === "movetime") {
					workerData.time.moveTime = parseInt(commandArguments[i + 1]);
				}
				else if (commandArguments[i] === "depth") {
					workerData.depth = parseInt(commandArguments[i + 1]);
				}
			}
		}

		workerData.isDebug = isDebug;

		worker = new Worker(new URL("chessWorker.js", import.meta.url), { workerData });

		worker.on("message", (message: any) => {
			if (isDebug && message.event !== "log" && message.event !== "debug") {
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
	else if (mainCommand === "stop") {
		console.log(`bestmove ${currentBestMove}`);
		worker.terminate();
	}
	else if (mainCommand === "quit") {
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
