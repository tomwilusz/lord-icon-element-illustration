const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: {
        'lord-icon-illustration': path.resolve(__dirname, 'release', 'lord-icon-illustration'),
    },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'bin'),
    },

    resolve: {
        extensions: ['.js'],
        modules: [
            path.resolve(__dirname, 'node_modules')
        ]
    },

    optimization: {
        minimizer: [
            new TerserPlugin(),
        ]
    }
};