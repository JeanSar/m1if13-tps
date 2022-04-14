<template>
  <div class="hello">
    <h1>
      Bienvenue <i>{{ this.$store.state.user.loginValue }}</i> !
    </h1>
  </div>
  <h2>{{ message }}</h2>
  <ul>
    <p>
      <img :src="this.$store.state.user.resources.url" alt="" style="width: 100px;border-radius: 50%;opacity: 50%;">
    </p>
    <p>
      <b><u>Identifiant de joueur</u>: {{ this.$store.state.resources?.id }}</b>
    </p>
    <p>
      <b>
        <u>Role</u>: <a v-if="this.$store.state.user.resources.role === 'admin'">Administrateur</a>
        <a v-else>Joueur</a>
      </b>
    </p>
    <p>
      <b><u>TTL</u>: {{ this.$store.state.user.resources.ttl }}</b>
    </p>
    <p>
      <b><u>Trésors</u>: 
      <a v-if="this.$store.state.user.resources.treasures === 'idle' || this.$store.state.user.resources.treasures.length === 0">
        Vous n'avez aucun trésors...
      </a>
      <a v-else>
        <div v-for="r in this.$store.state.user.resources.treasures" v-bind:key="r">
          {{r}}
        </div>
      </a>
      </b>
    </p>
  </ul>

  <br />
  <div v-if="this.$store.state.user.resources.registered">
    <MyMap :joueur="this.$store.state.user.resources"/>
  </div>
  <div v-else>
    Le joueur n'a pas encore été attribué à une partie.
  </div>
</template>

<script>
import MyMap from "@/components/MyMap";
import { fetchResources, fetchGameStatus } from "@/utils/apiFunction";

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
      time: undefined,
      isGameStarted: undefined
    };
  },
  methods: {
    async getGameStatus() {
      const res = await fetchGameStatus();
      if (res.status === 200) {
        // Les ressources on été récuperées
        //console.log("response game status : ", res);
        this.isGameStarted = (await res.json())["isGameStarted"];
      } else {
        // Le nom de compte renseigné est déjà pris
        console.log(
          "Impossible de récupérer le status de la partie, code : " + res.status
        );
      }
    }
  },

  beforeMount() {
    this.$store.dispatch('readResource');
  },
  async mounted() {
    this.ping = setInterval(() => {
      this.$store.dispatch('readResource');
    }, 5000);

    this.time = setInterval(async () => {
      console.log(this.$store.state.user.resources.ttl);
      if(this.isGameStarted) {
        if (this.$store.state.user.resources.ttl !== 0)
          this.resources.ttl--;
      } else {
        await this.getGameStatus();
        if(this.isGameStarted) {
          if (this.$store.state.user.resources.ttl !== 0)
            this.resources.ttl--;
        }
      }
    }, 1000);
  },
  async beforeUnmount() {
    clearInterval(this.ping);
    clearInterval(this.time);
  },
  
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
