import { apiRequest } from '../utils/apiUtils.js';

// --- Utility Functions ---

export function hasRequiredRole(userRole, requiredRoles) {
  if (!userRole || !requiredRoles) return false;
  return requiredRoles.includes(userRole.toUpperCase());
}

export function validateAccess(userRole, requiredRoles, operationName) {
  if (!hasRequiredRole(userRole, requiredRoles)) {
    throw new Error(`Access denied: ${operationName} requires one of these roles: ${requiredRoles.join(', ')}. Your role: ${userRole}`);
  }
}

// --- Public Routes ---

/**
 * Récupère la liste des services proposés par un garage spécifique
 * @param {string} garageId - UUID du garage
 * @param {string} [token] - Token optionnel (publique)
 * @returns {Promise<ServiceAutoDto[]>}
 */
export async function getServicesByGarage(garageId, token = null) {
  return apiRequest(`/services/garage/${garageId}`, {
    token,
    method: 'GET',
  }, 'Get services by garage failed');
}

/**
 * Récupère les services d'un garage filtrés par catégorie
 * @param {string} garageId - UUID du garage
 * @param {string} categoryId - UUID de la catégorie
 * @param {string} [token] - Token optionnel (publique)
 * @returns {Promise<ServiceAutoDto[]>}
 */
export async function getServicesByGarageAndCategory(garageId, categoryId, token = null) {
  return apiRequest(`/services/garage/${garageId}/category/${categoryId}`, {
    token,
    method: 'GET',
  }, 'Get services by garage and category failed');
}

/**
 * Récupère la liste des services mobiles disponibles
 * URL: GET http://localhost:8080/api/services/mobile
 * @param {string} [token] - Token optionnel (publique)
 * @returns {Promise<ServiceAutoDto[]>}
 */
export async function getMobileServices(token = null) {
  return apiRequest('/services/mobile', {
    token,
    method: 'GET',
  }, 'Get mobile services failed');
}

/**
 * Recherche des services par mot-clé
 * @param {string} query - Terme de recherche
 * @param {string} [token] - Token optionnel (publique)
 * @returns {Promise<ServiceAutoDto[]>}
 */
export async function searchServices(query, token = null) {
  return apiRequest(`/services/search?q=${encodeURIComponent(query)}`, {
    token,
    method: 'GET',
  }, 'Search services failed');
}

/**
 * Récupère les informations d'un service spécifique
 * @param {string} id - UUID du service
 * @param {string} [token] - Token optionnel (publique)
 * @returns {Promise<ServiceAutoDto>}
 */
export async function getServiceById(id, token = null) {
  return apiRequest(`/services/${id}`, {
    token,
    method: 'GET',
  }, 'Get service by ID failed');
}

// --- Garage Routes ---

/**
 * Crée un nouveau service pour le garage
 * @requires GARAGE role
 * @param {Object} serviceData - Données du service
 * @param {string} serviceData.name - Nom du service
 * @param {string} serviceData.description - Description
 * @param {number} serviceData.price - Prix
 * @param {string} [serviceData.categoryId] - ID de la catégorie
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @returns {Promise<ServiceAutoDto>}
 */
export async function createService(serviceData, token, userRole) {
  validateAccess(userRole, ['GARAGE'], 'Create service');
  return apiRequest('/services', {
    token,
    method: 'POST',
    body: serviceData,
  }, 'Create service failed');
}

/**
 * Met à jour les informations d'un service
 * @requires GARAGE role
 * @param {string} id - UUID du service
 * @param {Object} serviceData - Données à mettre à jour
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @returns {Promise<ServiceAutoDto>}
 */
export async function updateService(id, serviceData, token, userRole) {
  validateAccess(userRole, ['GARAGE'], 'Update service');
  return apiRequest(`/services/${id}`, {
    token,
    method: 'PUT',
    body: serviceData,
  }, 'Update service failed');
}

/**
 * Supprime un service du garage
 * @requires GARAGE role
 * @param {string} id - UUID du service
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @returns {Promise<void>}
 */
export async function deleteService(id, token, userRole) {
  validateAccess(userRole, ['GARAGE'], 'Delete service');
  return apiRequest(`/services/${id}`, {
    token,
    method: 'DELETE',
  }, 'Delete service failed');
}

// --- Admin Routes ---

/**
 * Récupère tous les services de la plateforme (paginé)
 * @requires ADMIN role
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @param {Object} [pageable] - Paramètres de pagination
 * @param {number} [pageable.page] - Numéro de page
 * @param {number} [pageable.size] - Taille de la page
 * @param {string} [pageable.sort] - Critère de tri
 * @returns {Promise<Page<ServiceAutoDto>>}
 */
export async function getAllServices(token, userRole, pageable = {}) {
  validateAccess(userRole, ['ADMIN'], 'List all services');
  const queryParams = new URLSearchParams();
  if (pageable.page) queryParams.append('page', pageable.page);
  if (pageable.size) queryParams.append('size', pageable.size);
  if (pageable.sort) queryParams.append('sort', pageable.sort);
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/services/admin?${queryString}` : '/services/admin';
  return apiRequest(endpoint, {
    token,
    method: 'GET',
  }, 'Get all services failed');
}

/**
 * Récupère tous les services d'un garage (admin)
 * @requires ADMIN role
 * @param {string} garageId - UUID du garage
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @returns {Promise<ServiceAutoDto[]>}
 */
export async function getAllServicesByGarage(garageId, token, userRole) {
  validateAccess(userRole, ['ADMIN'], 'Get all services by garage');
  return apiRequest(`/services/admin/garage/${garageId}`, {
    token,
    method: 'GET',
  }, 'Get all services by garage failed');
}

/**
 * Récupère tous les services filtrés par statut actif
 * @requires ADMIN role
 * @param {boolean} isActive - Statut actif/inactif
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @param {Object} [pageable] - Paramètres de pagination
 * @returns {Promise<Page<ServiceAutoDto>>}
 */
export async function getServicesByActiveStatus(isActive, token, userRole, pageable = {}) {
  validateAccess(userRole, ['ADMIN'], 'Get services by active status');
  const queryParams = new URLSearchParams();
  if (pageable.page) queryParams.append('page', pageable.page);
  if (pageable.size) queryParams.append('size', pageable.size);
  if (pageable.sort) queryParams.append('sort', pageable.sort);
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/services/admin/active/${isActive}?${queryString}` : `/services/admin/active/${isActive}`;
  return apiRequest(endpoint, {
    token,
    method: 'GET',
  }, 'Get services by active status failed');
}

/**
 * Bascule l'état actif d'un service
 * @requires ADMIN role
 * @param {string} id - UUID du service
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @returns {Promise<ServiceAutoDto>}
 */
export async function toggleServiceActive(id, token, userRole) {
  validateAccess(userRole, ['ADMIN'], 'Toggle service active status');
  return apiRequest(`/services/admin/${id}/toggle-active`, {
    token,
    method: 'PATCH',
  }, 'Toggle service active status failed');
}
