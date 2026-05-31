import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "../../../style/index.css";

export const ForgotPasswordPage = () => {
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const loading = useAuthStore((state) => state.loading);

  const { register, handleSubmit } = useForm();

  const onSubmit = async ({ email }) => {
    const result = await forgotPassword(email);

    if (result.success) {
      toast.success(result.message);
      return;
    }

    toast.error(result.error);
  };

  return (
    <main className="auth-screen">
      <section className="auth-card small-card">
        <div className="register-title">
          <h1>Recuperar</h1>
          <p>Ingresa tu correo electronico</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Correo Electronico"
            {...register("email", { required: true })}
          />

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar correo"}
          </button>
        </form>

        <Link className="forgot-link" to="/">
          Volver al login
        </Link>
      </section>
    </main>
  );
};
