console.log("Hello world !");
fetch("http://localhost:3376/admin/playerPositon?id=toto").then(r => r.json()).then(console.log)