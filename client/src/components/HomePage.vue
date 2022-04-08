<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Bienvenue : </h2>
  </div>
  <MyMap />
</template>

<script>
import MyMap from "@/components/MyMap";

export default {
  name: "HomePage",
  components: {
    MyMap,
  },
  props: {
    msg: String,
  },
};
// créer un objet dans data avec a resultat de la request dans mounted()
// http://localhost:3376/api/joueur1
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
