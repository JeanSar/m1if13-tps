const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');

let apiHost = ""

let setupAPI = function() {
  switch (process.env.NODE_ENV) {
    case 'development':
      apiHost = "'http://localhost:3376/admin'";
      break;
    case 'production':
      apiHost = "'https://192.168.75.13:8080/mif13/admin'";
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
  watch: true,
  plugins: [
    //new ESLintPlugin(),
    new webpack.DefinePlugin({
      __API__: apiHost
    })
  ]
}