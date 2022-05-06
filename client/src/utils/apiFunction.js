const url = 'http://localhost:3376'

export async function fetchResources(loginValue, token) {
    return await fetch(`${__API__.api}/api/${loginValue}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "authorization": token,
      }
    });
}

export async function updatePlayerPos(loginValue, token, pos){
  const body = JSON.stringify({position : pos});
  return await fetch(`${__API__.api}/api/${loginValue}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "authorization": token,
    },
    body: body
  });
}

export async function fetchZRR() {
  return await fetch(`${__API__.api}/zrr/getOne?id=0`, {
    method: "GET",
    headers: {
      "content-type": "*/*",
    },
  });
}

export async function fetchTresors(){
  return await fetch(`${__API__.api}/tresor/getAll`, {
    method: "GET",
    headers: {
      "content-type": "*/*",
    },
  });
}

export async function fetchGameStatus(){
  return await fetch(`${__API__.api}/admin/startGame`, {
    method: "GET",
    headers: {
      "content-type": "application/json"
    }
  });
}

export async function foundTresor(loginValue, pos) {
  const body = JSON.stringify({id: loginValue, position : {x: pos.lat, y: pos.lng}});
  return await fetch(`${__API__.api}/admin/foundTresor`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: body,
  });
}