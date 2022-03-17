const path = require('path');

module.exports = {
  entry: ['./src/map.js', './src/form.js'],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../api/public/static/dist/'),
  },
  mode: "development",
  watch: true
};