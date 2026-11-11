import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo.png';
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return setError('Veuillez entrer votre email');
    try {
      setError('');
      setLoading(true);
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Échec de l'envoi";
      if (msg.includes('user-not-found')) {
        setError('Aucun compte trouvé avec cet email');
      } else if (msg.includes('invalid-email')) {
        setError('Email invalide');
      } else {
        setError("Échec de l'envoi de l'email. Veuillez réessayer");
      }
    } finally {
      setLoading(false);
    }
  }
  return (
      <div className="flex flex-col md:flex-row min-h-screen w-full bg-[#F8F9FA]">
        <div className="md:w-1/2 w-full bg-[#111111] flex flex-col justify-between p-8 sm:p-12 md:p-16 lg:p-20 text-white order-1">
          <div className="flex flex-col items-center justify-center flex-grow py-6 md:py-0">
            <div className="w-full max-w-[260px] sm:max-w-sm md:max-w-md mb-10">
              <img src={logo} alt="Logo Illustration" className="w-full h-auto object-contain" />
            </div>
            <div className="text-left w-full max-w-md">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Besoin d'aide ?{' '}
                <span className="text-gray-400">RilyGo</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xs">
                Réinitialisez votre mot de passe en quelques secondes et reprenez le contrôle de votre espace.
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
              <h2 className="text-4xl font-bold mb-2 text-gray-900">Mot de passe oublié</h2>
              <p className="text-gray-500">Entrez votre email pour recevoir un lien de réinitialisation</p>
            </header>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                  {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
                  <p className="font-bold mb-0.5">Email envoyé !</p>
                  <p>Vérifiez votre boîte mail pour réinitialiser votre mot de passe.</p>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full bg-[#E9ECEF] border-none rounded-lg pl-10 pr-4 py-3.5 text-gray-700 focus:ring-2 focus:ring-gray-300 outline-none transition-all"
                      required
                  />
                </div>
              </div>
              <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full bg-[#6C757D] text-white py-3.5 rounded-lg font-bold hover:bg-[#5a6268] transition-all disabled:opacity-50"
              >
                {loading ? 'Envoi en cours...' : "Envoyer le lien de réinitialisation"}
              </button>
            </form>
            <div className="mt-6 text-center space-y-3">
              <Link
                  to="/login"
                  className="block text-sm text-gray-700 hover:text-gray-900 font-bold transition-colors"
              >
                ← Retour à la connexion
              </Link>
              <p className="text-gray-500 text-sm">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-gray-700 hover:text-gray-900 font-bold transition-colors">
                  S'inscrire
                </Link>
              </p>
            </div>
            <div className="mt-12 text-center md:hidden">
              <p className="text-xs text-gray-500">© 2026 RilyGo. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </div>
  );
}
