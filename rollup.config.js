// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

export default {
	input: ["main.ts", "src/chessWorker.ts"],
	output: {
		dir: "compiled/",
		format: "es",
	},
	plugins: [typescript(), json()],
	external: ["worker_threads", "random-js", "url"],
};
