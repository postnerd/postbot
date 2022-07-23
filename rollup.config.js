// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

export default {
	input: "engine.ts",
	output: {
		dir: "compiled",
		format: "es",
	},
	plugins: [typescript(), json()],
};
