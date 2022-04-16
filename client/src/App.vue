<template>
  <PopUp v-if="this.$store.state.compteur === 0" message="Partie terminée !"/>
  <nav class="navBar">
      <router-link class="router-link" to="/home">Accueil</router-link>
      <router-link class="router-link" to="/">Sign in / Sign up</router-link>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #17191c;
}

nav a.router-link-exact-active {
  color: #ffffff;
}

.router-link {
  margin-right: 0.5em;
  margin-left: 0.5em;
}

.navBar {
  display: flex;
  justify-content: space-evenly;
  background-color: #0b7350;
  margin-bottom: 3em;
  color: white;
  border-radius: 0.5em;
}
</style>
<script>
import PopUp from "@/components/PopUp";
export default {
  components: { PopUp }

  //components: {PopUp}
}
</script>