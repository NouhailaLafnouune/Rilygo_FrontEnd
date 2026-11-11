import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../hooks/useAuth";
import { getAllClients } from "../../services/clientService.js";
import {
  EyeIcon,
  UserMinusIcon,
  UserPlusIcon,
  MagnifyingGlassIcon as SearchIcon,
} from "@heroicons/react/24/outline";

export default function ClientManagement() {
  const { t } = useTranslation();
  const { currentUser, role } = useAuth();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const TABS = [
    { key: "all", label: t('pages.clients.tabs.all'), value: null },
    { key: "active", label: t('pages.clients.tabs.active'), value: true },
    { key: "inactive", label: t('pages.clients.tabs.inactive'), value: false },
  ];

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const data = await getAllClients(token, role);
        setClients(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchClients();
  }, [currentUser, role]);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchTab = tab === "all" || (tab === "active" ? c.active : !c.active);
      const searchStr = `${c.firstName} ${c.lastName} ${c.email} ${c.phone}`.toLowerCase();
      return matchTab && searchStr.includes(query.toLowerCase());
    });
  }, [clients, tab, query]);

  if (loading) return <div className="p-10 text-center font-medium text-slate-500">{t('pages.clients.loading')}</div>;

return (
  <div className="min-h-screen bg-[#F8F9FB] p-8">
    {/* Header */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[#1A202C]">{t('pages.clients.title')}</h1>
      <p className="text-slate-500 mt-1">{t('pages.clients.subtitle', { count: clients.length })}</p>
    </div>

    {/* Barre de recherche et Filtres */}
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div className="relative w-full md:w-[600px]">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-100 transition shadow-sm"
          placeholder={t('pages.clients.search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition ${
              tab === t.key
                ? "bg-[#F57C23] text-white shadow-md shadow-orange-200"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>

    {/* Tableau */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
       <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wider border-b border-slate-100">
  <tr>
    <th className="px-5 py-4 font-semibold">{t('pages.clients.table.name')}</th>
    <th className="px-5 py-4 font-semibold">{t('pages.clients.table.email')}</th>
    <th className="px-5 py-4 font-semibold">{t('pages.clients.table.phone')}</th>
    <th className="px-5 py-4 font-semibold text-center">{t('pages.clients.table.reservations')}</th>
    <th className="px-5 py-4 font-semibold text-center">{t('pages.clients.table.status')}</th>
    <th className="px-5 py-4 font-semibold">{t('pages.clients.table.createdAt')}</th>
    <th className="px-5 py-4 font-semibold text-right">{t('pages.clients.table.actions')}</th>
  </tr>
</thead>
        <tbody className="divide-y divide-slate-50">
          {filtered.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="p-5">
                <div className="font-bold text-slate-800 text-[15px]">{c.firstName} {c.lastName}</div>
                <div className="text-xs text-slate-400 font-medium">{c.city || "Casablanca"}</div>
              </td>
              <td className="p-5 text-slate-500 text-[14px]">{c.email}</td>
              <td className="p-5 text-slate-600 font-medium text-[14px]">{c.phone || "+212 6 -- -- -- --"}</td>
              <td className="p-5 text-center font-bold text-slate-800 text-[15px]">
                {c.reservationCount || 0}
              </td>
              <td className="p-5 text-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-bold ${
                  c.active 
                    ? "bg-[#E6F9F1] text-[#22C55E]" 
                    : "bg-[#F1F5F9] text-[#64748B]"
                }`}>
                  {c.active ? t('pages.clients.table.active') : t('pages.clients.table.inactive')}
                </span>
              </td>
              <td className="p-5 text-slate-500 text-[14px]">
                {new Date(c.createdAt).toISOString().split('T')[0]}
              </td>
              <td className="p-5">
                <div className="flex justify-end gap-3 text-slate-400">
                  <button className="hover:text-slate-600 transition">
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button className={`transition ${c.active ? "hover:text-orange-500" : "hover:text-green-500"}`}>
                    {c.active ? <UserMinusIcon className="w-5 h-5" /> : <UserPlusIcon className="w-5 h-5" />}
                  </button>
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