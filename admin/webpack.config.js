const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');

let apiHost = ""

let setupAPI = function() {
  switch (process.env.NODE_ENV) {
    case 'development':
      apiHost = "'http://localhost:3376'";
      break;
    case 'production':
      apiHost = "'https://192.168.75.13/game'";
      break;

    default:
      apiHost = "'http://localhost:3376'";
      break;
  }
}
setupAPI()

module.exports = {
  entry: ['./src/form.js', './src/map.js', './src/apiPath.js'],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '..', 'api', 'public', 'static', 'dist'),
  },
  watch: process.env.NODE_ENV==='development' ? true : false,
  plugins: [
    new ESLintPlugin(),
    new webpack.DefinePlugin({
      __API__: apiHost
    })
  ]
}