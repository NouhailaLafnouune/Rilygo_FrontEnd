import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/admin/Dashboard";
import { AuthProvider } from './contexts/AuthContext';
import Garages from "./pages/admin/Garages";
import Clients from "./pages/admin/Clients";
import Reservations from "./pages/admin/Reservations";
import Payments from "./pages/admin/Payments";
import Services from "./pages/admin/Services";
import Contenu from "./pages/admin/Contenu";
import Notifications from "./pages/admin/Notifications";
import Settings from "./pages/admin/Settings";
import Garagiste from "./pages/Garagiste/Garagiste";
import Employes from "./pages/Garagiste/Employes";
import Missions from "./pages/Missions";
import AdminLayout from "./layouts/Layout";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Register from "./pages/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import NotFound from "./pages/NotFound.jsx";
import Avis from "./pages/Avis.jsx";
import Messages from "./pages/Messages.jsx";
import Profil from "./pages/Profil.jsx";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route
                        element={
                            <ProtectedRoute>
                                <AdminLayout/>
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/garages" element={<Garages />} />
                        <Route path="/clients" element={<Clients />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/reservations" element={<Reservations />} />
                        <Route path="/paiements" element={<Payments />} />
                        <Route path="/avis" element={<Avis />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/profil" element={<Profil />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/contenu" element={<Contenu />} />
                        <Route path="/parametres" element={<Settings />} />
                        <Route path="/garagiste" element={<Garagiste />} />
                        <Route path="/employes" element={<Employes />} />
                        <Route path="/missions" element={<Missions />} />
                    </Route>
                    {/* 404 Not Found - Catch all routes */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
export default App;
