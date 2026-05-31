import { Link } from "react-router-dom";
import "../../../style/index.css";

export const UnauthorizedPage = () => {
  return (
    <main className="auth-screen">
      <section className="auth-card small-card">
        <div className="register-title">
          <h1>Sin acceso</h1>
          <p>No tienes permiso para entrar aqui</p>
        </div>

        <Link className="forgot-link" to="/">
          Volver
        </Link>
      </section>
    </main>
  );
};
