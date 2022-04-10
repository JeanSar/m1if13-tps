const url = 'http://localhost:3376'

export async function fetchResources(loginValue, token) {
    return await fetch(`${url}/api/${loginValue}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "authorization": token,
      },
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