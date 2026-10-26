async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  })
  if (!res.ok) {
    let message = 'Something went wrong. Try again.'
    try {
      const body = await res.json()
      if (body.message) message = body.message
    } catch {
      /* keep default message */
    }
    const err = new Error(message)
    err.status = res.status
    throw err
  }
  return res.json()
}

export const createRoom = (question) =>
  request('/rooms', { method: 'POST', body: JSON.stringify({ question }) })

export const getRoom = (code) => request(`/rooms/${code}`)

export const castVote = (code, nickname, score) =>
  request(`/rooms/${code}/votes`, {
    method: 'POST',
    body: JSON.stringify({ nickname, score }),
  })

export const closeRoom = (code, hostKey) =>
  request(`/rooms/${code}/close`, {
    method: 'POST',
    headers: { 'X-Host-Key': hostKey },
  })
