import apiPath from "./apiPath";
import axios from "axios";

console.log("Form.js loaded...");

async function setTTL(ttlValue, isNodeEnv) {
    const body = JSON.stringify({ ttl: ttlValue });
    const url = `${apiPath}/admin/ttlInit`;
    let res;
    try {
        if (!isNodeEnv) {
            console.log("In browser env");
            res = await fetch(url, {
                method: "POST",
                body: body,
                headers: {
                    "content-type": "application/json",
                },
            });
        } else {
            console.log("In node env");
            res = await axios.post(url, body);
        }
        if (res.status === 204) {
            console.log(res);
            console.log("TTl initialisé");
        }
    } catch (e) {
        console.error(e.message);
    }

    return res;
}

document.querySelector("#okTTL").addEventListener("click", async (e) => {
    e.preventDefault();
    const ttlValue = document.querySelector("#ttl").value;
    await setTTL(ttlValue);
});

async function addUser(namePlayer, isNodeEnv) {
    const body = JSON.stringify({ id: namePlayer });
    const url = `${apiPath}/admin/registerPlayerZZR`;
    let res;
    try {
        if (!isNodeEnv) {
            res = await fetch(url, {
                method: "POST",
                body: body,
                headers: { "content-type": "application/json" },
            });
        } else {
            res = await axios.post(url, body);
        }

        if (res.status === 204) {
            window.alert("Joueur ajouté dans la zrr");
        } else {
            window.alert(
                "Aucun joueur de ce nom ou la ZRR n'a pas encore été crée "
            );
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

async function getSelectedResources(namePlayer, isNodeEnv) {
    const url = `${apiPath}/api/${namePlayer}`;
    let res;
    try {
        if (!isNodeEnv) {
            res = await fetch(url, {
                method: "GET",
                headers: { "X-Admin-Authorization": true },
            });
        } else {
            res = await axios.get(url);
        }
    } catch (e) {
        res = e.response.status;
        return res;
    }

    return await res.json();
}

function fillFieldSelectedResources(resource) {
    console.log({ resource });
    document.querySelector("#playerImage").setAttribute("src", resource.url);
    document.querySelector("#showPlayerTTL").innerHTML = resource.ttl;
    let tresors = " : ";
    resource.treasures.forEach((t) => {
        tresors += t.composition + " ; ";
    });
    document.querySelector("#showTresorPlayer").innerHTML = tresors;
}
