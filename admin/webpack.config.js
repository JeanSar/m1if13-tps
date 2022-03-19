const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

var config = {
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '..', 'api', 'public', 'static', 'dist'),
  },
  watch: true,
  plugins: [new ESLintPlugin()]
}

module.exports = (env, argv) => {
  if((argv.mode === 'development') || (argv.mode === 'none')) {
    config.entry = ['./src/form.js', './src/map.js', './src/apiPath-dev.js'];
  }
  else if (argv.mode === 'production') {
    config.entry = ['./src/form.js', './src/map.js', './src/apiPath-prod.js'];
  }
  return config;
};