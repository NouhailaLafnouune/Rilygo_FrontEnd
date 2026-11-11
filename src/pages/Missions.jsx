import React, { useState } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const Missions = () => {
  const [missions] = useState([
    {
      id: 1,
      title: "Diagnostic moteur",
      garage: "Sara M.",
      location: "15 Bd Zerktouni, Casablanca",
      client: "Sara M.",
      date: "2026-03-30",
      time: "10:30",
      status: "en_cours",
      vehicle: "Renault Clio 2021",
      description: "Diagnostic moteur complet",
    },
    {
      id: 2,
      title: "Vidange complète",
      garage: "Mohammed B.",
      location: "23 Rue Hassan II, Casablanca",
      client: "Mohammed B.",
      date: "2026-03-30",
      time: "09:00",
      status: "termine",
      vehicle: "Peugeot 308",
      description: "Vidange et remplacement du filtre",
    },
    {
      id: 3,
      title: "Remplacement plaquettes",
      garage: "Ahmed K.",
      location: "5 Avenue Mohammed V, Fès",
      client: "Ahmed K.",
      date: "2026-03-31",
      time: "14:00",
      status: "planifie",
      vehicle: "Toyota Corolla",
      description: "Remplacement des plaquettes de frein",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "en_cours":
        return { bg: "#fef3c7", text: "#d97706", label: "En cours" };
      case "termine":
        return { bg: "#d1fae5", text: "#059669", label: "Terminé" };
      case "planifie":
        return { bg: "#dbeafe", text: "#2563eb", label: "Planifié" };
      default:
        return { bg: "#f3f4f6", text: "#6b7280", label: "Inconnu" };
    }
  };

  const stats = [
    {
      label: "Missions aujourd'hui",
      value: "3",
      icon: MapPinIcon,
      color: "#f97316",
    },
    {
      label: "Complétées (semaine)",
      value: "18",
      icon: CheckCircleIcon,
      color: "#10b981",
      increment: "5%",
    },
    {
      label: "Complétées (mois)",
      value: "67",
      icon: CalendarIcon,
      color: "#f97316",
      increment: "12%",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      {/* Header */}
      <div className="px-8 py-6 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Mes missions</h1>
            <p className="text-slate-600 mt-1">Bonjour Ahmed, voici vos missions du jour</p>
          </div>
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium">
            En ligne
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-8 grid grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ background: `${stat.color}20` }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: stat.color }}
                  />
                </div>
                {stat.increment && (
                  <span className="text-emerald-600 text-sm font-medium">
                    ↑ {stat.increment}
                  </span>
                )}
              </div>
              <p className="text-slate-600 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Missions */}
      <div className="px-8 pb-8">
        {/* Mission en cours */}
        {missions.filter((m) => m.status === "en_cours").length > 0 && (
          <div className="mb-8 p-6 bg-orange-50 rounded-lg border-l-4" style={{ borderColor: "#f97316" }}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">
                  🏁 Mission en cours
                </h3>
                {missions
                  .filter((m) => m.status === "en_cours")
                  .map((mission) => (
                    <div key={mission.id}>
                      <p className="font-semibold text-slate-900">
                        {mission.title}
                      </p>
                      <p className="text-sm text-slate-600">
                        {mission.client} • {mission.location}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {mission.vehicle} • Prévu à {mission.time}
                      </p>
                    </div>
                  ))}
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium">
                  Terminer
                </button>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium">
                  Naviguer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Missions du jour */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Missions du jour</h2>
          <div className="space-y-3">
            {missions.map((mission) => {
              const statusInfo = getStatusColor(mission.status);
              return (
                <div
                  key={mission.id}
                  className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow flex items-center justify-between"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-slate-500 font-medium min-w-[50px]">
                      {mission.time}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {mission.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {mission.client} • {mission.location}
                      </p>
                    </div>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={
                      statusInfo
                        ? {
                            background: statusInfo.bg,
                            color: statusInfo.text,
                          }
                        : {}
                    }
                  >
                    {statusInfo?.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Missions;
