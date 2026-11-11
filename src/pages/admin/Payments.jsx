import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../hooks/useAuth";
import { getAllPayments, confirmPayment, refundPayment } from "../../services/paymentService.js";
import {
  EyeIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon as SearchIcon,
} from "@heroicons/react/24/outline";

const statusStyles = {
  PAID: "bg-green-50 text-green-600 border-green-100",
  PENDING: "bg-orange-50 text-orange-500 border-orange-100",
  REFUNDED: "bg-slate-50 text-slate-400 border-slate-100",
};

export default function Payments() {
  const { t } = useTranslation();
  const { currentUser, role } = useAuth();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const TABS = [
    { key: "all", label: t('pages.payments.tabs.all'), value: null },
    { key: "paid", label: t('pages.payments.tabs.paid'), value: "PAID" },
    { key: "pending", label: t('pages.payments.tabs.pending'), value: "PENDING" },
    { key: "refunded", label: t('pages.payments.tabs.refunded'), value: "REFUNDED" },
  ];

  useEffect(() => {
    if (!currentUser?.uid || !role) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const data = await getAllPayments(token, role);
        
        const mapped = data.map(p => ({
          id: p.id,
          reservationId: p.reservationId,
          provider: p.provider,
          amount: p.amount,
          commission: p.commission,
          garageAmount: p.garageAmount,
          status: p.status,
          date: new Date(p.createdAt).toISOString().split('T')[0],
        }));
        setRows(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser, role, tab]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const activeTab = TABS.find(t => t.key === tab);
    
    return rows.filter(r => {
      const matchTab = tab === "all" || r.status === activeTab?.value;
      const searchStr = `${r.id} ${r.reservationId}`.toLowerCase();
      return matchTab && searchStr.includes(q);
    });
  }, [rows, query, tab]);

  const handleAction = async (id, action) => {
    const token = await currentUser.getIdToken();
    if (action === "confirm") {
      const txId = prompt("ID de transaction du fournisseur :");
      if (txId) await confirmPayment(id, txId, token, role);
    } else if (action === "refund") {
      if (confirm("Confirmer le remboursement ?")) await refundPayment(id, token, role);
    }
    window.location.reload();
  };

  if (loading) return <div className="p-10 text-center text-slate-400 font-medium">{t('pages.payments.loading')}</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#1E293B]">{t('pages.payments.title')}</h1>
        <p className="text-slate-400 text-sm mt-1">{t('pages.payments.subtitle', { count: rows.length })}</p>
      </div>

      {/* Barre de recherche et Filtres */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-[500px]">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <input
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-100 transition shadow-sm placeholder:text-slate-300"
            placeholder={t('pages.payments.search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-2xl shadow-sm border border-slate-50">
          {TABS.map((s) => (
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

      {/* Tableau style Garage */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead  className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-5 font-medium">{t('pages.payments.table.id')}</th>
              <th className="px-6 py-5 font-medium">{t('pages.payments.table.method')}</th>
              <th className="px-6 py-5 font-medium text-center">{t('pages.payments.table.amount')}</th>
              <th className="px-6 py-5 font-medium text-center">{t('pages.payments.table.commission')}</th>
              <th className="px-6 py-5 font-medium text-center">{t('pages.payments.table.garageAmount')}</th>
              <th className="px-6 py-5 font-medium text-center">{t('pages.payments.table.status')}</th>
              <th className="px-6 py-5 font-medium">{t('pages.payments.table.date')}</th>
              <th className="px-6 py-5 font-medium text-right">{t('pages.payments.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="font-bold text-[#334155] font-mono text-xs uppercase">
                    {r.id.substring(0, 8)}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">
                    Rés: {r.reservationId.substring(0, 8)}
                  </div>
                </td>
                <td className="px-6 py-5 text-slate-500 font-medium">{r.provider}</td>
                <td className="px-6 py-5 text-center font-bold text-[#1E293B]">{r.amount} DH</td>
                <td className="px-6 py-5 text-center text-red-400 font-bold">-{r.commission} DH</td>
                <td className="px-6 py-5 text-center font-bold text-emerald-500">{r.garageAmount} DH</td>
                <td className="px-6 py-5 text-center">
                  <span className={`inline-flex px-4 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${statusStyles[r.status]}`}>
                    {r.status === "PAID" ? t('pages.payments.status.PAID') : r.status === "PENDING" ? t('pages.payments.status.PENDING') : t('pages.payments.status.REFUNDED')}
                  </span>
                </td>
                <td className="px-6 py-5 text-slate-400 text-[14px]">{r.date}</td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-3 text-slate-400">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg transition" title={t('pages.payments.details')}>
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    {r.status === "PENDING" && (
                      <button 
                        className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition"
                        onClick={() => handleAction(r.id, "confirm")}
                        title={t('pages.payments.confirm')}
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                    )}
                    {r.status === "PAID" && (
                      <button 
                        className="p-1.5 text-orange-400 hover:bg-orange-50 rounded-lg transition"
                        onClick={() => handleAction(r.id, "refund")}
                        title={t('pages.payments.refund')}
                      >
                        <ArrowPathIcon className="w-5 h-5" />
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