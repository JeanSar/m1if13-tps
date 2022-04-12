const url = 'http://localhost:3376'

export async function fetchResources(loginValue, token) {
    return await fetch(`${url}/api/${loginValue}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "authorization": token,
      }
    });
}

export async function updatePlayerPos(loginValue, token, pos){
  const body = JSON.stringify({position : pos});
  return await fetch(`${url}/api/${loginValue}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "authorization": token,
    },
    body: body
  });
}

export async function fetchZRR() {
  return await fetch(`${url}/zrr/getOne?id=0`, {
    method: "GET",
    headers: {
      "content-type": "*/*",
    },
  });
}

export async function fetchTresors(){
  return await fetch(`${url}/tresor/getAll`, {
    method: "GET",
    headers: {
      "content-type": "*/*",
    },
  });
}
