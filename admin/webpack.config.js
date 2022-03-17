const path = require('path');

module.exports = {
  entry: ['./src/form.js', './src/map.js'],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '..', 'api', 'public', 'static', 'dist'),
  },
  mode: 'development'
};