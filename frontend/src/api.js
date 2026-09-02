const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }
  if (res.status === 204) return null;
  return res.json();
}

export function createSong(data) {
  return request("/songs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function listSongs() {
  return request("/songs");
}

export function getSong(id) {
  return request(`/songs/${id}`);
}

export function deleteSong(id) {
  return request(`/songs/${id}`, { method: "DELETE" });
}
