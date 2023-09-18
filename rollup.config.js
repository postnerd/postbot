// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

export default {
	input: ["main.ts", "src/chessWorker.ts"],
	output: {
		dir: "compiled/",
		format: "cjs",
	},
	plugins: [typescript(), json()],
	external: ["path", "worker_threads"],
};
