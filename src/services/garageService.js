import { apiRequest } from '../utils/apiUtils.js';
function normalizeRole(userRole) {
  if (!userRole) return null;
  return userRole.toString().toUpperCase().replace(/^ROLE_/, '');
}
export function hasRequiredRole(userRole, requiredRoles) {
  if (!userRole || !requiredRoles) return false;
  const normalizedRole = normalizeRole(userRole);
  const normalizedRequired = requiredRoles.map(r => r.toString().toUpperCase().replace(/^ROLE_/, ''));
  return normalizedRequired.includes(normalizedRole);
}
export function validateAccess(userRole, requiredRoles, operationName) {
  if (!hasRequiredRole(userRole, requiredRoles)) {
    throw new Error(`Access denied: ${operationName} requires one of these roles: ${requiredRoles.join(', ')}. Your role: ${userRole}`);
  }
}
export async function syncGarage(dto) {
  return apiRequest('/garages/sync', {
    method: 'POST',
    body: dto,
  }, 'Sync garage failed');
}
export async function getGaragesNearMe(lat, lng) {
  return apiRequest(`/garages/nearby?lat=${lat}&lng=${lng}`, {
    method: 'GET',
  }, 'Get garages near me failed');
}
export async function getGarageById(id) {
  return apiRequest(`/garages/${id}`, {
    method: 'GET',
  }, 'Get garage by ID failed');
}
export async function getCurrentGarage(token, userRole) {
  validateAccess(userRole, ['GARAGE'], 'Get current garage');
  return apiRequest('/garages/me', {
    token,
    method: 'GET',
  }, 'Get current garage failed');
}
export async function updateCurrentGarage(dto, token, userRole) {
  validateAccess(userRole, ['GARAGE'], 'Update current garage');
  return apiRequest('/garages/me', {
    token,
    method: 'PUT',
    body: dto,
  }, 'Update current garage failed');
}
export async function getAllGarages(token, userRole, status = null) {
  validateAccess(userRole, ['ADMIN'], 'List all garages');
  const endpoint = status ? `/garages?status=${status}` : '/garages';
  return apiRequest(endpoint, {
    token,
    method: 'GET',
  }, 'Get all garages failed');
}
export async function approveOrRejectGarage(id, dto, token, userRole) {
  validateAccess(userRole, ['ADMIN'], 'Approve or reject garage');
  return apiRequest(`/garages/${id}/status`, {
    token,
    method: 'PATCH',
    body: dto,
  }, 'Approve or reject garage failed');
}
export async function updateGarage(id, dto, token, userRole) {
  validateAccess(userRole, ['ADMIN'], 'Update garage');
  return apiRequest(`/garages/${id}`, {
    token,
    method: 'PUT',
    body: dto,
  }, 'Update garage failed');
}
export async function deactivateGarage(id, token, userRole) {
  validateAccess(userRole, ['ADMIN'], 'Deactivate garage');
  return apiRequest(`/garages/${id}/deactivate`, {
    token,
    method: 'PATCH',
  }, 'Deactivate garage failed');
}
export async function deleteGarage(id, token, userRole) {
  validateAccess(userRole, ['ADMIN'], 'Delete garage');
  return apiRequest(`/garages/${id}`, {
    token,
    method: 'DELETE',
  }, 'Delete garage failed');
}
export async function getGarageStats(token, userRole) {
  validateAccess(userRole, ['GARAGE'], 'Get garage stats');
  return apiRequest('/garages/me/stats', {
    token,
    method: 'GET',
  }, 'Get garage stats failed');
}
export async function getRevenueData(token, userRole) {
  validateAccess(userRole, ['GARAGE'], 'Get revenue data');
  return apiRequest('/garages/me/revenue', {
    token,
    method: 'GET',
  }, 'Get revenue data failed');
}
export async function getServicesData(token, userRole) {
  validateAccess(userRole, ['GARAGE'], 'Get services data');
  return apiRequest('/garages/me/services', {
    token,
    method: 'GET',
  }, 'Get services data failed');
}
export async function getUpcomingReservations(token, userRole) {
  validateAccess(userRole, ['GARAGE'], 'Get upcoming reservations');
  return apiRequest('/garages/me/reservations', {
    token,
    method: 'GET',
  }, 'Get upcoming reservations failed');
}
