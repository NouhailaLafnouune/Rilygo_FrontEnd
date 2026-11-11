import { apiRequest } from '../utils/apiUtils.js';

/**
 * Envoie un message
 * @requires CLIENT ou GARAGE role
 * @param {Object} messageData - Données du message
 * @param {UUID} messageData.reservationId - ID de la réservation
 * @param {string} messageData.content - Contenu du message
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle de l'utilisateur
 * @returns {Promise<MessageDto>}
 */
export async function sendMessage(messageData, token, userRole) {
  validateAccess(userRole, ['CLIENT', 'GARAGE'], 'Send message');
  return apiRequest('/messages', {
    token,
    method: 'POST',
    body: messageData,
  }, 'Send message failed');
}

/**
 * Récupère les messages d'une réservation
 * @requires CLIENT ou GARAGE role
 * @param {UUID} reservationId - ID de la réservation
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle de l'utilisateur
 * @returns {Promise<MessageDto[]>}
 */
export async function getMessagesForReservation(reservationId, token, userRole) {
  validateAccess(userRole, ['CLIENT', 'GARAGE'], 'Get messages');
  return apiRequest(`/messages/reservation/${reservationId}`, {
    token,
    method: 'GET',
  }, 'Get messages failed');
}

/**
 * Marque les messages d'une réservation comme lus
 * @requires CLIENT ou GARAGE role
 * @param {UUID} reservationId - ID de la réservation
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle de l'utilisateur
 * @returns {Promise<number>} - Nombre de messages marqués comme lus
 */
export async function markAsRead(reservationId, token, userRole) {
  validateAccess(userRole, ['CLIENT', 'GARAGE'], 'Mark as read');
  return apiRequest(`/messages/reservation/${reservationId}/read`, {
    token,
    method: 'PATCH',
  }, 'Mark as read failed');
}

/**
 * Compte les messages non lus d'une réservation
 * @requires CLIENT ou GARAGE role
 * @param {UUID} reservationId - ID de la réservation
 * @param {string} token - Token d'authentification
 * @param {string} userRole - Rôle de l'utilisateur
 * @returns {Promise<number>} - Nombre de messages non lus
 */
export async function countUnreadMessages(reservationId, token, userRole) {
  validateAccess(userRole, ['CLIENT', 'GARAGE'], 'Count unread');
  return apiRequest(`/messages/reservation/${reservationId}/unread`, {
    token,
    method: 'GET',
  }, 'Count unread failed');
}

/**
 * Valide que l'utilisateur a les rôles requis
 */
function validateAccess(userRole, requiredRoles, operationName) {
  if (!userRole || !requiredRoles.includes(userRole.toUpperCase())) {
    throw new Error(
      `Access denied: ${operationName} requires one of these roles: ${requiredRoles.join(', ')}. Your role: ${userRole}`
    );
  }
}
