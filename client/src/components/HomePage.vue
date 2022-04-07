<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Bienvenue : </h2>
  </div>
  <MyMap />
</template>

<script>
import MyMap from "@/components/MyMap";
// Pour récupérer le token, une fois connecté : sessionStorage.getItem("token")
export default {
  name: "HomePage",
  components: {
    MyMap,
  },
  props: {
    msg: String,
  },
};
// http://localhost:3376/api/
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
