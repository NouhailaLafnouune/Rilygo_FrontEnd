import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import logo from '../assets/logo.png';
export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      return setError('Veuillez remplir tous les champs');
    }
    if (password !== confirmPassword) {
      return setError('Les mots de passe ne correspondent pas');
    }
    if (password.length < 6) {
      return setError('Le mot de passe doit contenir au moins 6 caractÃ¨res');
    }
    try {
      setError('');
      setLoading(true);
      await signup(email, password, name);
      setSuccess(true);
      setTimeout(() => navigate('/verify-email'), 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Échec de l'inscription";
      if (msg.includes('email-already-in-use')) {
        setError('Cet email est déjà utilisé');
      } else if (msg.includes('invalid-email')) {
        setError('Email invalide');
      } else if (msg.includes('weak-password')) {
        setError('Mot de passe trop faible');
      } else {
        setError("Échec de l'inscription. Veuillez réessayer");
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
                Rejoignez <span className="text-gray-400">RilyGo</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xs">
                La plateforme tout-en-un pour connecter clients, garages et mécaniciens mobiles au Maroc.
              </p>
            </div>
          </div>
          <div className="hidden md:block text-xs text-gray-600 mt-10">
            © 2026 RilyGo. Tous droits réservés.
          </div>
        </div>
        <div className="md:w-1/2 w-full flex flex-col justify-center items-center p-8 sm:p-12 md:p-16 lg:p-24 bg-white md:bg-[#F8F9FA] order-2">
          <div className="w-full max-w-sm">
            <header className="mb-8">
              <h2 className="text-4xl font-bold mb-2 text-gray-900">Inscription</h2>
              <p className="text-gray-500">Créez votre espace de gestion</p>
            </header>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                  {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
                  Inscription réussie ! Un email de vérification a été envoyé.
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">Nom complet</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jean Dupont"
                      className="w-full bg-[#E9ECEF] border-none rounded-lg pl-10 pr-4 py-3.5 text-gray-700 focus:ring-2 focus:ring-gray-300 outline-none transition-all"
                      required
                  />
                </div>
              </div>
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
              <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">Mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#E9ECEF] border-none rounded-lg pl-10 pr-12 py-3.5 text-gray-700 focus:ring-2 focus:ring-gray-300 outline-none transition-all"
                      required
                  />
                  <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">Confirmer le mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#E9ECEF] border-none rounded-lg pl-10 pr-12 py-3.5 text-gray-700 focus:ring-2 focus:ring-gray-300 outline-none transition-all"
                      required
                  />
                  <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full bg-[#6C757D] text-white py-3.5 rounded-lg font-bold hover:bg-[#5a6268] transition-all mt-2 disabled:opacity-50"
              >
                {loading ? 'Inscription en cours...' : "S'inscrire"}
              </button>
            </form>
            <div className="text-center mt-6">
              <p className="text-gray-500 text-sm">
                Déjà un compte ?{' '}
                <Link to="/login" className="text-gray-700 hover:text-gray-900 font-bold transition-colors">
                  Se connecter
                </Link>
              </p>
            </div>
            <div className="mt-10 text-center md:hidden">
              <p className="text-xs text-gray-500">© 2026 RilyGo. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </div>
  );
}
