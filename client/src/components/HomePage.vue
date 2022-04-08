<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Bienvenue : {{loginValue}} </h2>
  </div>
  <br />
  <a>{{ message }}</a>
  <div> {{resources}}</div>
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
      token: "",
      message: "Cliquer sur 'Afficher profil' pour charger les données du joueur.",
      resources: {},
    };
  },
  methods: {
    async getData() {
      this.loginValue = sessionStorage.getItem("login");
      this.token = sessionStorage.getItem("token");
      const res = await fetchResources(this.loginValue, this.token);
      if(res.status === 200) { // Les ressources on été récuperées 
        if(res.body == "L'id spécifié n'existe pas ou l'utilsateur n'est pas inscrit à la ZRR") {
          this.message = res.body;
        }
        else {
          this.message = "Votre profil de joueur :";
          console.log("response : ", res);
          this.resources = await res.json();
        }
        
      }

      if(res.status === 400) { // Le nom de compte renseigné est déjà pris
        window.alert("L'Utilisateur n'existe pas");
        this.message = "Cliquer sur 'Afficher profil' pour charger les données du joueur.";
      }

    }
  },
  mounted() {
    this.getData();
  }

};
// créer un objet dans data avec a resultat de la request dans mounted()
// http://localhost:3376/api/joueur1
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
