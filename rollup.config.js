import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
// import istanbul from 'rollup-plugin-istanbul'

import pkg from './package.json'

const name = "datagent"
const sourcemap = true

const plugins = []
if(process.env.BUILD === 'production'){
	plugins.push(terser({ sourcemap }))
}

export default [
	{
		input: 'src/index.js',
		output: [
            { name, file: pkg.browser, format: 'umd', exports: 'named', sourcemap },
			{ name, file: pkg.main, format: 'cjs', exports: 'named', sourcemap },
			{ name, file: pkg.module, format: 'es', exports: 'named', sourcemap }
		],
        plugins: [
			babel({
				exclude: 'node_modules/**'
			}),
			resolve(),
			commonjs(),
			//// babel is use istanbul, so rollup not to use istanbul in plugin
			// istanbul({
			// 	exclude: ['test/**/*','node_modules/**/*']
			// }),

			...plugins
        ]
	}
]