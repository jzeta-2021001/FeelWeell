import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "../../../style/index.css";

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const resetPassword = useAuthStore((state) => state.resetPassword);
  const loading = useAuthStore((state) => state.loading);

  const { register, handleSubmit, watch } = useForm();
  const newPassword = watch("newPassword");

  const onSubmit = async ({ newPassword }) => {
    const result = await resetPassword({ token, newPassword });

    if (result.success) {
      toast.success(result.message);
      navigate("/");
      return;
    }

    toast.error(result.error);
  };

  return (
    <main className="auth-screen">
      <section className="auth-card small-card">
        <div className="register-title">
          <h1>Nueva clave</h1>
          <p>Escribe tu nueva contraseña</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            {...register("newPassword", {
              required: true,
              minLength: 8,
            })}
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            {...register("confirmPassword", {
              required: true,
              validate: (value) =>
                value === newPassword || "Las contraseñas no coinciden",
            })}
          />

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </form>

        <Link className="forgot-link" to="/">
          Volver al login
        </Link>
      </section>
    </main>
  );
};
