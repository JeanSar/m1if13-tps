<template>
  <section>
    <h2>Carte</h2>
    <p class="content">
      <strong>TODO :</strong> mettre à jour les positions des différents objets
      sur la carte.
    </p>
    <div id="map" class="map"></div>
  </section>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { fetchZRR, fetchTresors, updatePlayerPos } from "@/utils/apiFunction";

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
  props: {
    joueur: Object,
    loginValue: String,
    token: String,
  },
  data() {
    return {
      ping: undefined,
      ping_tresors: undefined,
      zrr: {
        limite_NE: {
          x: 45.78,
          y: 4.86,
        },
        limite_NO: {
          x: 45.78,
          y: 4.86,
        },
        limite_SE: {
          x: 45.78,
          y: 4.86,
        },
        limite_SO: {
          x: 45.78,
          y: 4.86,
        },
      },
      tresors: [],
      marker_tresors: [],
      position: {
        x: this.joueur.position.x,
        y: this.joueur.position.y,
      },
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
    async getZRR() {
      const res = await fetchZRR();
      if (res.status === 200) {
        // Les ressources on été récuperées
        console.log("response : ", res);
        this.zrr = await res.json();
      } else {
        // Le nom de compte renseigné est déjà pris
        console.log("Impossible de récupérer la ZRR, code : " + res.status);
      }
    },
    async getTresors() {
      const res = await fetchTresors();
      if (res.status === 200) {
        // Les ressources on été récuperées
        console.log("response : ", res);
        this.tresors = await res.json();
      } else {
        // Le nom de compte renseigné est déjà pris
        console.log(
          "Impossible de récupérer les Tresors, code : " + res.status
        );
      }
    },
    async updatePosition(pos) {
      const res = await updatePlayerPos(this.loginValue, this.token, pos);
      if (res.status === 200) {
        // Les ressources on été récuperées
        console.log("response de position : ", res);
      } else {
        // Le nom de compte renseigné est déjà pris
        console.log(
          "Impossible de mettre a jour les positions, code : " + res.status
        );
      }
    },
  },
  async beforeMount() {
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

    await this.getZRR();
    let bounds = [
      [this.zrr.limite_NO.x, this.zrr.limite_NO.y],
      [this.zrr.limite_SE.x, this.zrr.limite_SE.y],
    ];
    let rectangle = L.rectangle(bounds, {
      color: "#ff7800",
      weight: 5,
      fill: false,
    }).addTo(mymap);

    // GESTION DES COFFRES AVEC SYNCHRO

    const coffreIcon = L.icon({
      iconUrl: require("@/assets/icon_coffre.png"),
    });
    this.ping_tresors = setInterval(async () => {
      await this.getTresors();

      for (let i = 0; i < this.tresors.length; i++) {
        let id = this.tresors[i].position;
        let obj = this.marker_tresors.find(e => e.getLatLng().equals([id.x, id.y]));
        console.log(obj);
        let opened = this.tresors[i].isOpen;
        let notadded = (obj === undefined);

        if(!opened && notadded) {
          console.log("Adding ...");
          this.marker_tresors.push(
            L.marker([this.tresors[i].position.x, this.tresors[i].position.y], {
              icon: coffreIcon,
            })
              .addTo(mymap)
              .bindPopup(
                `Coffre contenant:<br><strong>${this.tresors[i].composition}}</strong>.`
              )
          );
        } 
        else if(opened && !notadded){
          console.log("Removing ...");
          obj.remove();
          this.marker_tresors = this.marker_tresors.filter(e => e !== obj);
        }
      }
    }, 3000);

    // GESTION DU JOUEUR ET DE SA POSITION AVEC UPDATE

    const playerIcon = L.icon({
      iconUrl: this.joueur.url,
      iconSize: [30, 30],
    });
    let player_marker = L.marker(
      [this.joueur.position.x, this.joueur.position.y],
      { icon: playerIcon }
    )
      .addTo(mymap)
      .bindPopup(`Joueur:<br><strong>${this.joueur.id}</strong>`)
      .openPopup();

    this.ping = setInterval(() => {
      // Todo : Dans les prochains tp, mettre à jour la position via l'api de géolocalisation
      this.position.x = this.position.x + 0.00001;
      this.position.y = this.position.y - 0.00001;
      this.updatePosition(this.position);
      player_marker.setLatLng([this.position.x, this.position.y]);
    }, 5000);

    // Clic sur la carte
    mymap.on("click", (e) => {
      lat = e.latlng.lat;
      lng = e.latlng.lng;
      this.updateMap();
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
