import { apiRequest } from '../utils/apiUtils.js';

// --- Utility Functions ---

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

// --- Public Routes ---

/**
 * Récupère les avis d'un garage (public, paginé)
 * @param {UUID} garageId - ID du garage
 * @param {string} [token] - Token optionnel
 * @param {Object} [pageable] - Paramètres de pagination
 * @returns {Promise<Page<ReviewDto>>}
 */
export async function getReviewsByGarage(garageId, token = null, pageable = {}) {
  const queryParams = new URLSearchParams();
  if (pageable.page !== undefined) queryParams.append('page', pageable.page);
  if (pageable.size) queryParams.append('size', pageable.size);
  if (pageable.sort) queryParams.append('sort', pageable.sort);
  const queryString = queryParams.toString();
  
  const endpoint = queryString 
    ? `/reviews/garage/${garageId}?${queryString}` 
    : `/reviews/garage/${garageId}`;
  
  return apiRequest(endpoint, {
    token,
    method: 'GET',
  }, 'Get garage reviews failed');
}

/**
 * Récupère un avis par ID (public)
 * @param {UUID} reviewId - ID de l'avis
 * @param {string} [token] - Token optionnel
 * @returns {Promise<ReviewDto>}
 */
export async function getById(reviewId, token = null) {
  return apiRequest(`/reviews/${reviewId}`, {
    token,
    method: 'GET',
  }, 'Get review failed');
}

/**
 * Récupère un avis par ID (ancienne fonction - compatibilité)
 * @deprecated Utilisez getById à la place
 */
export async function getReviewById(reviewId) {
  return getById(reviewId);
}

// --- Client Routes ---

/**
 * Crée un nouvel avis
 * @requires CLIENT role
 * @param {Object} reviewData - Données de l'avis
 * @param {UUID} reviewData.garageId - ID du garage
 * @param {number} reviewData.rating - Note (1-5)
 * @param {string} reviewData.title - Titre de l'avis
 * @param {string} reviewData.comment - Texte de l'avis
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle de l'utilisateur
 * @returns {Promise<ReviewDto>}
 */
export async function createReview(reviewData, token, userRole) {
  validateAccess(userRole, ['CLIENT'], 'Create review');
  return apiRequest('/reviews', {
    token,
    method: 'POST',
    body: reviewData,
  }, 'Create review failed');
}

/**
 * Récupère mes avis (en tant que client)
 * @requires CLIENT role
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle de l'utilisateur
 * @returns {Promise<ReviewDto[]>}
 */
export async function getMyReviews(token, userRole) {
  validateAccess(userRole, ['CLIENT'], 'Get my reviews');
  return apiRequest('/reviews/my', {
    token,
    method: 'GET',
  }, 'Get my reviews failed');
}

// --- Admin Routes ---

/**
 * Supprime un avis
 * @requires ADMIN role
 * @param {UUID} reviewId - ID de l'avis
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle de l'utilisateur
 * @returns {Promise<void>}
 */
export async function deleteReview(reviewId, token, userRole) {
  validateAccess(userRole, ['ADMIN'], 'Delete review');
  return apiRequest(`/reviews/${reviewId}`, {
    token,
    method: 'DELETE',
  }, 'Delete review failed');
}
