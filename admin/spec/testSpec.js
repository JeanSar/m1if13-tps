const axios = require("axios");


const apiPath = 'http://localhost:3376/admin';

async function setTTL(ttlValue, isNodeEnv) {
    const body = JSON.stringify({ttl: ttlValue});
    const url = `${apiPath}/ttlInit`;
    let res;
    try {

        if(!isNodeEnv) {
            console.log("In browser env");
            res = await fetch(url, {
                method: "POST",
                body: body,
                headers: {
                    'content-type': 'application/json'
                }
            });
        } else {
            console.log("In node env");
            res = await axios.post(url, body);
        }
        if(res.status === 204) {
           // console.log(res);
            console.log("TTl initialisé");
        }
    } catch (e) {
        console.error(e.message);
    }

    return res;
}

async function addUser(namePlayer, isNodeEnv) {
    const body = JSON.stringify({id: namePlayer});
    const url = `${apiPath}/registerPlayerZZR`;
    let res;
    try {
        if(!isNodeEnv) {
            res = await fetch(url, {
                method: "POST",
                body: body,
                headers: {'content-type': 'application/json'}
            });
        } else {
            res = await axios.post(url, body)
        }

        if(res.status === 204) {
            console.log("Joueur ajouté dans la zrr");
        } else {
            console.log("Aucun joueur de ce nom ou la ZRR n'a pas encore été crée ");
        }
    } catch (e) {
        res = e.response.status;
        console.log(e.message);
    }

    return res;
}

async function getSelectedResources(namePlayer, isNodeEnv) {
    const url = `http://localhost:3376/api/${namePlayer}`;
    let res;
    try {
        if(!isNodeEnv) {
            res = await fetch(url, {
                method: "GET",
                headers: {'X-Admin-Authorization': true}
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

describe("Init TTL test",  function() {
    it("res status response = 204", async function() {
        const res = await setTTL(54, true)
        expect(res.status).toBe(204);
    });
});

describe("Add user into zrr test",  function() {
    it("res status response not equal to 204 (player does'nt exists)", async function() {
        const res = await addUser("Toto", true);
        expect(res.status).not.toBe(204);
    });
});

describe("Fetch resources for one player fail",  function() {
    it("res status response not equal to 204 (player does'nt exists)", async function() {
        const res = await getSelectedResources("Toto", true);
        expect(res.status).not.toBe(204);
    });
});

describe('MyApp', function() {
    beforeEach(function() {
        browser().navigateTo('../index.html');
    });

    it('should be true', function() {
        expect(true).toBe(true);
    });
});