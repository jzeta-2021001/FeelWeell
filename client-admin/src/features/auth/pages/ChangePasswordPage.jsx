import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "../../../style/index.css";

export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const changePassword = useAuthStore((state) => state.changePassword);
  const loading = useAuthStore((state) => state.loading);

  const { register, handleSubmit, watch } = useForm();
  const newPassword = watch("newPassword");

  const onSubmit = async ({ currentPassword, newPassword }) => {
    const result = await changePassword({ currentPassword, newPassword });

    if (result.success) {
      toast.success(result.message);
      navigate("/dashboard");
      return;
    }

    toast.error(result.error);
  };

  return (
    <main className="auth-screen">
      <section className="auth-card small-card">
        <div className="register-title">
          <h1>Cambiar clave</h1>
          <p>Actualiza tu contraseña</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="password"
            placeholder="Contraseña actual"
            {...register("currentPassword", { required: true })}
          />

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
            {loading ? "Guardando..." : "Guardar contraseña"}
          </button>
        </form>

        <Link className="forgot-link" to="/">
          Volver
        </Link>
      </section>
    </main>
  );
};
