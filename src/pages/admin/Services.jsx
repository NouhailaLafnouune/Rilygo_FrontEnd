import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getCurrentGarage } from "../../services/garageService.js";
import {
  getServicesByGarage,
  searchServices,
  createService,
  updateService,
  deleteService,
  getAllServices,
} from "../../services/serviceAutoService.js";
import { 
  PencilIcon, 
  TrashIcon, 
  WrenchScrewdriverIcon,
  MagnifyingGlassIcon as SearchIcon 
} from "@heroicons/react/24/outline";

const Pill = ({ status }) => (
  <span className={`inline-flex px-4 py-1 rounded-full text-[12px] font-bold border ${
      status 
        ? "bg-blue-50 text-blue-600 border-blue-100" 
        : "bg-slate-50 text-slate-400 border-slate-100"
    }`}>
    {status ? "Mobile" : "Sur place"}
  </span>
);

const formatCurrency = (v) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "MAD" }).format(v);

const formatDuration = (m) =>
  m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60 || ""}`;

const defaultForm = {
  name: "",
  description: "",
  price: "",
  durationMinutes: "",
  isMobile: false,
  garageId: "",
  categoryId: "",
};

export default function Services() {
  const { currentUser, role } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const fetchAbortRef = useRef(null);

useEffect(() => {
  if (!currentUser?.uid || !role) return;
  if (fetchAbortRef.current) fetchAbortRef.current.abort();

  const controller = new AbortController();
  fetchAbortRef.current = controller;

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      let data;

      if (query) {
        // Recherche tous rôles
        data = await searchServices(query, token);
      } else if (role === "ADMIN") {
        // Admin → tous les services via /services/admin
        data = await getAllServices(token, role);
      } else if (role === "GARAGE") {
        const garage = await getCurrentGarage(token, role);
        const garageId = garage?.id || garage?.garageId;
        if (!garageId) throw new Error("Garage ID not found");
        data = await getServicesByGarage(garageId, token);
      } else {
        data = []; // pas de rôle connu
      }

      if (!controller.signal.aborted) setServices(data.content || data);

      if (!controller.signal.aborted) setServices(data.content || data);
    } catch (err) {
      if (err.name !== "AbortError") console.error(err.message);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  const timer = setTimeout(fetchData, query ? 400 : 0);
  return () => {
    clearTimeout(timer);
    controller.abort();
  };
}, [query, role, currentUser]);

  const handleSave = async () => {
    try {
      const token = await currentUser.getIdToken();
      const payload = { ...formData, price: +formData.price, durationMinutes: +formData.durationMinutes };
      
      if (editingService) {
        const updated = await updateService(editingService.id, payload, token, role);
        setServices(prev => prev.map(s => s.id === editingService.id ? updated : s));
      } else {
        const newS = await createService(payload, token, role);
        setServices(prev => [...prev, newS]);
      }
      closeModal();
    } catch (err) { console.error(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;
    try {
      const token = await currentUser.getIdToken();
      await deleteService(id, token, role);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err) { console.error(err.message); }
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingService(null);
    setFormData(defaultForm);
  };

  if (loading) return <div className="p-10 text-center text-slate-400 font-medium">Chargement...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B]">Catalogue des Services</h1>
          <p className="text-slate-400 text-sm mt-1">{services.length} services disponibles sur la plateforme</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#F57C23] hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold transition shadow-lg shadow-orange-200"
        >
          + Ajouter un service
        </button>
      </div>

      {/* Barre de recherche style Garage */}
      <div className="relative w-full md:w-[500px] mb-8">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
        <input
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-100 transition shadow-sm placeholder:text-slate-300"
          placeholder="Rechercher un service (ex: Vidange)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Tableau style Garage */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-5 font-medium">Service & Catégorie</th>
              <th className="px-6 py-5 font-medium">Garage</th>
              <th className="px-6 py-5 font-medium text-center">Prix</th>
              <th className="px-6 py-5 font-medium text-center">Durée</th>
              <th className="px-6 py-5 font-medium text-center">Type</th>
              <th className="px-6 py-5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-orange-50 rounded-xl text-orange-500">
                      <WrenchScrewdriverIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-[#334155]">{s.name}</div>
                      <div className="text-[12px] text-slate-400 font-medium">{s.categoryNameFr || "Sans catégorie"}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-slate-500 font-medium">
                  {s.garageName || "Garage inconnu"}
                </td>
                <td className="px-6 py-5 text-center font-bold text-[#1E293B]">
                  {formatCurrency(s.price)}
                </td>
                <td className="px-6 py-5 text-center text-slate-500 font-medium">
                  {formatDuration(s.durationMinutes)}
                </td>
                <td className="px-6 py-5 text-center">
                  <Pill status={s.isMobile} />
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-3 text-slate-400">
                    <button 
                      onClick={() => { setEditingService(s); setFormData(s); setShowCreateModal(true); }}
                      className="p-1.5 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - Mise à jour du style */}
      {(showCreateModal || editingService) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-[24px] w-full max-w-md shadow-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1E293B]">
                {editingService ? "Modifier le service" : "Nouveau service"}
              </h2>
              <p className="text-slate-400 text-sm">Remplissez les informations ci-dessous</p>
            </div>
            
            <div className="space-y-4">
              <input 
                placeholder="Nom du service *" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                className="w-full bg-slate-50 border-none p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 text-sm font-medium" 
              />
              <textarea 
                placeholder="Description" 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                className="w-full bg-slate-50 border-none p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 text-sm font-medium resize-none" 
                rows={3} 
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Prix (DH)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-slate-50 border-none p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 text-sm font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Durée (min)</label>
                  <input type="number" value={formData.durationMinutes} onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })} className="w-full bg-slate-50 border-none p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 text-sm font-bold" />
                </div>
              </div>
              <label className="flex items-center gap-3 p-4 cursor-pointer bg-orange-50/50 border border-orange-100 rounded-xl transition hover:bg-orange-50">
                <input type="checkbox" checked={formData.isMobile} onChange={(e) => setFormData({ ...formData, isMobile: e.target.checked })} className="w-5 h-5 accent-[#F57C23] rounded-md" />
                <span className="text-sm font-bold text-orange-700">Disponible en service mobile</span>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={closeModal} className="flex-1 px-4 py-3.5 text-slate-500 rounded-xl hover:bg-slate-50 font-bold transition">Annuler</button>
              <button onClick={handleSave} className="flex-1 px-4 py-3.5 bg-[#F57C23] text-white rounded-xl hover:bg-orange-600 font-bold transition shadow-lg shadow-orange-100">
                {editingService ? "Mettre à jour" : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}