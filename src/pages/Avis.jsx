import React, { useState, useEffect, useCallback } from 'react';
import { Star, Trash2, MessageSquare, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import {
  getReviewsByGarage,
  createReview,
  getMyReviews,
} from '../services/reviewService.js';
import { getCurrentGarage } from '../services/garageService.js';

export default function Avis() {
  const { currentUser, role } = useAuth();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    garageId: '',
    rating: 5,
    title: '',
    comment: '',
  });

  // On définit les rôles en normalisant les préfixes ROLE_
  const normalizedRole = role ? role.toString().toUpperCase().replace(/^ROLE_/, '') : null;
  const isClient = normalizedRole === 'CLIENT';
  const isGarage = normalizedRole === 'GARAGE';

  // 1. On stabilise la fonction avec useCallback
  const fetchReviews = useCallback(async () => {
    if (!currentUser) {
      console.debug('Avis: utilisateur non connecté, pas de call API');
      setError('Utilisateur non connecté');
      setLoading(false);
      return;
    }
    if (!normalizedRole) {
      console.warn('Avis: rôle non défini, call API ignoré');
      setError('Rôle non défini');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = await currentUser.getIdToken();
      console.log('🔐 Token obtenu, Rôle:', normalizedRole);
      let response;

      if (isClient) {
        console.debug('📋 Appel getMyReviews (CLIENT)');
        response = await getMyReviews(token, role);
        console.log('✅ Réponse getMyReviews:', response);
      } else if (isGarage) {
        console.debug('🏪 Appel getCurrentGarage puis getReviewsByGarage (GARAGE)');
        const garage = await getCurrentGarage(token, role);
        const garageId = garage?.id || garage?.garageId;
        console.log('🏪 Garage trouvé:', garageId);
        if (!garageId) throw new Error('Garage ID not found');
        response = await getReviewsByGarage(garageId, token);
        console.log('✅ Réponse getReviewsByGarage:', response);
      } else {
        console.warn(`⚠️ Rôle non autorisé: ${role}`);
        setError(`Rôle non autorisé: ${role}. Seuls CLIENT et GARAGE peuvent consulter les avis.`);
        response = [];
      }

      // Gestion des réponses paginées (Page) vs liste simple (List)
      let data;
      if (response?.content !== undefined) {
        // Réponse paginée (getReviewsByGarage retourne Page<ReviewDto>)
        console.log('📄 Réponse paginée, extraction de .content');
        data = response.content;
      } else if (Array.isArray(response)) {
        // Liste simple (getMyReviews retourne List<ReviewDto>)
        console.log('📋 Réponse en liste');
        data = response;
      } else {
        console.warn('⚠️ Structure de réponse inconnue:', response);
        data = [];
      }
      
      console.log(`✨ ${data.length} avis chargés`);
      setReviews(data);
      
    } catch (err) {
      console.error('❌ Erreur chargement avis:', err);
      setError(err.message || 'Erreur lors du chargement des avis');
      setReviews([]);
    } finally {
      setLoading(false);
    }
    // On ne met que currentUser et role ici, pas les booléens calculés
  }, [currentUser, role, normalizedRole, isClient, isGarage]);

  // 2. Le useEffect écoute maintenant la fonction stabilisée
  useEffect(() => {
    if (currentUser && role) {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [fetchReviews, currentUser, role]); // La taille de ce tableau reste constante maintenant

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser || normalizedRole !== 'CLIENT') return;

    try {
      const token = await currentUser.getIdToken();
      await createReview(formData, token, role);
      setFormData({ garageId: '', rating: 5, title: '', comment: '' });
      setShowForm(false);
      fetchReviews();
      alert('Avis publié !');
    } catch (err) {
      alert('Erreur : ' + err.message);
    }
  };

  const renderStars = (rating) => (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              {isClient && "Avis clients"}
              {isGarage && "Avis du garage"}
            </h1>
          </div>
          {isClient && (
            <button onClick={() => setShowForm(!showForm)} className="bg-[#F57C23] text-white px-6 py-3 rounded-2xl font-bold">
              Donner mon avis
            </button>
          )}
        </div>

        {isClient && showForm && (
          <div className="bg-white p-8 rounded-[28px] shadow-sm mb-8">
            <form onSubmit={handleSubmitReview} className="space-y-6">
               <input type="text" name="garageId" placeholder="ID du Garage" onChange={handleInputChange} className="w-full p-3 border rounded-xl" />
               {/* ... reste du formulaire ... */}
               <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-xl">Publier</button>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-center py-20 text-slate-400 font-medium">⏳ Chargement des avis...</p>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-[28px] p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900">Erreur</h3>
                <p className="text-red-700 text-sm">{error}</p>
                <p className="text-red-600 text-xs mt-2">
                  👤 Rôle: <span className="font-mono">{normalizedRole}</span>
                  {isGarage && ' (GARAGE)'}
                  {isClient && ' (CLIENT)'}
                </p>
              </div>
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 font-medium text-lg">Aucun avis trouvé</p>
            <p className="text-slate-300 text-sm mt-2">
              {isClient && "Vous n'avez pas encore laissé d'avis"}
              {isGarage && "Votre garage n'a pas encore d'avis"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-white p-8 rounded-[28px] shadow-sm">
                <div className="flex justify-between mb-4">
                  <h3 className="font-bold text-lg">{review.title}</h3>
                  {renderStars(review.rating)}
                </div>
                <p className="text-slate-600">"{review.comment}"</p>
                <p className="mt-4 text-sm text-slate-400">Par {review.clientName || 'Utilisateur'}</p>
              </div>
            ))}
          </div>
        )}

        {/* Debug Panel */}
        <div className="mt-12 p-6 bg-slate-100 rounded-[28px] border border-slate-200 text-xs font-mono text-slate-600">
          <details className="cursor-pointer">
            <summary className="font-bold text-slate-700 mb-3">🔍 Debug Info</summary>
            <div className="space-y-2 mt-3">
              <p>👤 <strong>User ID:</strong> {currentUser?.uid?.substring(0, 10) || 'N/A'}...</p>
              <p>🔐 <strong>Role (raw):</strong> {role || 'undefined'}</p>
              <p>🔐 <strong>Role (normalized):</strong> {normalizedRole || 'undefined'}</p>
              <p>🎯 <strong>isClient:</strong> {isClient ? '✓' : '✗'} | <strong>isGarage:</strong> {isGarage ? '✓' : '✗'}</p>
              <p>📊 <strong>Reviews loaded:</strong> {reviews.length}</p>
              <p>⏳ <strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
              <p>❌ <strong>Error:</strong> {error || 'none'}</p>
              <button 
                onClick={() => fetchReviews()}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded text-xs"
              >
                🔄 Refresh
              </button>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}