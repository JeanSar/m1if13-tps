const { defineConfig } = require("@vue/cli-service");
const webpack = require('webpack');

console.log("Value of process.env.NODE_ENV", process.env.NODE_ENV)



const paths = process.env.NODE_ENV === 'development' 
  ? 
    {
      admin: JSON.stringify("https://192.168.75.13/game/admin"),
      resource: JSON.stringify("https://192.168.75.13/game/api"),
      user: JSON.stringify("https://192.168.75.13/users")
    }
  : 
    {
      admin: JSON.stringify("http://localhost:3376/admin"),
      resource: JSON.stringify("http://localhost:3376/api"),
      user: JSON.stringify("http://localhost:8080")
    }


module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    // On se sera amené à utiliser cet objet pour configurer webpack, comme au tp précédent
    plugins: [
      new webpack.DefinePlugin({
        __API__: path
      })
    ]
  },
});
