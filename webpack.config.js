'use strict';

const path = require('path');
const PluginCopy = require('copy-webpack-plugin');
const PluginForkTSCheck = require('fork-ts-checker-webpack-plugin');

const NODE_MODULES_TO_BABEL = [];

const SOURCE_DIRECTORY = path.resolve(__dirname, 'src');
const OUTPUT_DIRECTORY = path.resolve(__dirname, 'dist');

const ESLINTRC_PATH = path.resolve(__dirname, '.eslintrc');
const TSCONFIG_PATH = path.resolve(__dirname, 'tsconfig.json');

const commonConfig = devMode => ({
	mode: devMode ? 'development' : 'production',
	context: SOURCE_DIRECTORY,
	resolve: {
		extensions: [ '.ts', '.js' ],
	},
	module: {
		rules: [
			{
				test: /\.html/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
				},
			},
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
				},
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [
					SOURCE_DIRECTORY,
				],
			},
		],
	},
	devtool: devMode ? 'cheap-module-source-map' : '', // Script source maps
	performance: {
		hints: devMode ? false : 'warning',
	},
	stats: 'normal',
});

const applicationConfig = devMode => ({
	...commonConfig(devMode),
	entry: [
		'core-js/stable',
		'./index.ts',
	],
	output: {
		path: OUTPUT_DIRECTORY,
		filename: 'bundle.js',
	},
	plugins: [
		new PluginForkTSCheck({
			tsconfig: TSCONFIG_PATH,
		}),
		new PluginCopy(
			[
				{
					from: path.resolve(SOURCE_DIRECTORY, 'index.html'),
					to: path.resolve(OUTPUT_DIRECTORY, 'index.html'),
				},
			],
			{
				info: devMode,
			},
		),
	],
	devServer: {
		contentBase: OUTPUT_DIRECTORY,
		historyApiFallback: true,
	},
});

module.exports = (env, argv) => {
	const devMode = argv.prod === undefined;

	return [
		applicationConfig(devMode),
	];
};
