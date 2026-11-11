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

// --- Employee Routes (Self) ---

/**
 * Synchronise le profil de l'employé connecté
 * @requires EMPLOYEE role
 * @param {string} token - Token d'authentification
 * @returns {Promise<EmployeeDto>}
 */
export async function syncEmployee(token) {
  return apiRequest('/employees/sync', {
    token,
    method: 'GET',
  }, 'Sync employee failed');
}

/**
 * Récupère les informations de l'employé connecté
 * @requires EMPLOYEE role
 * @param {string} token - Token d'authentification
 * @returns {Promise<EmployeeDto>}
 */
export async function getCurrentEmployee(token) {
  return apiRequest('/employees/me', {
    token,
    method: 'GET',
  }, 'Get current employee failed');
}

/**
 * Met à jour la localisation de l'employé connecté
 * @requires EMPLOYEE role
 * @param {Object} locationData - Data de localisation contenant latitude et longitude
 * @param {number} locationData.latitude
 * @param {number} locationData.longitude
 * @param {string} [locationData.address]
 * @param {string} token - Token d'authentification
 * @returns {Promise<EmployeeDto>}
 */
export async function updateLocation(locationData, token) {
  return apiRequest('/employees/me/location', {
    token,
    method: 'PATCH',
    body: locationData,
  }, 'Update location failed');
}

/**
 * Met à jour le statut de disponibilité de l'employé connecté
 * @requires EMPLOYEE role
 * @param {string} status - Statut de disponibilité (AVAILABLE, BUSY, OFFLINE)
 * @param {string} token - Token d'authentification
 * @returns {Promise<EmployeeDto>}
 */
export async function updateAvailability(status, token) {
  const params = new URLSearchParams({ status });
  return apiRequest(`/employees/me/availability?${params.toString()}`, {
    token,
    method: 'PATCH',
  }, 'Update availability failed');
}

// --- Garage Routes ---

/**
 * Récupère les employés du garage
 * @requires GARAGE role
 * @param {string} garageId - UUID du garage
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @returns {Promise<EmployeeDto[]>}
 */
export async function getGarageEmployees(garageId, token, userRole) {
  validateAccess(userRole, ['GARAGE', 'ADMIN'], 'Get garage employees');
  return apiRequest(`/employees/garage/${garageId}`, {
    token,
    method: 'GET',
  }, 'Get garage employees failed');
}

/**
 * Crée un nouvel employé pour le garage
 * @requires GARAGE role
 * @param {Object} employeeData
 * @param {string} employeeData.firstName
 * @param {string} employeeData.lastName
 * @param {string} employeeData.email
 * @param {string} employeeData.phone
 * @param {string} [employeeData.specialization]
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @returns {Promise<EmployeeDto>}
 */
/**
 * Crée un nouvel employé pour le garage
 * @requires GARAGE role
 * @param {Object} employeeData
 * @param {string} employeeData.firstName
 * @param {string} employeeData.lastName
 * @param {string} employeeData.email
 * @param {string} employeeData.phone
 * @param {string} [employeeData.specialization]
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @returns {Promise<EmployeeDto>}
 */
export async function createEmployee(employeeData, token, userRole) {
  validateAccess(userRole, ['GARAGE', 'ADMIN'], 'Create employee');
  return apiRequest('/employees', {
    token,
    method: 'POST',
    body: employeeData,
  }, 'Create employee failed');
}

/**
 * Récupère la liste des employés du garage
 * @requires GARAGE role
 * @param {string} garageId - UUID du garage
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @returns {Promise<EmployeeDto[]>}
 */
export async function getMyEmployees(garageId, token) {
  return apiRequest(`/employees/garage/${garageId}`, {
    token,
    method: 'GET',
  }, 'Get employees by garage failed');
}

/**
 * Récupère la liste des employés disponibles du garage
 * @requires GARAGE or ADMIN role
 * @param {string} garageId - UUID du garage
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @returns {Promise<EmployeeDto[]>}
 */
export async function getAvailableEmployees(garageId, token) {
  return apiRequest(`/employees/garage/${garageId}/available`, {
    token,
    method: 'GET',
  }, 'Get available employees by garage failed');
}

/**
 * Met à jour les informations d'un employé
 * @requires GARAGE or ADMIN role
 * @param {string} employeeId - UUID de l'employé
 * @param {Object} employeeData
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @returns {Promise<EmployeeDto>}
 */
export async function updateEmployee(employeeId, employeeData, token) {
  return apiRequest(`/employees/${employeeId}`, {
    token,
    method: 'PUT',
    body: employeeData,
  }, 'Update employee failed');
}

/**
 * Désactive le compte d'un employé
 * @requires GARAGE or ADMIN role
 * @param {string} employeeId - UUID de l'employé
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @returns {Promise<void>}
 */
export async function deactivateEmployee(employeeId, token) {
  return apiRequest(`/employees/${employeeId}/deactivate`, {
    token,
    method: 'PATCH',
  }, 'Deactivate employee failed');
}

// --- Admin Routes ---

/**
 * Récupère les informations d'un employé spécifique
 * @requires ADMIN role
 * @param {string} employeeId - UUID de l'employé
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @returns {Promise<EmployeeDto>}
 */
export async function getEmployeeById(employeeId, token) {
  return apiRequest(`/employees/${employeeId}`, {
    token,
    method: 'GET',
  }, 'Get employee by ID failed');
}

/**
 * Supprime définitivement un employé
 * @requires ADMIN role
 * @param {string} employeeId - UUID de l'employé
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @returns {Promise<void>}
 */
export async function deleteEmployee(employeeId, token, userRole) {
  validateAccess(userRole, ['ADMIN'], 'Delete employee');
  return apiRequest(`/employees/${employeeId}`, {
    token,
    method: 'DELETE',
  }, 'Delete employee failed');
}

// --- Batch Operations ---

/**
 * Récupère tous les employés d'un garage avec leurs statuts de disponibilité
 * @requires GARAGE or ADMIN role
 * @param {string} garageId - UUID du garage
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @returns {Promise<EmployeeDto[]>}
 */
export async function getAllEmployeesWithStatus(garageId, token) {
  return apiRequest(`/employees/garage/${garageId}?withStatus=true`, {
    token,
    method: 'GET',
  }, 'Get all employees with status failed');
}

/**
 * Met à jour la disponibilité de plusieurs employés
 * @requires GARAGE or ADMIN role
 * @param {string} garageId
 * @param {Array<{id: string, status: string}>} updates
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle utilisateur
 * @returns {Promise<EmployeeDto[]>}
 */
export async function bulkUpdateAvailability(garageId, updates, token) {
  return apiRequest(`/employees/garage/${garageId}/availability/bulk`, {
    token,
    method: 'PATCH',
    body: updates,
  }, 'Bulk update availability failed');
}

