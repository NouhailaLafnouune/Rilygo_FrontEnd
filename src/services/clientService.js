import { apiRequest } from '../utils/apiUtils.js';
export function hasRequiredRole(userRole, requiredRoles) {
  if (!userRole || !requiredRoles) return false;
  return requiredRoles.includes(userRole.toUpperCase());
}
export function validateAccess(userRole, requiredRoles, operationName) {
  if (!hasRequiredRole(userRole, requiredRoles)) {
    throw new Error(`Access denied: ${operationName} requires one of these roles: ${requiredRoles.join(', ')}. Your role: ${userRole}`);
  }
}
export async function syncClient(dto) {
  return apiRequest('/clients/sync', {
    method: 'POST',
    body: dto,
  }, 'Sync client failed');
}
export async function getCurrentClient(token, userRole) {
  validateAccess(userRole, ['CLIENT'], 'Get current client');
  return apiRequest('/clients/me', {
    token,
    method: 'GET',
  }, 'Get current client failed');
}
export async function updateCurrentClient(dto, token, userRole) {
  validateAccess(userRole, ['CLIENT'], 'Update current client');
  return apiRequest('/clients/me', {
    token,
    method: 'PUT',
    body: dto,
  }, 'Update current client failed');
}
export async function addPaymentMethod(paymentMethod, token, userRole) {
  validateAccess(userRole, ['CLIENT'], 'Add payment method');
  return apiRequest(`/clients/me/payment-methods?paymentMethod=${encodeURIComponent(paymentMethod)}`, {
    token,
    method: 'POST',
  }, 'Add payment method failed');
}
export async function removePaymentMethod(paymentMethod, token, userRole) {
  validateAccess(userRole, ['CLIENT'], 'Remove payment method');
  return apiRequest(`/clients/me/payment-methods?paymentMethod=${encodeURIComponent(paymentMethod)}`, {
    token,
    method: 'DELETE',
  }, 'Remove payment method failed');
}
export async function getAllClients(token, userRole) {
  validateAccess(userRole, ['ADMIN'], 'List all clients');
  return apiRequest('/clients', {
    token,
    method: 'GET',
  }, 'Get all clients failed');
}
export async function getClientById(id, token, userRole) {
  validateAccess(userRole, ['ADMIN'], 'Get client by ID');
  return apiRequest(`/clients/${id}`, {
    token,
    method: 'GET',
  }, 'Get client by ID failed');
}
export async function updateClient(id, dto, token, userRole) {
  validateAccess(userRole, ['ADMIN'], 'Update client');
  return apiRequest(`/clients/${id}`, {
    token,
    method: 'PUT',
    body: dto,
  }, 'Update client failed');
}
export async function deactivateClient(id, token, userRole) {
  validateAccess(userRole, ['ADMIN'], 'Deactivate client');
  return apiRequest(`/clients/${id}/deactivate`, {
    token,
    method: 'PATCH',
  }, 'Deactivate client failed');
}
export async function deleteClient(id, token, userRole) {
  validateAccess(userRole, ['ADMIN'], 'Delete client');
  return apiRequest(`/clients/${id}`, {
    token,
    method: 'DELETE',
  }, 'Delete client failed');
}