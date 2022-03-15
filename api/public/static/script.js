const baseURL = "http://localhost:3376/admin";

// Pop trésor
const divTresor = document.querySelector("#tresor");

const okTresor = divTresor.querySelector("#ok");
okTresor.addEventListener("click", (e) => {
    e.preventDefault();
    const x = Number.parseFloat(divTresor.querySelector("#x").value);
    const y = Number.parseFloat(divTresor.querySelector("#y").value);

    const composition = divTresor.querySelector("#composition").value;
    const body = JSON.stringify({position: {x: x, y: y}, composition: composition});
    console.log(body);
    fetch(`${baseURL}/popTresor`, {
        method: "POST",
        body: body,
        headers: {'content-type': "application/json"}
    }).then(console.log);
})


// Init ttl
const divTTl = document.querySelector("#initTTL");
const okTTL = divTTl.querySelector("#okTTL");
okTTL.addEventListener("click", (e) => {
    e.preventDefault();
    const ttl = Number.parseFloat(divTTl.querySelector("#ttl").value);
    const body = JSON.stringify({ttl: ttl});
    fetch(`${baseURL}/ttlInit`, {
        method: "POST",
        body: body,
        headers: {'content-type': "application/json"}
    }).then(console.log);
});

// Get position
const divGetPos = document.querySelector("#getPos");
const okGetPos = divGetPos.querySelector("#okGetPos");
const showPos = divGetPos.querySelector("#showPos");
okGetPos.addEventListener("click", async (e) => {
    const player = divGetPos.querySelector("#player").value;
    const response = await fetch(`${baseURL}/playerPositon?id=${player}`);
    const pos = await response.json();
    showPos.innerHTML = `x : ${pos.x}, y: ${pos.y}`;
});

// Get player ttl
const divGetTTL = document.querySelector("#getTTL");
const okGetTTL = divGetTTL.querySelector("#okGetTTL");
const showTTL = divGetTTL   .querySelector("#showTTL");
okGetTTL.addEventListener("click", async (e) => {
    const player = divGetTTL.querySelector("#tll").value;
    const response = await fetch(`${baseURL}/playerTtl?id=${player}`);
    const ttl = await response.json();
    console.log(ttl)
    showTTL.innerHTML = `ttl: ${ttl.ttl}`;
});


// Start game
const startGame = document.querySelector("#startGame");
const okStartGame = startGame.querySelector("#okStartGame");
okStartGame.addEventListener("click", (e) => {
    fetch(`${baseURL}/startGame`, {
        method: "POST",
    }).then(console.log)
});

// Found tresor
const foundTresor = document.querySelector("#foundTresor");
const foundTresorOk = foundTresor.querySelector("#foundTresorOk");
foundTresorOk.addEventListener("click", (e) => {
    e.preventDefault();
    const x = foundTresor.querySelector("#foundTresorX").value;
    const y = foundTresor.querySelector("#foundTresorY").value;
    const body = JSON.stringify({x: x, y: y});
    console.log(body)//
    fetch(`${baseURL}/foundTresor`, {
        method: "POST",
        body: body,
        headers: {'content-type': "application/json"}
    }).then(res => console.log(res.statusText));
});