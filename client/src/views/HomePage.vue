<template>
  <div style="display: flex; flex-direction: column; align-items: center" v-if="this.$store.state.user.resources.id !== 'idle'" >
    <div>
      <h1> Bienvenue {{ this.$store.state.user.resources.id }} ! </h1>
    </div>
    <div style="display: flex; flex-direction: column">
      <div class="container">
        <img :src="this.$store.state.user.resources.url" alt="" style="width: 100px; border-radius: 50%; opacity: 50%" />
      </div>
      <div style="font-weight: bold" class="container">
        Identifiant de joueur: {{ this.$store.state.user.resources?.id }}
      </div>
      <div class="container">
          <span>
            Role: <span v-if="this.$store.state.user.resources.role === 'admin'">Administrateur</span>
            <span v-else>Joueur</span>
          </span>


      </div>
      <div class="container">
        TTL: {{ this.$store.state.user.resources.ttl }}
      </div>
      <div class="container">
        <span style="margin-right: 0.2em">Trésors:</span>
          <span v-if="this.$store.state.user.resources.treasures === 'idle'
                      || this.$store.state.user.resources.treasures.length === 0">
          Vous n'avez aucun trésors...
        </span>
          <div class="container" v-else>
            <div v-for="c in compoArr" v-bind:key="c">
              <div v-if="this.$store.state.user.resources.treasures.find((t) => t.composition == c) != undefined">
                Coffre {{ c }} :
                {{
                  this.$store.state.user.resources.treasures.filter(
                      (t) => t.composition == c
                  ).length
                }}
              </div>
            </div>
          </div>
      </div>
      <div class="container">
          Le trésor le plus proche se trouve à :
          {{ String(this.$store.state.treasures.closerTreasure) === "Chargement ..."
             ? String(this.$store.state.treasures.closerTreasure)
             : String(this.$store.state.treasures.closerTreasure) + "mètre.s" }}
      </div>
    </div>

  </div>
  <div style="display: flex; flex-direction: column; justify-content: center" v-else>
    <h1>Vous devez être connecté pour accéder à cette page !</h1>
    <router-link style="color: #0b7350; font-weight: bold; font-size: 1.5em; margin-top: 1em" class="router-link" to="/">Retour à la page de login</router-link>
  </div>
  <div v-if="this.$store.state.user.resources.registered">
    <MyMap />
  </div>
  <div class="container" v-else>Le joueur n'a pas encore été attribué à une partie.</div>
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
  data() {
    return {
      ping: undefined,
      time: undefined,
      isGameStarted: false,
      compoArr: ["lune", "pierre magique", "Bêta-X", "dissimulation"],
      notifAllowed: false,
      notifFinShown: false,
      notifDebutShown: false,
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
    },
    displayGameInf() {
      if (this.$store.state.user.resources.ttl > 0) {
        if(this.notifDebutShown) {
          this.$store.commit("decreaseTTL");
        } else {
          this.notification("Début de la partie.");
          this.notifDebutShown = true;
        }
      } else {
        if (!this.notifFinShown) {
          this.notification("Fin de la partie.");
          this.notifFinShown = true; // meme si les notifications ne sont pas authorisé, on tent d'afficher une seule fois
        }
      }
    },
    notification(msg) {
      if (this.notifAllowed) {
        const notifTitle = "Treasure Guild";
        const notifBody = msg;
        const notifImg = require("@/assets/icon_coffre.png");
        const options = {
          body: notifBody,
          icon: notifImg,
        };
        new Notification(notifTitle, options);
      }
    },
  },
  async mounted() {
    // demande à l'utilisateur l'authorisation de notification (pas obligatoire)
    Notification.requestPermission().then((result) => {
      this.notifAllowed = result === "granted";
    });
    await this.$store.dispatch("initResource");
    this.ping = setInterval(() => {
      this.$store.dispatch("readResource");
    }, 5000);

    this.time = setInterval(async () => {
      if (this.isGameStarted && this.$store.state.user.resources.registered) {
        if (this.$store.state.user.resources.ttl !== 0) {
          this.$store.commit("decreaseTTL");
          if(this.$store.state.user.resources.ttl == 0) {
            this.notification("Fin de la partie.");
          }
        }
      } else {
        this.notifDebutShown = false;
        this.notifFinShown = false;
        await this.getGameStatus();
        if(this.isGameStarted && this.$store.state.user.resources.registered) {
          if(this.$store.state.user.resources.ttl > 0) {
            this.notification("Début de la partie.");
          } else {
            this.notification("Fin de la partie.");
          }
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
<style scoped>
.container{
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 0.5em;
  margin-top: 0.5em;
}
</style>
