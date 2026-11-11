import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import ForgotPassword from '../pages/ForgotPassword.jsx';
import VerifyEmail from '../pages/VerifyEmail.jsx';
import Dashboard from '../pages/admin/Dashboard.jsx';
import Garages from '../pages/admin/Garages.jsx';
import Clients from '../pages/admin/Clients.jsx';
import Reservations from '../pages/admin/Reservations.jsx';
import Payments from '../pages/admin/Payments.jsx';
import Services from '../pages/admin/Services.jsx';
import Contenu from '../pages/admin/Contenu.jsx';
import Notifications from '../pages/admin/Notifications.jsx';
import Settings from '../pages/admin/Settings.jsx';
import Garagiste from '../pages/Garagiste/Garagiste.jsx';
import Employes from '../pages/Garagiste/Employes.jsx';
import Missions from '../pages/Missions.jsx';
export const PUBLIC_ROUTES = [
  {
    path: '/login',
    element: Login,
    label: 'Login',
    description: 'User authentication page',
  },
  {
    path: '/register',
    element: Register,
    label: 'Register',
    description: 'User registration page',
  },
  {
    path: '/forgot-password',
    element: ForgotPassword,
    label: 'Forgot Password',
    description: 'Password recovery page',
  },
  {
    path: '/verify-email',
    element: VerifyEmail,
    label: 'Verify Email',
    description: 'Email verification page',
  },
];
export const ADMIN_ROUTES = [
  {
    path: '/dashboard',
    element: Dashboard,
    label: 'Dashboard',
    description: 'Admin dashboard with statistics and overview',
    icon: 'dashboard',
    roles: ['ADMIN'],
  },
  {
    path: '/garages',
    element: Garages,
    label: 'Gestion des garages',
    description: 'Manage and moderate partner garages',
    icon: 'garages',
    roles: ['ADMIN'],
    relatedEndpoints: [
      'GET /garages',
      'GET /garages/{id}',
      'PATCH /garages/{id}/status',
      'PUT /garages/{id}',
      'PATCH /garages/{id}/deactivate',
      'DELETE /garages/{id}',
    ],
  },
  {
    path: '/clients',
    element: Clients,
    label: 'Clients',
    description: 'Manage registered clients',
    icon: 'users',
    roles: ['ADMIN'],
    relatedEndpoints: [
      'GET /clients',
      'GET /clients/{id}',
      'PUT /clients/{id}',
      'PATCH /clients/{id}/deactivate',
      'DELETE /clients/{id}',
    ],
  },
  {
    path: '/reservations',
    element: Reservations,
    label: 'Réservations',
    description: 'View and manage reservations',
    icon: 'calendar',
    roles: ['ADMIN'],
  },
  {
    path: '/paiements',
    element: Payments,
    label: 'Paiements',
    description: 'Payment management and transactions',
    icon: 'payments',
    roles: ['ADMIN'],
  },
  {
    path: '/services',
    element: Services,
    label: 'Services',
    description: 'Manage available services',
    icon: 'services',
    roles: ['ADMIN'],
  },
  {
    path: '/notifications',
    element: Notifications,
    label: 'Notifications',
    description: 'System notifications and alerts',
    icon: 'bell',
    roles: ['ADMIN'],
  },
  {
    path: '/contenu',
    element: Contenu,
    label: 'Contenu',
    description: 'Content management',
    icon: 'file-text',
    roles: ['ADMIN'],
  },
  {
    path: '/parametres',
    element: Settings,
    label: 'Paramètres',
    description: 'Application settings and preferences',
    icon: 'settings',
    roles: ['ADMIN'],
  },
];
export const GARAGE_ROUTES_PROTECTED = [
  {
    path: '/garagiste',
    element: Garagiste,
    label: 'Mon Garage',
    description: 'Garage owner dashboard and profile',
    icon: 'garage',
    roles: ['GARAGE'],
    relatedEndpoints: [
      'GET /garages/me',
      'PUT /garages/me',
      'GET /garages/me/stats',
      'GET /garages/me/revenue',
      'GET /garages/me/services',
      'GET /garages/me/reservations',
    ],
  },
  {
    path: '/employes',
    element: Employes,
    label: 'Employés',
    description: 'Manage employees',
    icon: 'users',
    roles: ['GARAGE'],
  },
];
export const EMPLOYEE_ROUTES = [
  {
    path: '/missions',
    element: Missions,
    label: 'Missions',
    description: 'View and manage employee missions',
    icon: 'missions',
    roles: ['EMPLOYEE'],
  },
];
export const CLIENT_ROUTES = [
];
export function getRoutesByRole(role) {
  const allProtectedRoutes = [
    ...ADMIN_ROUTES,
    ...GARAGE_ROUTES_PROTECTED,
    ...EMPLOYEE_ROUTES,
    ...CLIENT_ROUTES,
  ];
  return allProtectedRoutes.filter(route =>
    route.roles && route.roles.includes(role)
  );
}
export function getRequiredRolesForRoute(path) {
  const allRoutes = [
    ...PUBLIC_ROUTES,
    ...ADMIN_ROUTES,
    ...GARAGE_ROUTES_PROTECTED,
    ...EMPLOYEE_ROUTES,
    ...CLIENT_ROUTES,
  ];
  const route = allRoutes.find(r => r.path === path);
  return route?.roles || null;
}
export function canAccessRoute(userRole, routePath) {
  const requiredRoles = getRequiredRolesForRoute(routePath);
  if (!requiredRoles) return true; // Public route
  return requiredRoles.includes(userRole);
}
export function canAccessServiceRoute(role, routeKey) {
  const allowedByRole = {
    PUBLIC: ['mobile', 'byGarage', 'search', 'detail'],
    CLIENT: ['mobile', 'byGarage', 'search', 'detail'],
    GARAGE: ['mobile', 'byGarage', 'search', 'detail', 'create', 'update', 'delete'],
    ADMIN: ['mobile', 'byGarage', 'search', 'detail', 'create', 'update', 'delete', 'all'],
  };
  const allowed = allowedByRole[role] || [];
  return allowed.includes(routeKey);
}
export function canAccessPaymentRoute(role, routeKey) {
  const allowedByRole = {
    CLIENT: ['byReservation'],
    GARAGE: ['byGarage', 'byStatus'],
    ADMIN: ['byReservation', 'byGarage', 'byStatus', 'initiate'],
  };
  const allowed = allowedByRole[role] || [];
  return allowed.includes(routeKey);
}
export function canAccessReservationRoute(role, routeKey) {
  const allowedByRole = {
    CLIENT: ['myReservations'],
    GARAGE: ['garageReservations', 'all'],
    ADMIN: ['myReservations', 'garageReservations', 'all'],
  };
  const allowed = allowedByRole[role] || [];
  return allowed.includes(routeKey);
}
export function canAccessNotificationRoute(role) {
  return !!role;
}
export default {
  PUBLIC_ROUTES,
  ADMIN_ROUTES,
  GARAGE_ROUTES_PROTECTED,
  CLIENT_ROUTES,
  getRoutesByRole,
  getRequiredRolesForRoute,
  canAccessRoute,
};
