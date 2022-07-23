module.exports = {
	"root": true,
	"extends": ["eslint:recommended"],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"sourceType": "module",
		"ecmaVersion": 2022,
	},
	"plugins": ["@typescript-eslint", "jest"],
	"env": {
		"browser": true,
		"es2017": true,
		"node": true,
		"jest/globals": true,
	},
	"rules": {
		"indent": [
			"error",
			"tab",
		],
		"linebreak-style": [
			"error",
			"unix",
		],
		"quotes": [
			"error",
			"double",
		],
		"semi": [
			"error",
			"always",
		],
		"comma-dangle": [
			"error",
			"always-multiline",
		],
		"key-spacing": [
			"error",
			{
				"beforeColon": false,
				"afterColon": true,
			},
		],
		"no-var": "error",
		"spaced-comment": [
			"error",
			"always",
		],
		"eqeqeq": [
			"error",
			"always",
		],
		"brace-style": [
			"error",
			"stroustrup",
			{
				"allowSingleLine": true,
			},
		],
		"max-len": [
			"warn",
			{
				"code": 500,
			},
		],
		"no-trailing-spaces": "error",
		"space-before-blocks": "error",
		"keyword-spacing": [
			"error",
			{
				"after": true,
			},
		],
		"eol-last": [
			"error",
			"always",
		],
		"space-infix-ops": "error",
		"comma-spacing": [
			"error", {
				"before": false,
				"after": true,
			},
		],
		"semi-spacing": [
			"error",
			{
				"before": false,
				"after": true,
			},
		],
		"object-curly-spacing": [
			"error",
			"always",
			{
				"arraysInObjects": false,
			},
		],
		"no-unused-vars": "warn",
		"space-in-parens": [
			"error",
			"never",
		],
	},
};
