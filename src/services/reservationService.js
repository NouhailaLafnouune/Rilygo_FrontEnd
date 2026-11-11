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
export async function createReservation(reservationData, token, userRole) {
  validateAccess(userRole, ['CLIENT'], 'Create reservation');
  return apiRequest('/reservations', {
    token,
    method: 'POST',
    body: reservationData,
  }, 'Create reservation failed');
}
export async function getMyReservations(token, userRole, pageable = {}) {
  validateAccess(userRole, ['CLIENT'], 'Get my reservations');
  const queryParams = new URLSearchParams();
  if (pageable.page) queryParams.append('page', pageable.page);
  if (pageable.size) queryParams.append('size', pageable.size);
  if (pageable.sort) queryParams.append('sort', pageable.sort);
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/reservations/my?${queryString}` : '/reservations/my';
  return apiRequest(endpoint, {
    token,
    method: 'GET',
  }, 'Get my reservations failed');
}
export async function cancelReservation(id, token, userRole) {
  validateAccess(userRole, ['CLIENT'], 'Cancel reservation');
  return apiRequest(`/reservations/${id}/cancel`, {
    token,
    method: 'PATCH',
  }, 'Cancel reservation failed');
}
export async function getGarageReservations(token, userRole, pageable = {}) {
  validateAccess(userRole, ['GARAGE'], 'Get garage reservations');
  
  const queryParams = new URLSearchParams();
  if (pageable.page) queryParams.append('page', pageable.page);
  if (pageable.size) queryParams.append('size', pageable.size);
  if (pageable.sort) queryParams.append('sort', pageable.sort);
  const queryString = queryParams.toString();
  
  const endpoint = queryString ? `/reservations/garage?${queryString}` : '/reservations/garage';
  
  return apiRequest(endpoint, {
    token,
    method: 'GET',
  }, 'Get garage reservations failed');
}

export async function getGarageReservationsByStatus(status, token, userRole) {
  validateAccess(userRole, ['GARAGE'], 'Get garage reservations by status');
  
  return apiRequest(`/reservations/garage/status/${status}`, {
    token,
    method: 'GET',
  }, 'Get garage reservations by status failed');
}
export async function updateReservationStatus(id, statusData, token, userRole) {
  validateAccess(userRole, ['GARAGE', 'ADMIN'], 'Update reservation status');
  return apiRequest(`/reservations/${id}/status`, {
    token,
    method: 'PATCH',
    body: statusData,
  }, 'Update reservation status failed');
}
export async function getReservationById(id, token, userRole) {
  validateAccess(userRole, ['CLIENT', 'GARAGE', 'ADMIN'], 'Get reservation by ID');
  return apiRequest(`/reservations/${id}`, {
    token,
    method: 'GET',
  }, 'Get reservation by ID failed');
}
export async function getAllReservations(token, userRole, pageable = {}) {
  validateAccess(userRole, ['ADMIN'], 'Get all reservations');
  const queryParams = new URLSearchParams();
  if (pageable.page) queryParams.append('page', pageable.page);
  if (pageable.size) queryParams.append('size', pageable.size);
  if (pageable.sort) queryParams.append('sort', pageable.sort);
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/reservations/admin?${queryString}` : '/reservations/admin';
  return apiRequest(endpoint, {
    token,
    method: 'GET',
  }, 'Get all reservations failed');
}

export async function getAllReservationsByStatus(status, token, userRole, pageable = {}) {
  validateAccess(userRole, ['ADMIN'], 'Get all reservations by status');
  const queryParams = new URLSearchParams();
  if (pageable.page) queryParams.append('page', pageable.page);
  if (pageable.size) queryParams.append('size', pageable.size);
  if (pageable.sort) queryParams.append('sort', pageable.sort);
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/reservations/admin/status/${status}?${queryString}` : `/reservations/admin/status/${status}`;
  return apiRequest(endpoint, {
    token,
    method: 'GET',
  }, 'Get all reservations by status failed');
}

