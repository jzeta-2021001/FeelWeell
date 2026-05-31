import { Link } from "react-router-dom";
import { LogOut, Shield, UserRound, KeyRound } from "lucide-react";
import { useAuthStore } from "../../features/auth/store/authStore";

export const DashboardLayout = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <span className="dashboard-brand-mark">FW</span>
          <div>
            <h1>FeelWeell</h1>
            <p>Panel principal</p>
          </div>
        </div>

        <nav className="dashboard-nav" aria-label="Navegacion principal">
          <Link className="dashboard-nav-link active" to="/dashboard">
            <UserRound size={18} />
            Inicio
          </Link>

          <Link className="dashboard-nav-link" to="/change-password">
            <KeyRound size={18} />
            Cambiar contraseña
          </Link>
        </nav>

        <button className="dashboard-logout" type="button" onClick={logout}>
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-kicker">Dashboard</p>
            <h2>Bienvenido, {user?.firstName || "usuario"}</h2>
          </div>

          <div className="dashboard-role">
            <Shield size={18} />
            {user?.role || "Sin rol"}
          </div>
        </header>

        <section className="dashboard-panel">
          <h3>Resumen de cuenta</h3>
          <div className="dashboard-grid">
            <article className="dashboard-stat">
              <span>Usuario</span>
              <strong>{user?.username || "No disponible"}</strong>
            </article>

            <article className="dashboard-stat">
              <span>Correo</span>
              <strong>{user?.email || "No disponible"}</strong>
            </article>

            <article className="dashboard-stat">
              <span>Rol</span>
              <strong>{user?.role || "No disponible"}</strong>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
};
