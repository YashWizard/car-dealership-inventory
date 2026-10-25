const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

export async function api(path, {
  token,
  method = "GET",
  body,
  signal,
} = {}) {
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      signal,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error(
      "Cannot reach the backend. Check that port 8000 is running.",
    );
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && token) {
      window.dispatchEvent(new Event("driveledger-session-expired"));
    }

    const detail = data.detail;
    const message = Array.isArray(detail)
      ? detail.map((item) => item.msg || "Invalid value").join("; ")
      : typeof detail === "string"
        ? detail
        : `Request failed (${response.status}).`;

    throw new Error(message);
  }

  return data;
}
