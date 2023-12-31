import * as L from "leaflet";

import apiPath from "./apiPath";

// initialisation de la map
let lat = 45.782,
    lng = 4.8656,
    zoom = 19;
    
let mymap = L.map("map", {
    center: [lat, lng],
    zoom: zoom,
});
//updateMap();

// Création d'un "tile layer" (permet l'affichage sur la carte)
L.tileLayer(
    "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=pk.eyJ1IjoibTFpZjEzIiwiYSI6ImNqczBubmhyajFnMnY0YWx4c2FwMmRtbm4ifQ.O6W7HeTW3UvOVgjCiPrdsA",
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

let pt1 = { lat: 0, lng: 0 };
let pt2 = { lat: 0.1, lng: 0.1 };

let onCreateArea = false;
let zrrCreated = false;
let fire = false;
let countClick = 0;

let rectangle = undefined;
let markerpt1 = undefined;
let markerpt2 = undefined;

document.querySelector("#createArea").addEventListener("click", (e) => {
    e.preventDefault();
    onCreateArea = true;
    removeLayer(rectangle);
    removeLayer(markerpt1);
    removeLayer(markerpt2);
});

document.querySelector("#sendTreasure").addEventListener("click", async (e) => {
    e.preventDefault();

    const res2 = await fetch(`${apiPath}/admin/startGame`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
    });

    console.log(res2);
    if (res2.status === 204) {
        // Le serveur a bien commencé partie
    }
    fire = true;
});

// Clic sur la carte
mymap.on("click", async (e) => {
    if (onCreateArea) {
        countClick++;
        console.log({ countClick });
        if (countClick === 1) {
            pt1.lat = e.latlng.lat;
            pt1.lng = e.latlng.lng;
            markerpt1 = L.marker(pt1).addTo(mymap);
        } else if (countClick === 2) {
            pt2.lat = e.latlng.lat;
            pt2.lng = e.latlng.lng;
            markerpt2 = L.marker(pt2).addTo(mymap);
            countClick = 0;
            onCreateArea = false;
            let bounds = [
                [pt1.lat, pt1.lng],
                [e.latlng.lat, e.latlng.lng],
            ];
            rectangle = L.rectangle(bounds, {
                color: "#ff7800",
                weight: 5,
                fill: false,
            }).addTo(mymap);
            setZRR(rectangle.getBounds());
        }
    } else if (fire && zrrCreated) {
        // Si on a presser le bouton fire, un clique sur la map déclenche le pop d'un coffre
        const { lat: coffre_lat, lng: coffre_lng } = e.latlng;
        const composition = document.querySelector("#treasureType").value;
        const body = {
            position: {
                x: coffre_lat,
                y: coffre_lng,
            },
            composition: composition,
        };
        try {
            const res = await fetch(`${apiPath}/admin/popTresor`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (res.status === 201) {
                // Le trésor a bien été ajouté
                const coffreIcon = L.icon({
                    iconUrl: "./icon_coffre.png",
                });
                // TODO - Centrer le coffre via une fonction, puis récupré la vrai position via l'inverse de cette fonction
                L.marker([coffre_lat, coffre_lng], { icon: coffreIcon })
                    .addTo(mymap)
                    .bindPopup(
                        `Coffre contenant:<br><strong>${composition}</strong>.`
                    )
                    .openPopup();
            }
        } catch (e) {
            console.error(e.message);
        }
    } else {
        lat = e.latlng.lat;
        lng = e.latlng.lng;
        console.log("A cliquer à la pos : ", { lat }, { lng });
        updateMap();
    }
});

function setZRR(bounds) {
    let a = bounds.getNorthWest(); //Point a
    let b = bounds.getSouthEast(); // Point b
    document.querySelector("#lat1").value = a.lat;
    document.querySelector("#lon1").value = a.lng;
    document.querySelector("#lat2").value = b.lat;
    document.querySelector("#lon2").value = b.lng;
    zrrCreated = true;
}

document.querySelector("#submitSendZrr").addEventListener("click", (e) => {
    e.preventDefault();
    removeLayer(markerpt1);
    removeLayer(markerpt2);
    sendZRR();
});

async function sendZRR() {
    if (zrrCreated) {
        const xNO = Number.parseFloat(document.querySelector("#lat1").value);
        const yNO = Number.parseFloat(document.querySelector("#lon1").value);
        const xSE = Number.parseFloat(document.querySelector("#lat2").value);
        const ySE = Number.parseFloat(document.querySelector("#lon2").value);
        const xNE = xSE;
        const yNE = yNO;
        const xSO = xNO;
        const ySO = ySE;

        const body = JSON.stringify({
            limite_NE: { x: xNE, y: yNE },
            limite_NO: { x: xNO, y: yNO },
            limite_SE: { x: xSE, y: ySE },
            limite_SO: { x: xSO, y: ySO },
        });
        console.log(body);
        try {
            await fetch(`${apiPath}/admin/areaLimit`, {
                method: "POST",
                body: body,
                headers: {
                    "content-type": "application/json",
                },
            });
            console.log("ZRR envoyé.");
        } catch (e) {
            console.error(e.message);
        }
    }
}

// Mise à jour de la map
function updateMap() {
    // Affichage à la nouvelle position
    mymap.setView([lat, lng], zoom);

    // La fonction de validation du formulaire renvoie false pour bloquer le rechargement de la page.
    return false;
}

function removeLayer(layer) {
    if (layer !== undefined) {
        mymap.removeLayer(layer);
    }
}
