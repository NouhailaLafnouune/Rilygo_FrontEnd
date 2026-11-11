import { apiRequest } from '../utils/apiUtils.js';
export async function syncUserWithBackend(token, data) {
  return apiRequest('/users/sync', {
    token,
    method: 'POST',
    body: data,
  }, 'Sync user failed');
}