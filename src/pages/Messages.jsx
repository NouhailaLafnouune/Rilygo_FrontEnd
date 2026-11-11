import React, { useState, useEffect } from 'react';

import { useAuth } from '../hooks/useAuth.js';
import {
  sendMessage,
  getMessagesForReservation,
  markAsRead,
} from '../services/messageService.js';
import {
  getMyReservations,
  getGarageReservations,
} from '../services/reservationService.js';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function Messages() {
  const { currentUser, role } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);




  const fetchMessages = async () => {
    if (!selectedReservation || !currentUser) return;
    try {
      const token = await currentUser.getIdToken();
      const data = await getMessagesForReservation(selectedReservation.id, token, role);
      setMessages(Array.isArray(data) ? data : []);
      await markAsRead(selectedReservation.id, token, role);
    } catch (err) {
      console.error(err.message);
    }
  };


useEffect(() => {
  if (!currentUser || !role) return;

  const loadReservations = async () => {
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      let data = [];
      if (role === 'CLIENT') data = await getMyReservations(token, role);
      else if (role === 'GARAGE') data = await getGarageReservations(token, role);

      const list = Array.isArray(data) ? data : data?.content || [];
      setReservations(list);

      // Sélectionner la première réservation, mais NE PAS charger les messages ici
      if (list.length > 0) setSelectedReservation(list[0]);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadReservations();
}, [currentUser, role]);


useEffect(() => {
  if (!selectedReservation) return;

  fetchMessages();
}, [selectedReservation, currentUser, role]);


  // Envoyer un message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedReservation) return;

    try {
      setSendingMessage(true);
      const token = await currentUser.getIdToken();
      const messageData = {
        reservationId: selectedReservation.id,
        content: newMessage,
      };

      await sendMessage(messageData, token, role);
      setNewMessage('');

      // Recharger les messages
      await fetchMessages();
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err.message);
      alert('Erreur: ' + err.message);
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar des réservations */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-orange-500" />
            Messages
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {reservations.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center px-4">
              <div>
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Aucune réservation</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {reservations.map((res) => (
                <button
                  key={res.id}
                  onClick={() => setSelectedReservation(res)}
                  className={`w-full text-left px-4 py-4 transition-all ${
                    selectedReservation?.id === res.id
                      ? 'bg-orange-50 border-l-4 border-orange-500'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <p className="font-semibold text-slate-900 text-sm">
                    {role === 'CLIENT'
                      ? res.garage?.name || 'Garage'
                      : res.client?.firstName + ' ' + res.client?.lastName || 'Client'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(res.reservationDate).toLocaleDateString('fr-FR')}
                  </p>
                  <p className={`text-xs mt-2 px-2 py-1 rounded w-fit ${
                    res.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : res.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {res.status}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Zone des messages */}
      <div className="flex-1 flex flex-col">
        {selectedReservation ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900">
                {role === 'CLIENT'
                  ? selectedReservation.garage?.name || 'Garage'
                  : selectedReservation.client?.firstName +
                    ' ' +
                    selectedReservation.client?.lastName ||
                    'Client'}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Réservation: {new Date(selectedReservation.reservationDate).toLocaleDateString('fr-FR')}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <SparklesIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Aucun message pour cette réservation</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.senderId === currentUser?.uid
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-200 text-slate-900'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.senderId === currentUser?.uid
                            ? 'text-orange-100'
                            : 'text-slate-500'
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="bg-white border-t border-slate-200 p-6">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !newMessage.trim()}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-slate-300 transition-colors flex items-center gap-2"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                  {sendingMessage ? 'Envoi...' : 'Envoyer'}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Sélectionnez une réservation pour commencer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
