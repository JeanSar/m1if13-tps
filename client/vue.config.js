const { defineConfig } = require("@vue/cli-service");
const webpack = require('webpack');
const ip = require("ip");

console.log("Value of process.env.NODE_ENV", process.env.NODE_ENV)

console.log("Addr ip : ")
console.log(ip.address())

const paths = process.env.NODE_ENV === 'production'
  ? 
    {
      api: JSON.stringify("https://192.168.75.13/game"), // Prefix pour les routes api et admin
      user: JSON.stringify("https://192.168.75.13:8443/mif13")
    }
  : 
    {
      api: JSON.stringify(`http://${ip.address()}:3376`),
      user: JSON.stringify(`http://${ip.address()}:8080`)
    }


module.exports = defineConfig({
  pwa: {
    name: 'Treasure guild',
    themeColor: '#00FFFF',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'sw.js'
    }
  },
  transpileDependencies: true,
    publicPath: "./",
    configureWebpack: {
    // On se sera amené à utiliser cet objet pour configurer webpack, comme au tp précédent
    plugins: [
      new webpack.DefinePlugin({
        __API__: paths
      })
    ]
  },
});
