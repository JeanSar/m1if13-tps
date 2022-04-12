<template>
  <div class="hello">
    <h1>
      Bienvenue <i>{{ loginValue }}</i> !
    </h1>
  </div>
  <h2>{{ message }}</h2>
  <ul>
    <p>
      <img :src="resources.url" alt="" style="width: 100px;border-radius: 50%;opacity: 50%;">
    </p>
    <p>
      <b><u>Identifiant de joueur</u>: {{ resources.id }}</b>
    </p>
    <p>
      <b>
        <u>Role</u>: <a v-if="resources.role === 'admin'">Administrateur</a>
        <a v-else>Joueur</a>
      </b>
    </p>
    <p>
      <b><u>TTL</u>: {{ resources.ttl }}</b>
    </p>
    <p>
      <b><u>Trésors</u>: 
      <a v-if="!resources.treasures.length"> Vous n'avez aucun trésors...</a>
      <a v-else>
        <div v-for="r in resources.treasures" v-bind:key="r">{{r}}</div>
      </a>
      </b>
    </p>
  </ul> 

  <br />
  <div v-if="resources.registered"><MyMap :joueur="resources" :loginValue="loginValue" :token="token"/></div>
  <div v-else>Le joueur n'a pas encore été attribué à une partie.</div>
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
      ping: undefined,
      loginValue: "",
      token: "",
      message: "Votre profil de joueur :",
      resources: {
        id: "",
        url: "",
        position: {
          x: 0,
          y: 0,
        },
        role: "player",
        ttl: 0,
        treasures: [],
        registered: false,
      },
    };
  },
  methods: {
    async getData() {
      this.loginValue = sessionStorage.getItem("login");
      this.token = sessionStorage.getItem("token");
      const res = await fetchResources(this.loginValue, this.token);
      if (res.status === 200) {
        // Les ressources on été récuperées
        if (res.body == "L'id spécifié n'existe pas") {
          this.message = res.body;
        } else {
          console.log("response : ", res);
          this.resources = await res.json();
        }
      }

      if (res.status === 400) {
        // Le nom de compte renseigné est déjà pris
        window.alert("L'Utilisateur n'existe pas");
        this.message = "L'id spécifié n'existe pas";
      }
    },
  },
  async mounted() {
    await this.getData();
    this.ping = setInterval(() => {
      this.getData();
    }, 5000);
  },
  async beforeUnmount() {
    clearInterval(this.ping);
  },
  
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
