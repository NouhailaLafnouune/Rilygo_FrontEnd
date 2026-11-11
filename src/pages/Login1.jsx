import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import logo from "../assets/logo.png";
export default function Login1() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
   if (email === "admin@gmail.com" && password === "admin") {
  localStorage.setItem('token', 'admin-token') 
  navigate("/dashboard")
} else {
        throw new Error("Email ou mot de passe incorrect");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-[#F8F9FA]">
      <div className="md:w-1/2 w-full bg-[#111111] flex flex-col justify-between p-8 sm:p-12 md:p-16 lg:p-20 text-white order-1">
        <div className="flex flex-col items-center justify-center flex-grow py-6 md:py-0">
          <div className="w-full max-w-[260px] sm:max-w-sm md:max-w-md mb-10">
            <img src={logo} alt="RilyGo Illustration" className="w-full h-auto object-contain" />
          </div>
          <div className="text-left w-full max-w-md">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bienvenue sur <span className="text-gray-400">RilyGo</span>
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
      <div className="md:w-1/2 w-full flex flex-col justify-center items-center p-8 sm:p-12 md:p-20 lg:p-32 bg-white md:bg-[#F8F9FA] order-2">
        <div className="w-full max-w-sm">
          <header className="mb-10">
            <h2 className="text-4xl font-bold mb-2 text-gray-900">Connexion</h2>
            <p className="text-gray-500">Accédez à votre espace de gestion</p>
          </header>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full bg-[#E9ECEF] border-none rounded-lg pl-10 pr-4 py-3.5 text-gray-700 focus:ring-2 focus:ring-gray-300 outline-none transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin"
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6C757D] text-white py-3.5 rounded-lg font-bold hover:bg-[#5a6268] transition-all mt-4 disabled:opacity-50"
            >
              {loading ? "Connexion en cours..." : "Se Connecter"}
            </button>
          </form>
          <div className="mt-12 text-center md:hidden">
             <p className="text-xs text-gray-500">© 2026 RilyGo. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
