const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export function createAuthHeaders(token, isJson = true) {
  if (!token) throw new Error("Missing Firebase ID token");
  const headers = new Headers({
    'Authorization': `Bearer ${token}`,
  });
  if (isJson) {
    headers.set('Content-Type', 'application/json');
  }
  return headers;
}
export async function handleResponse(response, errorMessage) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${errorMessage}: ${response.status} - ${text}`);
  }
  return response.json();
}
export async function apiRequest(endpoint, { token, method = 'GET', body, ...options } = {}, errorMessage) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = createAuthHeaders(token, method !== 'DELETE' && body !== undefined);
  const config = {
    method,
    headers,
    ...options,
  };
  if (body !== undefined) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  const response = await fetch(url, config);
  return handleResponse(response, errorMessage);
}
export { API_BASE_URL };