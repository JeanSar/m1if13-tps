import $ from 'jquery';

const apiPath = 'http://localhost:3376/admin'
// MàJ de l'indicateur numérique du zoom
function updateZoomValue() {
    $('#zoomValue').html($('#zoom').val());
	updateMap();
}


// // Abonnement aux événements de changement
// $('#lat').change(updateMap);
// $('#lon').change(updateMap);
// $('#zoom').change(updateZoomValue);

console.log("Form.js loaded...")

document.querySelector("#okTTL").addEventListener("click", async (e) => {
    e.preventDefault();
    const ttlValue = document.querySelector("#ttl").value;
    const body = JSON.stringify({ttl: ttlValue});
    try {
        const res = await fetch(`${apiPath}/ttlInit`, {
            method: "POST",
            body: body,
            headers: {
                'content-type': 'application/json'
            }
        });
        if(res.status === 204) {
            console.log(res);
            console.log("TTl initialisé");
        }
    } catch (e) {
        console.error(e.message);
    }
});

fetch(`${apiPath}/playerTtl/Toto`).then(res => res.json()).then(resJSON => {
    const TTLPlayer = document.querySelector("#showPlayerTTL");
    TTLPlayer.innerHTML = res.aventurier.ttl;
});

