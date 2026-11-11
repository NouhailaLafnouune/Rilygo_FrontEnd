import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo.png';
export default function VerifyEmail() {
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { currentUser, sendVerificationEmail, logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.emailVerified) {
      navigate('/dashboard');
    }
    const interval = setInterval(async () => {
      await currentUser.reload();
      if (currentUser.emailVerified) {
        navigate('/dashboard');
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentUser, navigate]);
  async function handleResendEmail() {
    try {
      setError('');
      setResending(true);
      await sendVerificationEmail();
      setMessage('Email de vérification renvoyé avec succès !');
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Échec de l'envoi";
      if (msg.includes('too-many-requests')) {
        setError('Trop de tentatives. Veuillez patienter quelques minutes');
      } else {
        setError("Échec de l'envoi de l'email. Veuillez réessayer");
      }
    } finally {
      setResending(false);
    }
  }
  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      setError('Échec de la déconnexion');
    }
  }
  if (!currentUser) return null;
  return (
      <div className="flex flex-col md:flex-row min-h-screen w-full bg-[#F8F9FA]">
        <div className="md:w-1/2 w-full bg-[#111111] flex flex-col justify-between p-8 sm:p-12 md:p-16 lg:p-20 text-white order-1">
          <div className="flex flex-col items-center justify-center flex-grow py-6 md:py-0">
            <div className="w-full max-w-[260px] sm:max-w-sm md:max-w-md mb-10">
              <img src={logo} alt="Logo Illustration" className="w-full h-auto object-contain" />
            </div>
            <div className="text-left w-full max-w-md">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Presque là avec{' '}
                <span className="text-gray-400">RilyGo</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xs">
                Vérifiez votre adresse email pour activer votre compte et accéder à votre espace de gestion.
              </p>
            </div>
          </div>
          <div className="hidden md:block text-xs text-gray-600 mt-10">
            © 2026 RilyGo. Tous droits réservés.
          </div>
        </div>
        <div className="md:w-1/2 w-full flex flex-col justify-center items-center p-8 sm:p-12 md:p-20 lg:p-32 bg-white md:bg-[#F8F9FA] order-2">
          <div className="w-full max-w-sm">
            <header className="mb-10">
              <h2 className="text-4xl font-bold mb-2 text-gray-900">Vérifiez votre email</h2>
              <p className="text-gray-500">
                Un email de vérification a été envoyé à
              </p>
              <p className="text-gray-800 font-bold mt-1 truncate">{currentUser.email}</p>
            </header>
            {message && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
                  {message}
                </div>
            )}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                  {error}
                </div>
            )}
            <div className="bg-[#E9ECEF] rounded-lg px-4 py-3 mb-8">
              <div className="flex items-start gap-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 leading-relaxed">
                  Cliquez sur le lien dans l'email pour vérifier votre compte. Vous serez automatiquement redirigé une fois votre email vérifié.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <button
                  onClick={handleResendEmail}
                  disabled={resending}
                  className="w-full bg-[#6C757D] text-white py-3.5 rounded-lg font-bold hover:bg-[#5a6268] transition-all disabled:opacity-50"
              >
                {resending ? 'Envoi en cours...' : "Renvoyer l'email"}
              </button>
              <button
                  onClick={handleLogout}
                  className="w-full bg-[#E9ECEF] text-gray-700 py-3.5 rounded-lg font-bold hover:bg-[#dee2e6] transition-all"
              >
                Se déconnecter
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-6">
              N'oubliez pas de vérifier votre dossier spam
            </p>
            <div className="mt-10 text-center md:hidden">
              <p className="text-xs text-gray-500">© 2026 RilyGo. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </div>
  );
}
