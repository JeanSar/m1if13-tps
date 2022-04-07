const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    // On se sera amené à utiliser cet objet pour configurer webpack, comme au tp précédent
  },
});
