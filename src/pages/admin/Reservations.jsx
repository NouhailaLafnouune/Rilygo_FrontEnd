import React, {useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { 
  getGarageReservations,
  getAllReservations,
  updateReservationStatus 
} from '../../services/reservationService.js';
import {
  ClockIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CheckIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export default function GestionReservations() {
  const { currentUser, role } = useAuth();
  const [tab, setTab] = useState("pending");
  const [data, setData] = useState({ pending: [], inProgress: [], history: [] });
  const [loading, setLoading] = useState(true);

  const TABS = [
    { key: "pending", label: "Demandes entrantes", count: data.pending.length },
    { key: "inProgress", label: "En cours", count: data.inProgress.length },
    { key: "history", label: "Historique", count: data.history.length },
  ];

const loadAllReservations = async () => {
  if (!currentUser) return;
  try {
    setLoading(true);
    const token = await currentUser.getIdToken();

    // Use appropriate endpoint based on role
    const allReservations = role === 'GARAGE' 
      ? await getGarageReservations(token, role)
      : await getAllReservations(token, role);
    
    const reservations = allReservations.content || [];

    setData({
      pending: reservations.filter(r => r.status === "PENDING"),
      inProgress: reservations.filter(r => ["CONFIRMED", "IN_PROGRESS"].includes(r.status)),
      history: reservations.filter(r => ["COMPLETED", "CANCELLED", "REFUSED"].includes(r.status)),
    });
  } catch (error) {
    console.error("Erreur API:", error);
  } finally {
    setLoading(false);
  }
};

const hasLoaded = useRef(false);

useEffect(() => {
  if (!currentUser) return;
  if (hasLoaded.current) return; // si déjà chargé, on ne rappelle pas
  hasLoaded.current = true;

  loadAllReservations();
}, [currentUser, role]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = await currentUser.getIdToken();
      await updateReservationStatus(id, { status: newStatus }, token, role);
      loadAllReservations();
    } catch (error) {
      console.error("Erreur mise à jour", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-[32px] font-bold text-[#111827] mb-2">Gestion des réservations</h1>
          <p className="text-[#6B7280] text-lg">Gérez vos réservations clients</p>
        </header>

        {/* Barre d'onglets style Image */}
        <div className="flex items-center gap-8 mb-8 bg-[#F3F4F6]/50 p-2 rounded-xl w-fit">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[15px] font-medium transition-all ${
                tab === t.key 
                ? "bg-white text-[#111827] shadow-sm" 
                : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              {t.label}
              <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold ${
                tab === t.key ? "bg-[#F97316] text-white" : "bg-[#D1D5DB] text-white"
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Liste des Réservations */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 text-slate-400 font-medium">Chargement des données...</div>
          ) : data[tab].length === 0 ? (
            <div className="bg-white rounded-2xl p-20 text-center border border-slate-100 text-slate-400 shadow-sm">
              Aucune réservation ici
            </div>
          ) : (
            data[tab].map((res) => (
              <div key={res.id} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-[19px] font-bold text-[#111827]">{res.clientName || `${res.client?.firstName} ${res.client?.lastName}`}</h3>
                    <p className="text-[#F97316] font-medium text-[15px]">{res.serviceName || res.service}</p>
                    
                    <div className="flex items-center gap-6 mt-4 text-[#6B7280] text-[14px]">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        {res.appointmentDate} à {res.appointmentTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDaysIcon className="w-4 h-4" />
                        {res.carModel || "Véhicule"}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4" />
                        {res.location || "Sur place"}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-4 mb-2">
                      <span className="bg-[#FFF7ED] text-[#F97316] px-4 py-1 rounded-full text-[12px] font-bold border border-[#FFEDD5]">
                        En attente
                      </span>
                      <span className="text-[20px] font-black text-[#111827]">
                        {res.totalPrice || res.price} MAD
                      </span>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action style Image */}
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => handleUpdateStatus(res.id, "CONFIRMED")}
                    className="flex items-center gap-2 px-5 py-2 bg-[#ECFDF5] text-[#10B981] rounded-xl text-[14px] font-bold hover:bg-[#10B981] hover:text-white transition-all"
                  >
                    <CheckIcon className="w-4 h-4 stroke-[3px]" />
                    Accepter
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(res.id, "REFUSED")}
                    className="flex items-center gap-2 px-5 py-2 bg-[#FEF2F2] text-[#EF4444] rounded-xl text-[14px] font-bold hover:bg-[#EF4444] hover:text-white transition-all"
                  >
                    <XMarkIcon className="w-4 h-4 stroke-[3px]" />
                    Rejeter
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}