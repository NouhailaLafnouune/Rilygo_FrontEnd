import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  getGarageEmployees,
  deactivateEmployee,
} from "../../services/employeeService.js";
import { getCurrentGarage } from "../../services/garageService.js";
import {
  UserGroupIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  WrenchScrewdriverIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const AVAILABILITY_STATUS = {
  AVAILABLE: { label: "Disponible", color: "#10b981", bg: "#d1fae5" },
  UNAVAILABLE: { label: "Indisponible", color: "#ef4444", bg: "#fee2e2" },
  ON_LEAVE: { label: "En congé", color: "#f59e0b", bg: "#fef3c7" },
};

const STATUS_FILTERS = [
  { key: "all", label: "Tous", icon: UserGroupIcon },
  { key: "AVAILABLE", label: "Disponibles", icon: CheckCircleIcon },
  { key: "UNAVAILABLE", label: "Indisponibles", icon: XCircleIcon },
  { key: "ON_LEAVE", label: "En congé", icon: ClockIcon },
];

export default function Employes() {
  const { currentUser, role } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const abortRef = useRef(null);

  // Fetch employees
const hasLoaded = useRef(false);

useEffect(() => {
  if (!currentUser || !role) return;

  if (hasLoaded.current) return;

  const controller = new AbortController();
  abortRef.current = controller;

const fetchEmployees = async () => {
  try {
    setLoading(true);
    const token = await currentUser.getIdToken();
    const garage = await getCurrentGarage(token, role);
    const garageId = garage?.id || garage?.garageId;
    if (!garageId) throw new Error("Garage ID not found");

    const data = await getGarageEmployees(garageId, token, role); // data est déjà un tableau

    // Filtrer par statut si nécessaire
    const filteredData =
      statusFilter === "all"
        ? data
        : data.filter((emp) => emp.availabilityStatus === statusFilter);

    setEmployees(filteredData);
  } catch (err) {
    console.error("Erreur chargement employés:", err);
  } finally {
    setLoading(false);
  }
};

  fetchEmployees();

  hasLoaded.current = true; // ✅ mettre après fetch

  return () => controller.abort();
}, [currentUser, role]);
  // Filter by search
  const filteredEmployees = employees.filter((emp) =>
    emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.phone?.includes(searchQuery)
  );

  const handleDeactivate = async (employeeId) => {
    if (!window.confirm("Confirmer la désactivation ?")) return;
    try {
      const token = await currentUser.getIdToken();
      await deactivateEmployee(employeeId, token);
      setEmployees(employees.filter((e) => e.id !== employeeId));
      alert("Employé désactivé");
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la désactivation");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      {/* Header */}
      <div className="px-8 py-6 bg-white border-b border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Gestion des employés</h1>
        <p className="text-slate-600 mt-1">
          Gérez votre équipe de terrain et leurs disponibilités
        </p>
      </div>

      {/* Stats */}
      <div className="p-8 grid grid-cols-4 gap-4">
        {[
          { label: "Total", count: employees.length, color: "#6366f1" },
          {
            label: "Disponibles",
            count: employees.filter(
              (e) => e.availabilityStatus === "AVAILABLE"
            ).length,
            color: "#10b981",
          },
          {
            label: "Indisponibles",
            count: employees.filter(
              (e) => e.availabilityStatus === "UNAVAILABLE"
            ).length,
            color: "#ef4444",
          },
          {
            label: "En congé",
            count: employees.filter(
              (e) => e.availabilityStatus === "ON_LEAVE"
            ).length,
            color: "#f59e0b",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg p-4 border border-slate-200"
          >
            <p className="text-slate-600 text-sm">{stat.label}</p>
            <p
              className="text-2xl font-bold mt-2"
              style={{ color: stat.color }}
            >
              {stat.count}
            </p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="px-8 pb-4 flex gap-4 items-center">
        <input
          type="text"
          placeholder="Rechercher par email, spécialité..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <div className="flex gap-2">
          {STATUS_FILTERS.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  statusFilter === filter.key
                    ? "bg-orange-500 text-white"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className="inline h-4 w-4 mr-2" />
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Employees List */}
      <div className="px-8 pb-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-orange-400 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-slate-500 mt-4">Chargement...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <UserGroupIcon className="h-12 w-12 text-slate-300 mx-auto" />
            <p className="text-slate-500 mt-4">Aucun employé trouvé</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEmployees.map((emp) => {
              const statusInfo =
                AVAILABILITY_STATUS[emp.availabilityStatus] ||
                AVAILABILITY_STATUS.UNAVAILABLE;
              return (
                <div
                  key={emp.id}
                  className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* En-tête */}
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{
                            background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                          }}
                        >
                          {emp.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">
                            {emp.email}
                          </p>
                          {emp.specialty && (
                            <p className="text-sm text-slate-600 flex items-center gap-1">
                              <WrenchScrewdriverIcon className="h-4 w-4" />
                              {emp.specialty}
                            </p>
                          )}
                        </div>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: statusInfo.bg,
                            color: statusInfo.color,
                          }}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Détails */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        {emp.phone && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <PhoneIcon className="h-4 w-4" />
                            {emp.phone}
                          </div>
                        )}
                        {emp.currentLat && emp.currentLng && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPinIcon className="h-4 w-4" />
                            {emp.currentLat}, {emp.currentLng}
                          </div>
                        )}
                        <div className="text-slate-500 text-xs">
                          {emp.isActive ? "✅ Actif" : "❌ Inactif"}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setShowDetailModal(true);
                        }}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                        title="Voir détails"
                      >
                        <EyeIcon className="h-5 w-5 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDeactivate(emp.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition"
                        title="Désactiver"
                      >
                        <TrashIcon className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">{selectedEmployee.email}</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-600">Email</p>
                <p className="font-medium">{selectedEmployee.email}</p>
              </div>
              {selectedEmployee.phone && (
                <div>
                  <p className="text-slate-600">Téléphone</p>
                  <p className="font-medium">{selectedEmployee.phone}</p>
                </div>
              )}
              {selectedEmployee.specialty && (
                <div>
                  <p className="text-slate-600">Spécialité</p>
                  <p className="font-medium">{selectedEmployee.specialty}</p>
                </div>
              )}
              <div>
                <p className="text-slate-600">Disponibilité</p>
                <p className="font-medium">
                  {AVAILABILITY_STATUS[selectedEmployee.availabilityStatus]
                    ?.label || "Inconnue"}
                </p>
              </div>
              {selectedEmployee.currentLat && selectedEmployee.currentLng && (
                <div>
                  <p className="text-slate-600">Localisation</p>
                  <p className="font-medium">
                    {selectedEmployee.currentLat}, {selectedEmployee.currentLng}
                  </p>
                </div>
              )}
              <div>
                <p className="text-slate-600">Statut</p>
                <p className="font-medium">
                  {selectedEmployee.isActive ? "✅ Actif" : "❌ Inactif"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDetailModal(false)}
              className="mt-6 w-full px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
