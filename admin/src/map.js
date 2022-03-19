import * as L from 'leaflet';
import apiPath from './apiPath-dev';

async function popTreasur({lat, lng}, composition) {
	const body = {
		position: {
			x: lat,
			y: lng
		},
		composition: composition
	}
	try {
		const res = await fetch(`${apiPath}/popTresor`, {
			method: "POST",
			headers: { 'content-type': "application/json" },
			body: JSON.stringify(body)
		});
		return res.status;
	} catch (e) {
		console.error(e.message);
		return undefined;
	}
}
async function startGame(gameStarted) {
	if(!gameStarted) {
		console.log("Partie pas encore commencé")
		try {
			const res = await fetch(`${apiPath}/startGame`, {
				method: "POST",
				headers: { 'content-type': "application/json" }
			});
			return res.status;
		} catch (e) {
			console.log(e.message);
			return undefined;
		}
	}
	console.log("La partie est déjà lancée");
}



(async function main() {
	// initialisation de la map
	let lat = 45.782, lng = 4.8656, zoom = 19;
	const resGameIsStarted = await fetch(`${apiPath}/startGame`);
	const resGameIsStartedJSON = await resGameIsStarted.json();
	let gameStarted = resGameIsStartedJSON.isGameStarted;
	let mymap = L.map('map', {
		center: [lat, lng],
		zoom: zoom
	});
//updateMap();

// Création d'un "tile layer" (permet l'affichage sur la carte)
	L.tileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=pk.eyJ1IjoibTFpZjEzIiwiYSI6ImNqczBubmhyajFnMnY0YWx4c2FwMmRtbm4ifQ.O6W7HeTW3UvOVgjCiPrdsA', {
		maxZoom: 22,
		minZoom: 1,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1,
		accessToken: 'pk.eyJ1IjoibTFpZjEzIiwiYSI6ImNqczBubmhyajFnMnY0YWx4c2FwMmRtbm4ifQ.O6W7HeTW3UvOVgjCiPrdsA'
	}).addTo(mymap);

// Ajout d'un marker
	L.marker([45.78207, 4.86559]).addTo(mymap).bindPopup('Entrée du bâtiment<br><strong>Nautibus</strong>.').openPopup();


// pt1 et pt2 sont initialiséé avec des valeur 'par défaut', ces point étant assez loin de notre position,
// cela passera innaperçu
	let pt1 = { lat: 0, lng: 0 };
	let pt2 = { lat: 0.1, lng: 0.1 };

	let onCreateArea = false;
	let zrrCreated = false;
	let fire = false;
	let countClick = 0;

	let rectangle = undefined;

	document.querySelector("#createArea").addEventListener("click", (e) => {
		e.preventDefault();
		onCreateArea = true;
		if (rectangle !== undefined) { // Si on a déjà une zone d'affiché, on la supprime avant d'en récréer une autre
			mymap.removeLayer(rectangle);
		}
	});

	document.querySelector("#sendTreasure").addEventListener("click", (e) => {
		e.preventDefault();
		fire = !fire; // Cela implique que pour cessé de faire pop des coffres, il faudra recliqué sur fires
	});

// Clic sur la carte
	mymap.on('click', async e => {
		if (onCreateArea) {
			countClick++;
			if (countClick === 1) {
				pt1.lat = e.latlng.lat;
				pt1.lng = e.latlng.lng;
			} else if (countClick === 2) {
				pt2.lat = e.latlng.lat;
				pt2.lng = e.latlng.lng;
				countClick = 0;
				onCreateArea = false;

				let bounds = [[pt1.lat, pt1.lng], [e.latlng.lat, e.latlng.lng]];
				rectangle = L.rectangle(bounds).addTo(mymap);
				setZRR(rectangle.getBounds());
			}
		} else if (fire) { // Si on a presser le bouton fire, un clique sur la map déclenche le pop d'un coffre
			const composition = document.querySelector("#treasureType").value;
			const resStatus = await popTreasur(e.latlng, composition);
			if (resStatus === 201) { // Le trésor a bien été ajouté
				const treasureIcon = L.icon({iconUrl: "./icon_coffre.png"});
				L.marker([e.latlng.lat, e.latlng.lng], { icon: treasureIcon })
					.addTo(mymap).bindPopup(`Coffre contenant:<br><strong>${composition}}</strong>.`)
					.openPopup();

				startGame(gameStarted);
				gameStarted = true;

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
		document.querySelector('#lat1').value = a.lat;
		document.querySelector('#lon1').value = a.lng;
		document.querySelector('#lat2').value = b.lat;
		document.querySelector('#lon2').value = b.lng;
		zrrCreated = true;
	}

	document.querySelector('#submitSendZrr').addEventListener('click', e => {
		e.preventDefault();
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

			const body = JSON.stringify(
				{
					limite_NE: { x: xNE, y: yNE },
					limite_NO: { x: xNO, y: yNO },
					limite_SE: { x: xSE, y: ySE },
					limite_SO: { x: xSO, y: ySO }
				}
			);
			console.log(body);
			try {
				await fetch(`${apiPath}/areaLimit`, {
					method: "POST",
					body: body,
					headers: { 'content-type': "application/json" }
				});
				console.log('ZRR envoyé.')
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
})()

// let gameStarted = false

