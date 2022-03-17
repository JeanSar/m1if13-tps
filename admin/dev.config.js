const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: ['./src/form.js', './src/map.js', './src/apiPath-dev.js'],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '..', 'api', 'public', 'static', 'dist'),
  },
  mode: 'development',
  watch: true,
  plugins: [new ESLintPlugin()],
};