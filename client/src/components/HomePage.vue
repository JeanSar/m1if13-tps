<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Bienvenue : </h2>
  </div>
  <button @click.prevent="getData">Afficher profil</button>
  <MyMap />
</template>

<script>
import MyMap from "@/components/MyMap";
import { fetchResources } from "@/utils/apiFunction";

// Pour récupérer le token, une fois connecté : sessionStorage.getItem("token")
export default {
  name: "HomePage",
  components: {
    MyMap,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      loginValue: "",
      token: ""
    };
  },
  methods: {
    async getData() {
      this.loginValue = sessionStorage.getItem("login");
      this.token = sessionStorage.getItem("token");

    }
  }

};
// créer un objet dans data avec a resultat de la request dans mounted()
// http://localhost:3376/api/joueur1
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
