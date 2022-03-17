import $ from 'jquery';

const apiPath = 'http://localhost:3376/admin'
// MàJ de l'indicateur numérique du zoom
// function updateZoomValue() {
//     $('#zoomValue').html($('#zoom').val());
// 	updateMap();
// }


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

const addUserIntoZRR = document.querySelector("#addUser");
// TODO - Message si le joueur est déjà inscrit
addUserIntoZRR.addEventListener("click", async (e) => {
    e.preventDefault();
    const namePlayer = document.querySelector("#namePlayer").value;
    const body = JSON.stringify({id: namePlayer});
    try {
        const res = await fetch(`${apiPath}/registerPlayerZZR`, {
            method: "POST",
            body: body,
            headers: {'content-type': 'application/json'}
        });
        if(res.status === 204) {
            window.alert("Joueur ajouté dans la zrr");
        } else {
            window.alert("Aucun joueur de ce nom");
        }
    } catch (e) {
        console.log(e.message);
    }
});



