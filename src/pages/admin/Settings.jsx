import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { BellIcon, LockClosedIcon, GlobeAltIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState({
    language: localStorage.getItem('language') || i18n.language || 'fr',
    notifications: true,
    emailNotifications: true,
    twoFactor: false,
    theme: localStorage.getItem('theme') || 'light',
  });
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    localStorage.setItem('language', settings.language);
    if (i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings.language, i18n]);

  // Apply theme globally
  React.useEffect(() => {
    const htmlElement = document.documentElement;
    
    if (settings.theme === 'dark') {
      htmlElement.classList.add('dark');
      htmlElement.style.colorScheme = 'dark';
    } else if (settings.theme === 'light') {
      htmlElement.classList.remove('dark');
      htmlElement.style.colorScheme = 'light';
    } else if (settings.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        htmlElement.classList.add('dark');
        htmlElement.style.colorScheme = 'dark';
      } else {
        htmlElement.classList.remove('dark');
        htmlElement.style.colorScheme = 'light';
      }
    }
    
    localStorage.setItem('theme', settings.theme);
  }, [settings.theme]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    if (settings.language !== i18n.language) {
      i18n.changeLanguage(settings.language);
    }
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
        <p className="mt-1 text-sm text-slate-500">
          Gérez vos préférences d'application et vos paramètres de compte
        </p>
      </div>

      {saved && (
        <div className="mb-6 rounded-lg bg-green-50 p-4 border border-green-200">
          <p className="text-sm text-green-700">✓ Paramètres enregistrés avec succès</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Langue et Région */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <GlobeAltIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">Langue et Région</h3>
              <p className="mt-1 text-sm text-slate-500">
                Sélectionnez votre langue préférée
              </p>
              <div className="mt-4">
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
              <BellIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
              <p className="mt-1 text-sm text-slate-500">
                Gérez vos préférences de notifications
              </p>
              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">
                    Activer les notifications dans l'application
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">
                    Recevoir des notifications par email
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sécurité */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <LockClosedIcon className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">Sécurité</h3>
              <p className="mt-1 text-sm text-slate-500">
                Paramètres de sécurité de votre compte
              </p>
              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.twoFactor}
                    onChange={(e) => handleSettingChange('twoFactor', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-2 focus:ring-red-500"
                  />
                  <span className="text-sm text-slate-700">
                    Activer l'authentification à deux facteurs
                  </span>
                </label>
                <button className="mt-4 px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
                  Changer le mot de passe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Apparence */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <EyeIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">Apparence</h3>
              <p className="mt-1 text-sm text-slate-500">
                Personnalisez l'apparence de l'application
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'light', label: 'Mode clair', icon: '☀️' },
                  { id: 'dark', label: 'Mode sombre', icon: '🌙' },
                  { id: 'auto', label: 'Automatique', icon: '⚙️' }
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleSettingChange('theme', theme.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      settings.theme === theme.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{theme.icon}</div>
                    <p className={`text-sm font-medium ${
                      settings.theme === theme.id 
                        ? 'text-purple-900' 
                        : 'text-slate-700'
                    }`}>
                      {theme.label}
                    </p>
                    {settings.theme === theme.id && (
                      <p className="text-xs text-purple-600 mt-1">✓ Actif</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bouton d'enregistrement */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enregistrer les paramètres
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
