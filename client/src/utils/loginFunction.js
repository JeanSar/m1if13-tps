const url = 'http://localhost:8080'

export async function createAnAccount({ loginValue, passwordValue }) {
  const body = JSON.stringify({login: loginValue, password: passwordValue});
  return await fetch(`${url}/users/`, {
    mode: "cors",
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: body
  });
}

export async function loginFunction({ loginValue, passwordValue }) {
  const body = JSON.stringify({login: loginValue, password: passwordValue});
  return await fetch(`${url}/login`, {
    mode: "cors",
    method: "POST",
    headers: {
      "content-type": "application/json",
      "origin": "http://localhost"
    },
    body: body
  });
}