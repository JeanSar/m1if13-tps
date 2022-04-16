<template>
  <section>
    <h2>Carte</h2>
    <div id="map" class="map"></div>
  </section>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { fetchZRR, fetchTresors, updatePlayerPos, foundTresor } from "@/utils/apiFunction";

// This part resolves an issue where the markers would not appear in webpack
import { Icon } from "leaflet";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// initialisation de la map
let lat = 45.782,
  lng = 4.8656,
  zoom = 19;
let mymap = {};

export default {
  name: "MyMap",
  data() {
    return {
      ping: undefined,
      ping_tresors: undefined,
      marker_tresors: [],
      coffreIcon: undefined
    };
  },
  methods: {
    // Procédure de mise à jour de la map
    updateMap: function () {
      // Affichage à la nouvelle position
      mymap.setView([lat, lng], zoom);

      // La fonction de validation du formulaire renvoie false pour bloquer le rechargement de la page.
      return false;
    },
    async updatePosition(pos) {
      const res = await updatePlayerPos(
        sessionStorage.getItem("login"),
        sessionStorage.getItem("token"),
        pos
      );
      if (res.status === 200) {
        // Les ressources on été récuperées
        //console.log("response de position : ", res);
      } else {
        // Le nom de compte renseigné est déjà pris
        console.log(
          "Impossible de mettre a jour les positions, code : " + res.status
        );
      }
    },
    async updateTresors(L, mymap){
      await this.$store.dispatch('readTreasures');
      for (let i = 0; i < this.$store.state.treasures.items.length; i++) {
        let id = this.$store.state.treasures.items[i].position;
        let obj = this.marker_tresors.find(e => e.getLatLng().equals([id.x, id.y]));
        let opened = this.$store.state.treasures.items[i].isOpen;
        let notadded = (obj === undefined);

        if(!opened && notadded) {
          console.log("Adding ...");
          this.marker_tresors.push(
            L.marker([id.x, id.y], {
              icon: this.coffreIcon,
            })
              .addTo(mymap)
              .bindPopup(
                `Coffre contenant:<br><strong>${this.$store.state.treasures.items.composition}}</strong>.`
              )
          );
        }
        else if(opened && !notadded){
          console.log("Removing ...");
          obj.remove();
          this.marker_tresors = this.marker_tresors.filter(e => e !== obj);
        }
      }
    },
    async takeTresor(pos) {
      const res = await foundTresor(sessionStorage.getItem("login"), pos);
      if (res.status === 204) {
        // Les ressources on été récuperées
        console.log("response de foundTresor : ", res);
        console.log("Coffre récupéré");
      } else{
        // Le nom de compte renseigné est déjà pris
        console.log(
          "Impossible de récupérer le trésor, code : " + res.status
        );
      }
    },
    checkTresor(player_pos){
      this.marker_tresors.forEach(element => {
        if(element.getLatLng().distanceTo(player_pos) <= 2.0){
          console.log("Coffre a proximité");
          this.takeTresor(element.getLatLng());
        }
      });
    },
  },
  async beforeMount() {
    await this.$store.dispatch('initResource');
    console.log("Generate Map");
    // HERE is where to load Leaflet components!
    const L = await import("leaflet");
    // Procédure d'initialisation
    mymap = L.map("map", {
      center: [lat, lng],
      zoom: zoom,
    });

    // Création d'un "tile layer" (permet l'affichage sur la carte)
    L.tileLayer(
      "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=pk.eyJ1IjoieGFkZXMxMDExNCIsImEiOiJja2d3NjJ4c28wNzQ1MnlyMTM1cjEwb2NxIn0.DvtwpmO4QPeZNY6h1rqRVw",
      {
        maxZoom: 22,
        minZoom: 1,
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "pk.eyJ1IjoibTFpZjEzIiwiYSI6ImNqczBubmhyajFnMnY0YWx4c2FwMmRtbm4ifQ.O6W7HeTW3UvOVgjCiPrdsA",
      }
    ).addTo(mymap);

    // Ajout d'un marker
    L.marker([45.78207, 4.86559])
      .addTo(mymap)
      .bindPopup("Entrée du bâtiment<br><strong>Nautibus</strong>.")
      .openPopup();

    // GESTION DE LA ZRR

    await this.$store.dispatch({type: "readZrr"});
    let bounds = [
      [this.$store.state.zrr.limite_NO.x, this.$store.state.zrr.limite_NO.y],
      [this.$store.state.zrr.limite_SE.x, this.$store.state.zrr.limite_SE.y],
    ];
    let rectangle = L.rectangle(bounds, {
      color: "#ff7800",
      weight: 5,
      fill: false,
    }).addTo(mymap);

    // GESTION DES COFFRES AVEC SYNCHRO

    this.coffreIcon = L.icon({
      iconUrl: require("@/assets/icon_coffre.png"),
    });
    await this.updateTresors(L, mymap);
    this.ping_tresors = setInterval(async () => {
      await this.updateTresors(L, mymap);
    }, 3000);

    // GESTION DU JOUEUR ET DE SA POSITION AVEC UPDATE

    const playerIcon = L.icon({
      iconUrl: this.$store.state.user.resources.url,
      iconSize: [30, 30],
    });
    let player_marker = L.marker([this.$store.state.user.resources.position.x, this.$store.state.user.resources.position.y], { icon: playerIcon })
        .addTo(mymap)
        .bindPopup(`Joueur:<br><strong>${this.$store.state.user.resources.id}</strong>`)
        .openPopup();
    this.ping = setInterval(() => {
      // Todo : Dans les prochains tp, mettre à jour la position via l'api de géolocalisation
      if(this.$store.state.user.resources.position.x !== 'idle') {
        //this.$store.commit('movePlayer', {x: 0.000001, y: -0.000001});
        this.updatePosition(this.$store.state.user.resources.position);
        player_marker.setLatLng([this.$store.state.user.resources.position.x, this.$store.state.user.resources.position.y]);
      }
    }, 5000);

    // Clic sur la carte
    mymap.on("click", (e) => {
      lat = e.latlng.lat;
      lng = e.latlng.lng;
      //this.updateMap();
      this.$store.commit('setPosition', {x: lat, y: lng});
      player_marker.setLatLng([this.$store.state.user.resources.position.x, this.$store.state.user.resources.position.y]);
    });

    // Déplacement du joueur
    player_marker.on('move', (player) => {
      if(this.$store.state.user.resources.ttl > 0) {
        this.checkTresor(player.latlng);
      }
    });
  },
  async beforeUnmount() {
    clearInterval(this.ping);
    clearInterval(this.ping_tresors);
  },
};
</script>

<style scoped>
.map {
  height: 400px;
  width: 100%;
  border: 1px solid;
}
</style>
