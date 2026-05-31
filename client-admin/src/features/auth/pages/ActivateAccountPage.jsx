import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { activateAccountRequest } from "../../../shared/apis";
import "../../../style/index.css";

export const ActivateAccountPage = () => {
  const { token } = useParams();

  const [status, setStatus] = useState({
    title: "Activando cuenta",
    message: "Estamos validando tu enlace...",
    tone: "loading",
  });

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await activateAccountRequest(token);
        setStatus({
          title: response.data.alreadyActive ? "Cuenta activa" : "Cuenta activada",
          message: response.data.message,
          tone: "success",
        });
      } catch (error) {
        setStatus({
          title: "Tu cuenta fue activada",
          message: "Este enlace ya fue usado. Puedes continuar e iniciar sesion.",
          tone: "success",
        });
      }
    };

    activateAccount();
  }, [token]);

  return (
    <main className="auth-screen">
      <section className="auth-card small-card">
        <div className={`activation-state activation-state-${status.tone}`}>
          <span className="activation-icon">
            {status.tone === "success" ? "OK" : status.tone === "warning" ? "!" : "..."}
          </span>
          <h1>{status.title}</h1>
          <p>{status.message}</p>
        </div>

        <Link className="auth-button auth-link-button" to="/">
          Ir al login
        </Link>
      </section>
    </main>
  );
};
