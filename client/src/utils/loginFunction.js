const url = 'http://localhost:8080'

export async function createAnAccountOnSpring({ loginValue, passwordValue }) {
  const body = JSON.stringify({login: loginValue, password: passwordValue});
  return await fetch(`${__API__.user}/users/`, {
    mode: "cors",
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: body
  });
}

export async function createAnAccountOnNode({loginValue, passwordValue, ttlValue, imageValue}) {
  await fetch(`${__API__.api}/user/create`, {
    method: "POST",
    body: JSON.stringify({
      "aventurier": {
        "id": loginValue,
        "image": imageValue,
        "ttl": ttlValue,
        "position": {
          "x": 0,
          "y": 0
        },
        "tresors": []
      },
      "isAdmin": false
    }),
    headers: {
      "content-type": "application/json"
    }
  })
}

export async function loginFunction({ loginValue, passwordValue }) {
  const body = JSON.stringify({login: loginValue, password: passwordValue});
  return await fetch(`${__API__.user}/login`, {
    mode: "cors",
    method: "POST",
    headers: {
      "content-type": "application/json",
      "origin": "http://localhost"
    },
    body: body
  });
}