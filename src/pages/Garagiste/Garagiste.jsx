import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Clock,
  CalendarDays,
  CheckCircle2,
  Star,
  CreditCard,
} from "lucide-react";
const kpis = [
  { icon: Clock, value: "3", label: "En attente" },
  { icon: CalendarDays, value: "7", label: "Aujourd'hui" },
  { icon: CheckCircle2, value: "142", label: "Complétées (mois)", trend: "+18%" },
  { icon: Star, value: "4.7 ★", label: "Note moyenne" },
  { icon: CreditCard, value: "35K MAD", label: "Revenu (mois)", trend: "+12%" },
];
const revenueData = [
  { name: "Jan", value: 12000 },
  { name: "Fév", value: 18000 },
  { name: "Mar", value: 21000 },
  { name: "Avr", value: 18500 },
  { name: "Mai", value: 24000 },
  { name: "Jun", value: 30000 },
  { name: "Jul", value: 27000 },
  { name: "Août", value: 35000 },
];
const servicesData = [
  { name: "Vidange", value: 35 },
  { name: "Lavage", value: 25 },
  { name: "Pneus", value: 20 },
  { name: "Diagnostic", value: 15 },
  { name: "Autre", value: 5 },
];
const serviceColors = ["#fb923c", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7"];
const reservations = [
  {
    time: "09:00",
    name: "Mohammed B.",
    service: "Vidange complète",
    car: "Dacia Logan 2022",
  },
  {
    time: "10:30",
    name: "Sara M.",
    service: "Diagnostic moteur",
    car: "Renault Clio 2021",
  },
];
function KpiCard({ icon, value, label, trend }) {
  const Icon = icon;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
          <Icon className="h-5 w-5 text-orange-500" />
        </div>
        {trend ? (
          <span className="text-xs font-medium text-emerald-600">{trend}</span>
        ) : (
          <span />
        )}
      </div>
      <div className="mt-3 text-2xl font-semibold text-slate-900">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}
function Card({ title, children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
    >
      <div className="mb-3 text-sm font-semibold text-slate-900">{title}</div>
      {children}
    </div>
  );
}
export default function DashboardGarage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-slate-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-slate-500">
          Bienvenue, Garage Atlas Pro
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((k, i) => (
          <KpiCard key={i} {...k} />
        ))}
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card title="Revenu mensuel" className="lg:col-span-2">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Services réalisés">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={servicesData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {servicesData.map((_, idx) => (
                    <Cell key={idx} fill={serviceColors[idx]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 text-sm font-semibold text-slate-900">
          Réservations à venir
        </div>
        <div className="divide-y divide-slate-100">
          {reservations.map((r, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-xs font-semibold text-orange-600">
                  {r.time}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {r.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {r.service} • {r.car}
                  </div>
                </div>
              </div>
              <button className="text-xs font-semibold text-orange-600 hover:text-orange-700">
                Détails
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
