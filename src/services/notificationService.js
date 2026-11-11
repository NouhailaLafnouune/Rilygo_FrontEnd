import { apiRequest } from '../utils/apiUtils.js';
const NOTIFICATION_API_BASE_URL = '/notifications';
export const getMyNotifications = async (token, page = 0, size = 20) => {
    return apiRequest(`${NOTIFICATION_API_BASE_URL}?page=${page}&size=${size}`, {
        token,
        method: 'GET',
    }, 'Failed to fetch notifications');
};
export const getUnreadNotifications = async (token, page = 0, size = 20) => {
    return apiRequest(`${NOTIFICATION_API_BASE_URL}/unread?page=${page}&size=${size}`, {
        token,
        method: 'GET',
    }, 'Failed to fetch unread notifications');
};
export const countUnreadNotifications = async (token) => {
    return apiRequest(`${NOTIFICATION_API_BASE_URL}/unread/count`, {
        token,
        method: 'GET',
    }, 'Failed to count unread notifications');
};
export const markNotificationAsRead = async (token, id) => {
    return apiRequest(`${NOTIFICATION_API_BASE_URL}/${id}/read`, {
        token,
        method: 'PATCH',
    }, 'Failed to mark notification as read');
};
export const markAllNotificationsAsRead = async (token) => {
    return apiRequest(`${NOTIFICATION_API_BASE_URL}/read-all`, {
        token,
        method: 'PATCH',
    }, 'Failed to mark all notifications as read');
};
export const deleteReadNotifications = async (token) => {
    return apiRequest(`${NOTIFICATION_API_BASE_URL}/read`, {
        token,
        method: 'DELETE',
    }, 'Failed to delete read notifications');
};