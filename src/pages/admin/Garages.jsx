import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../hooks/useAuth";
import {
  getAllGarages,
  approveOrRejectGarage,
  deactivateGarage,
} from "../../services/garageService.js";
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  NoSymbolIcon,
  MagnifyingGlassIcon as SearchIcon,
} from "@heroicons/react/24/outline";

const statusStyles = {
  APPROVED: "bg-green-50 text-green-600 border-green-100",
  PENDING: "bg-orange-50 text-orange-500 border-orange-100",
  SUSPENDED: "bg-slate-50 text-slate-400 border-slate-100",
  REJECTED: "bg-red-50 text-red-500 border-red-100",
};

export default function GarageManagement() {
  const { t } = useTranslation();
  const { currentUser, role } = useAuth();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const STATUSES = [
    { key: "all", label: t('pages.garages.tabs.all'), value: null },
    { key: "pending", label: t('pages.garages.tabs.pending'), value: "PENDING" },
    { key: "approved", label: t('pages.garages.tabs.approved'), value: "APPROVED" },
    { key: "suspended", label: t('pages.garages.tabs.suspended'), value: "SUSPENDED" },
    { key: "rejected", label: t('pages.garages.tabs.rejected'), value: "REJECTED" },
  ];

  const statusLabels = {
    APPROVED: t('pages.garages.status.APPROVED'),
    PENDING: t('pages.garages.status.PENDING'),
    SUSPENDED: t('pages.garages.status.SUSPENDED'),
    REJECTED: t('pages.garages.status.REJECTED'),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const statusFilter = STATUSES.find((s) => s.key === tab)?.value;
        const data = await getAllGarages(token, role, statusFilter);
        const mapped = data.map((g) => ({
          id: g.id,
          name: g.name,
          city: g.ville || "Casablanca",
          status: g.status,
          rating: g.ratingAvg,
          services: g.servicesCount,
          employees: g.employeesCount,
          date: new Date(g.createdAt).toISOString().split('T')[0],
        }));
        setRows(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchData();
  }, [currentUser, role, tab]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter((r) =>
      r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q)
    );
  }, [rows, query]);

  if (loading) return <div className="p-10 text-center text-slate-400">{t('pages.garages.loading')}</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#1E293B]">{t('pages.garages.title')}</h1>
        <p className="text-slate-400 text-sm mt-1">{t('pages.garages.subtitle', { count: rows.length })}</p>
      </div>

      {/* Barre de recherche et Filtres */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-[500px]">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <input
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-100 transition shadow-sm placeholder:text-slate-300"
            placeholder={t('pages.garages.search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-2xl shadow-sm border border-slate-50">
          {STATUSES.map((s) => (
            <button
              key={s.key}
              onClick={() => setTab(s.key)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
                tab === s.key
                  ? "bg-[#F57C23] text-white shadow-lg shadow-orange-200"
                  : "bg-transparent text-slate-500 hover:bg-slate-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau style Image */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-5 font-medium">{t('pages.garages.table.name')}</th>
              <th className="px-6 py-5 font-medium">{t('pages.garages.table.city')}</th>
              <th className="px-6 py-5 font-medium text-center">{t('pages.garages.table.status')}</th>
              <th className="px-6 py-5 font-medium text-center">{t('pages.garages.table.rating')}</th>
              <th className="px-6 py-5 font-medium text-center">{t('pages.garages.table.services')}</th>
              <th className="px-6 py-5 font-medium text-center">{t('pages.garages.table.employees')}</th>
              <th className="px-6 py-5 font-medium">{t('pages.garages.table.createdAt')}</th>
              <th className="px-6 py-5 font-medium text-right">{t('pages.garages.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5 font-bold text-[#334155]">{r.name}</td>
                <td className="px-6 py-5 text-slate-500">{r.city}</td>
                <td className="px-6 py-5 text-center">
                  <span className={`inline-flex px-4 py-1 rounded-full text-[12px] font-bold border ${statusStyles[r.status]}`}>
                    {statusLabels[r.status]}
                  </span>
                </td>
                <td className="px-6 py-5 text-center font-bold text-[#334155]">
                  {r.rating ? `${r.rating} ★` : "—"}
                </td>
                <td className="px-6 py-5 text-center text-slate-500 font-medium">{r.services}</td>
                <td className="px-6 py-5 text-center text-slate-500 font-medium">{r.employees}</td>
                <td className="px-6 py-5 text-slate-400 text-[14px]">{r.date}</td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-3">
                    <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition">
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    {r.status === "PENDING" ? (
                      <>
                        <button className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition" title="Approuver">
                          <CheckCircleIcon className="w-5 h-5" />
                        </button>
                        <button className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition" title="Rejeter">
                          <XCircleIcon className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <button className="p-1.5 text-orange-400 hover:bg-orange-50 rounded-lg transition" title="Suspendre">
                        <NoSymbolIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}