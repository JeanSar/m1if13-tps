import apiPath from './apiPath-dev';

console.log("Form.js loaded...")

async function setTTL(ttlValue) {
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
}

document.querySelector("#okTTL").addEventListener("click", async (e) => {
    e.preventDefault();
    const ttlValue = document.querySelector("#ttl").value;
    await setTTL(ttlValue);
});

async function addUser(namePlayer) {
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
            window.alert("Aucun joueur de ce nom ou la ZRR n'a pas encore été crée ");
        }
    } catch (e) {
        console.log(e.message);
    }
}

const addUserIntoZRR = document.querySelector("#addUser");
// TODO - Message si le joueur est déjà inscrit
addUserIntoZRR.addEventListener("click", async (e) => {
    e.preventDefault();
    const namePlayer = document.querySelector("#namePlayer").value;
    await addUser(namePlayer);
    const resource = await getSelectedResources(namePlayer);
    fillFieldSelectedResources(resource);
});

async function getSelectedResources(namePlayer) {
    const res = await fetch(`http://localhost:3376/api/${namePlayer}`, {
        method: "GET",
        headers: {'X-Admin-Authorization': true}
    });
    return await res.json();
}
function fillFieldSelectedResources(resource) {
    console.log({resource})
    document.querySelector("#playerImage").setAttribute("src", resource.url);
    document.querySelector("#showPlayerTTL").innerHTML = resource.ttl;
}




