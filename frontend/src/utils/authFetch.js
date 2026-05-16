function resolveUrl(path) {
  const base = import.meta.env.VITE_API_BASE_URL;
  return base ? `${base}/${path}` : `http://localhost:8000/${path}`;
}

export { resolveUrl };

function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  return fetch(resolveUrl(url), { ...options, headers }).then((response) => {
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return response;
  });
}

export default authFetch;
