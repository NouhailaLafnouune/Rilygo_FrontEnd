import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from 'react-i18next';
import { canAccessNotificationRoute } from "../../routes";
import {
  getMyNotifications,
  getUnreadNotifications,
  countUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteReadNotifications,
} from "../../services/notificationService.js";
import {
  BellIcon,
  EyeIcon,
  CheckIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
export default function Notifications() {
  const { currentUser, role } = useAuth();
  const { t } = useTranslation();
  const Pill = ({ isRead }) => {
    const config = isRead
      ? { bg: "bg-green-100", text: "text-green-800", label: t('notifications.read') }
      : { bg: "bg-blue-100", text: "text-blue-800", label: t('notifications.unread') };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const lastFetchTimeRef = useRef(0);
  const lastDepsRef = useRef("");
  const abortRef = useRef(null);
  const fetchNotifications = useCallback(async () => {
    if (!currentUser) return;
    const now = Date.now();
    const deps = JSON.stringify([showUnreadOnly, page, size]);
    if (now - lastFetchTimeRef.current < 150 && lastDepsRef.current === deps) {
      return;
    }
    lastFetchTimeRef.current = now;
    lastDepsRef.current = deps;
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      setLoading(true);
      setError(null);
      const token = await currentUser.getIdToken();
      const data = showUnreadOnly
        ? await getUnreadNotifications(token, page, size)
        : await getMyNotifications(token, page, size);
      if (!controller.signal.aborted) {
        setNotifications(data.content || []);
        setTotalPages(data.totalPages || 0);
        setLoading(false);
      }
    } catch (err) {
      if (!controller.signal.aborted) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [showUnreadOnly, page, size, currentUser?.uid]);
  const lastCountFetchRefTime = useRef(0);
  const lastCountFetchRefDeps = useRef("");
  const fetchUnreadCount = useCallback(async () => {
    if (!currentUser) return;
    const now = Date.now();
    const deps = "unread_count";
    if (now - lastCountFetchRefTime.current < 150 && lastCountFetchRefDeps.current === deps) {
      return;
    }
    lastCountFetchRefTime.current = now;
    lastCountFetchRefDeps.current = deps;
    try {
      const token = await currentUser.getIdToken();
      const count = await countUnreadNotifications(token);
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, [currentUser?.uid]);
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);
  const handleMarkAsRead = async (id) => {
    try {
      const token = await currentUser.getIdToken();
      await markNotificationAsRead(token, id);
      setNotifications(notifications.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      ));
      fetchUnreadCount();
    } catch (err) {
      setError(err.message);
    }
  };
  const handleMarkAllAsRead = async () => {
    try {
      const token = await currentUser.getIdToken();
      await markAllNotificationsAsRead(token);
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleDeleteRead = async () => {
    try {
      const token = await currentUser.getIdToken();
      await deleteReadNotifications(token);
      setNotifications(notifications.filter(notif => !notif.isRead));
      fetchUnreadCount();
    } catch (err) {
      setError(err.message);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }
  const hasAccess = role && canAccessNotificationRoute(role, 'all');
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col w-full">
        <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-200">
          <h2 className="text-lg font-semibold text-red-900">Accès Refusé</h2>
          <p className="mt-1 text-sm text-red-700">
            Vous n'avez pas la permission d'accéder à cette page.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BellIcon className="h-8 w-8 text-orange-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('notifications.title')}</h1>
            <p className="text-sm text-gray-600">
              {unreadCount > 0 ? t('notifications.unreadCount', { count: unreadCount }) : t('notifications.allRead')}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showUnreadOnly
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            {showUnreadOnly ? t('notifications.showAll') : t('notifications.showUnreadOnly')}
          </button>
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <CheckIcon className="h-4 w-4" />
            {t('notifications.markAllRead')}
          </button>
          <button
            onClick={handleDeleteRead}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <TrashIcon className="h-4 w-4" />
            {t('notifications.deleteRead')}
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('notifications.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('notifications.titleColumn')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('notifications.message')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('notifications.date')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('notifications.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  {t('notifications.noNotifications')}
                </td>
              </tr>
            ) : (
              notifications.map((notification) => (
                <tr key={notification.id} className={notification.isRead ? 'bg-gray-50' : 'bg-blue-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Pill isRead={notification.isRead} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {notification.title || 'Notification'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {notification.body}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(notification.createAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3 flex items-center gap-1"
                      >
                        <EyeIcon className="h-4 w-4" />
                        {t('notifications.markAsRead')}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('notifications.previous')}
          </button>
          <span className="text-sm text-gray-600">
            {t('notifications.pageOf', { current: page + 1, total: totalPages })}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('notifications.next')}
          </button>
        </div>
      )}
    </div>
  );
}
