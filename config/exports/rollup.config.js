const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');

export default {
    input: 'build/module/index.js',
    sourcemap: true,
    plugins: [
        resolve({
            browser: true
        }),
        commonjs()
    ]
}