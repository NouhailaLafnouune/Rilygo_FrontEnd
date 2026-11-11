import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useTranslation } from 'react-i18next';
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Profil() {
  const { currentUser, role } = useAuth();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: '',
  });

useEffect(() => {
    if (currentUser) {
      const initialData = {
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: currentUser.phoneNumber || '',
        address: '',
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(initialData);
    }
  }, [currentUser]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Appeler une API pour mettre à jour le profil
    console.log('Mise à jour du profil :', formData);
    setIsEditing(false);
  };

  const userInitial = formData.displayName?.charAt(0).toUpperCase() || 'U';
  const roleLabel = role === 'GARAGE' ? t('sidebar.espaceGarage') : t('sidebar.espaceEmploye');

  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10 flex items-center gap-6">
            <div
              className="flex items-center justify-center rounded-full text-white text-3xl font-bold border-4 border-white shadow-lg"
              style={{
                width: 100,
                height: 100,
                background: role === 'GARAGE'
                  ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                  : 'linear-gradient(135deg, #10b981, #059669)',
              }}
            >
              {userInitial}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{formData.displayName || 'Utilisateur'}</h1>
              <p className="text-blue-100 text-lg">{roleLabel}</p>
              <p className="text-blue-200">{formData.email}</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-6 right-6 px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium shadow-lg"
            >
              Modifier
            </button>
          )}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Info Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <UserCircleIcon className="h-5 w-5 text-blue-600" />
              Informations personnelles
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <UserCircleIcon className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Nom complet</p>
                  <p className="font-medium text-slate-900">{formData.displayName || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium text-slate-900">{formData.email || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <PhoneIcon className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Téléphone</p>
                  <p className="font-medium text-slate-900">{formData.phone || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <MapPinIcon className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Adresse</p>
                  <p className="font-medium text-slate-900">{formData.address || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Modifier le profil</h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Entrez votre nom complet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                    placeholder="Email (non modifiable)"
                  />
                  <p className="text-xs text-slate-400 mt-1">L'email ne peut pas être modifié</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+212 6XX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Votre adresse"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12">
                <UserCircleIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Prêt à modifier ?</h3>
                <p className="text-slate-500 mb-6">Cliquez sur le bouton "Modifier" en haut pour mettre à jour vos informations.</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg"
                >
                  Modifier le profil
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}