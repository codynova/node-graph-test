module.exports = {
	"sourceMaps": true,
	"plugins": [],
	"presets": [
		[
			"@babel/preset-env",
			{
				"modules": "commonjs",
				"useBuiltIns": "entry",
				"corejs": 3
			}
		],
		[ "@babel/preset-typescript" ]
	]
}
