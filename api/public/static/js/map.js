// initialisation de la map
let lat = 45.782, lng = 4.8656, zoom = 19;

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


let pt1 = {lat: 0, lng: 0};
let pt2 = {lat: 0.1, lng: 0.1};

let onCreateArea = false;
let countClick = 0;

let rectangle = undefined;

document.querySelector("#createArea").addEventListener("click", (e) => {
	onCreateArea = true;
	if(rectangle !== undefined) {
		mymap.removeLayer(rectangle);
	}
});

// Clic sur la carte
mymap.on('click', e => {
	if(onCreateArea) {
		countClick++;
		console.log({countClick})
		if(countClick === 1) {
			pt1.lat = e.latlng.lat;
			pt1.lng = e.latlng.lng;
			console.log({pt1})
		} else if (countClick === 2) {
			pt2.lat = e.latlng.lat;
			pt2.lng = e.latlng.lng;
			console.log({pt2})
			countClick = 0;
			onCreateArea = false;

			let bounds = [[pt1.lat, pt1.lng], [e.latlng.lat, e.latlng.lng]];
			rectangle = L.rectangle(bounds).addTo(mymap);
		}


	} else {
		lat = e.latlng.lat;
		lng = e.latlng.lng;
		console.log("A cliquer à la pos : ", {lat}, {lng});
		updateMap();
	}

});

// Mise à jour de la map
function updateMap() {
	// Affichage à la nouvelle position
	mymap.setView([lat, lng], zoom);

	// La fonction de validation du formulaire renvoie false pour bloquer le rechargement de la page.
	return false;
}