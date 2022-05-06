const { defineConfig } = require("@vue/cli-service");
const webpack = require('webpack');

console.log("Value of process.env.NODE_ENV", process.env.NODE_ENV)



const paths = process.env.NODE_ENV === 'production'
  ? 
    {
      api: JSON.stringify("https://192.168.75.13/game"), // Prefix pour les routes api et admin
      user: JSON.stringify("https://192.168.75.13:8443/mif13")
    }
  : 
    {
      api: JSON.stringify("http://localhost:3376"),
      user: JSON.stringify("http://localhost:8080")
    }


module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    // On se sera amené à utiliser cet objet pour configurer webpack, comme au tp précédent
    plugins: [
      new webpack.DefinePlugin({
        __API__: paths
      })
    ]
  },
});
