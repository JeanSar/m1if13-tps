import apiPath from './apiPath-dev';

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

