import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";

export const ProtectedRoutes = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoadingAuth = useAuthStore((state) => state.isLoadingAuth);

  if (isLoadingAuth) return <p>Cargando...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};