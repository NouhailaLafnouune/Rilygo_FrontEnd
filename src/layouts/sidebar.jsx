import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {
  HomeIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  StarIcon,
  BellIcon,
  DocumentTextIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  WrenchScrewdriverIcon,
  ChevronLeftIcon,
  GlobeAltIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  BanknotesIcon,
  ChartBarIcon,
  MapPinIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../hooks/useAuth.js";
const AdminSidebar = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || "fr");
  const { currentUser, role, logout } = useAuth();
  const adminMenuItems = [
    { name: t('sidebar.dashboard'), icon: HomeIcon, path: "/dashboard" },
    { name: t('sidebar.garages'), icon: BuildingStorefrontIcon, path: "/garages" },
    { name: t('sidebar.clients'), icon: UsersIcon, path: "/clients" },
    { name: t('sidebar.services'), icon: WrenchScrewdriverIcon, path: "/services" },
    { name: t('sidebar.reservations'), icon: ClipboardDocumentListIcon, path: "/reservations" },
    { name: t('sidebar.paiements'), icon: CreditCardIcon, path: "/paiements" },
    { name: t('sidebar.avis'), icon: StarIcon, path: "/avis" },
    { name: t('sidebar.notifications'), icon: BellIcon, path: "/notifications" },
    { name: t('sidebar.contenu'), icon: DocumentTextIcon, path: "/contenu" },
    { name: t('sidebar.parametres'), icon: CogIcon, path: "/parametres" },
  ];
  const garageMenuItems = [
    { name: t('sidebar.dashboard'), icon: HomeIcon, path: "/dashboard" },
    { name: t('sidebar.profil'), icon: UserCircleIcon, path: "/profil" },
    { name: t('sidebar.services'), icon: WrenchScrewdriverIcon, path: "/services" },
    { name: t('sidebar.reservations'), icon: ClipboardDocumentListIcon, path: "/reservations" },
    { name: t('sidebar.employes'), icon: UserGroupIcon, path: "/employes" },
    { name: t('sidebar.messages'), icon: ChatBubbleLeftRightIcon, path: "/messages" },
    { name: t('sidebar.finances'), icon: BanknotesIcon, path: "/finances" },
    { name: t('sidebar.avis'), icon: StarIcon, path: "/avis" },
    { name: t('sidebar.analytique'), icon: ChartBarIcon, path: "/analytique" },
  ];
  const employeeMenuItems = [
    { name: t('sidebar.dashboard'), icon: HomeIcon, path: "/dashboard" },
    { name: t('sidebar.missions'), icon: CheckCircleIcon, path: "/missions" },
    { name: t('sidebar.messages'), icon: ChatBubbleLeftRightIcon, path: "/messages" },
    { name: t('sidebar.profil'), icon: UserCircleIcon, path: "/profil" },
  ];
  const ROLE_CONFIG = {
    ADMIN: {
      label: t('sidebar.administration'),
      menuItems: adminMenuItems,
      avatarGradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    },
    GARAGE: {
      label: t('sidebar.espaceGarage'),
      menuItems: garageMenuItems,
      avatarGradient: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    },
    EMPLOYEE: {
      label: t('sidebar.espaceEmploye'),
      menuItems: employeeMenuItems,
      avatarGradient: "linear-gradient(135deg, #10b981, #059669)",
    },
  };
  const FALLBACK = ROLE_CONFIG.ADMIN;
  const config = ROLE_CONFIG[role] ?? FALLBACK;
  const userName = currentUser?.displayName || "User";
  const userEmail = currentUser?.email || "user@example.com";
  const userInitial = userName.charAt(0).toUpperCase();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };
  return (
    <div
      className="flex flex-col justify-between h-screen sticky top-0 text-white"
      style={{
        width: 220,
        minWidth: 220,
        background: "#0f172a",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <div>
        <div
          className="flex items-center justify-between px-4 py-4"
          style={{ borderBottom: "1px solid #1e293b" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center rounded-xl text-white font-extrabold text-sm shrink-0"
              style={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                boxShadow: "0 2px 8px rgba(249,115,22,0.4)",
              }}
            >
              R
            </div>
            <div>
              <div className="text-sm font-bold leading-tight text-white">RiLygo</div>
              <div className="text-xs leading-tight" style={{ color: "#64748b" }}>
                {config.label}
              </div>
            </div>
          </div>
          <ChevronLeftIcon className="h-4 w-4" style={{ color: "#334155" }} />
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{ borderBottom: "1px solid #1e293b" }}
        >
          <GlobeAltIcon className="h-4 w-4" style={{ color: "#475569" }} />
          {["FR", "EN"].map((l, i) => (
            <React.Fragment key={l}>
              {i > 0 && <span style={{ color: "#334155", fontSize: 10 }}>Â·</span>}
              <button
                onClick={() => handleLanguageChange(l.toLowerCase())}
                className="text-xs px-2 py-0.5 rounded transition"
                style={
                  lang === l.toLowerCase()
                    ? { background: "#1e293b", color: "#f97316", fontWeight: 700 }
                    : { color: "#475569" }
                }
              >
                {l}
              </button>
            </React.Fragment>
          ))}
        </div>
        <nav className="mt-1 px-2 flex flex-col gap-0.5 overflow-y-hidden">
          {config.menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive ? "text-orange-400" : "hover:text-slate-200",
                ].join(" ")
              }
              style={({ isActive }) =>
                isActive ? { background: "#1e293b" } : { color: "#94a3b8" }
              }
            >
              {({ isActive }) => {
                const IconComponent = item.icon;
                return (
                  <>
                    <IconComponent
                      className="h-[18px] w-[18px] shrink-0"
                      style={{ color: isActive ? "#f97316" : "#64748b" }}
                    />
                    <span>{item.name}</span>
                  </>
                );
              }}
            </NavLink>
          ))}
        </nav>
      </div>
      <div style={{ borderTop: "1px solid #1e293b" }}>
        <div className="flex items-center gap-3 px-4 py-3">
          <div
            className="flex items-center justify-center rounded-full text-white text-xs font-bold shrink-0"
            style={{ width: 32, height: 32, background: config.avatarGradient }}
          >
            {userInitial}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate leading-tight">
              {userName}
            </p>
            <p className="text-xs truncate leading-tight" style={{ color: "#475569" }}>
              {userEmail}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-4 pb-4 text-xs font-medium transition-colors"
          style={{ color: "#64748b" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
          {t('sidebar.deconnexion')}
        </button>
      </div>
    </div>
  );
};
export default AdminSidebar;
