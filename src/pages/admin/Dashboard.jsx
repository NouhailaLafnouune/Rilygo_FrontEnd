import { useTranslation } from 'react-i18next';
import {
  Users,
  Building2,
  Calendar,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
export default function Dashboard() {
  const { t } = useTranslation();
  const cards = [
    {
      title: t('pages.dashboard.cards.totalUsers'),
      value: "12,847",
      percent: "12.5%",
      icon: <Users size={20} />,
    },
    {
      title: t('pages.dashboard.cards.activeGarages'),
      value: "234",
      percent: "8.2%",
      icon: <Building2 size={20} />,
    },
    {
      title: t('pages.dashboard.cards.monthlyReservations'),
      value: "1,847",
      percent: "23.1%",
      icon: <Calendar size={20} />,
    },
    {
      title: t('pages.dashboard.cards.monthlyRevenue'),
      value: "284K MAD",
      percent: "15.7%",
      icon: <CreditCard size={20} />,
    },
  ];
  const lineData = [
    { name: "Jan", value: 120 },
    { name: "Fév", value: 180 },
    { name: "Mar", value: 240 },
    { name: "Avr", value: 300 },
    { name: "Mai", value: 270 },
    { name: "Jun", value: 420 },
    { name: "Jul", value: 380 },
    { name: "Août", value: 450 },
  ];
  const barData = [
    { name: "Lavage", total: 340 },
    { name: "Vidange", total: 260 },
    { name: "Pneus", total: 180 },
    { name: "Préparation", total: 150 },
    { name: "Autre", total: 85 },
    { name: "Diagnostic", total: 100 },
  ];
  return (
    <div className="bg-gray-50 min-h-screen p-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">{t('pages.dashboard.title')}</h1>
        <p className="text-gray-500 mt-1">
          {t('pages.dashboard.subtitle')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="bg-orange-100 text-orange-500 p-3 rounded-full">
                {card.icon}
              </div>
              <div className="flex items-center text-green-500 text-sm font-semibold">
                {card.percent}
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              {card.title}
            </p>
            <p className="text-2xl font-bold mt-1">
              {card.value}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              vs mois dernier
            </p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-6">
            {t('pages.dashboard.chartReservationOverTime')}
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-6">
            {t('pages.dashboard.chartReservationByService')}
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="total"
                fill="#f97316"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
