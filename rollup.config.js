// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

export default {
	input: "main.ts",
	output: {
		file: "compiled/engine.js",
		format: "es",
	},
	plugins: [typescript(), json()],
};
