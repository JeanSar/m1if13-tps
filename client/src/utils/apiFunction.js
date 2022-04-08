const url = 'http://localhost:3376/api'

export async function fetchResources(loginValue, token) {
    return await fetch(`${url}/${loginValue}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "authorization": token,
      },
    });
}