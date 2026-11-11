import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  if (!currentUser.emailVerified) {
    return <Navigate to="/verify-email" />;
  }
  return <>{children}</>;
}