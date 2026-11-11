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
export async function initiatePayment(paymentData, token, userRole) {
  validateAccess(userRole, ['CLIENT'], 'Initiate payment');
  return apiRequest('/payments', {
    token,
    method: 'POST',
    body: paymentData,
  }, 'Initiate payment failed');
}
export async function getPaymentByReservation(reservationId, token, userRole) {
  validateAccess(userRole, ['CLIENT', 'GARAGE', 'ADMIN'], 'Get payment by reservation');
  return apiRequest(`/payments/reservation/${reservationId}`, {
    token,
    method: 'GET',
  }, 'Get payment by reservation failed');
}
export async function getPaymentsByGarage(garageId, token, userRole) {
  validateAccess(userRole, ['GARAGE', 'ADMIN'], 'Get payments by garage');
  return apiRequest(`/payments/garage/${garageId}`, {
    token,
    method: 'GET',
  }, 'Get payments by garage failed');
}
export async function confirmPayment(id, providerTxId, token, userRole) {
  validateAccess(userRole, ['ADMIN'], 'Confirm payment');
  return apiRequest(`/payments/${id}/confirm?providerTxId=${providerTxId}`, {
    token,
    method: 'PATCH',
  }, 'Confirm payment failed');
}
export async function refundPayment(id, token, userRole) {
  validateAccess(userRole, ['ADMIN'], 'Refund payment');
  return apiRequest(`/payments/${id}/refund`, {
    token,
    method: 'PATCH',
  }, 'Refund payment failed');
}
export async function getPaymentsByStatus(status, token, userRole) {
  validateAccess(userRole, ['ADMIN'], 'Get payments by status');
  return apiRequest(`/payments/status/${status}`, {
    token,
    method: 'GET',
  }, 'Get payments by status failed');
}
// Ajoute ceci à ton fichier paymentService.js

export async function getAllPayments(token, userRole) {
  // On définit les statuts que l'on veut récupérer
  const statuses = ['PAID', 'PENDING', 'REFUNDED'];
  
  try {
    // On lance les appels en parallèle pour plus de rapidité
    const requests = statuses.map(status => 
      getPaymentsByStatus(status, token, userRole).catch(() => []) // On retourne un tableau vide en cas d'erreur sur un statut
    );
    
    const results = await Promise.all(requests);
    
    // On aplatit les résultats en un seul tableau
    return results.flat();
  } catch (error) {
    console.error("Erreur lors de la récupération globale des paiements:", error);
    throw new Error("Impossible de charger tous les paiements.");
  }
}