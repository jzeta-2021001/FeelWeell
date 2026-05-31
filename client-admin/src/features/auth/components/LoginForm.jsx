import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import logo from "../../../assets/img/FeellWeellLogo.png";

export const LoginForm = ({ onRegister }) => {
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const result = await login(formData);

    //Temporal mientras se hace el dashboard, que se encargará Zeta, Esdras y Sebas.
    if (result.success) {
      toast.success("Bienvenido a FeelWeell");
      navigate("/dashboard");
      return;
    }

    toast.error(result.error);
  };

  return (
    <section className="auth-card login-card">
      <div className="brand">
        <img className="brand-logo-img" src={logo} alt="FeelWeell" />
        <h1>FeelWeell</h1>
        <p>Tu espacio de bienestar emocional</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Correo o usuario</label>
          <input
            type="text"
            {...register("username", {
              required: "El correo o usuario es obligatorio",
            })}
          />
          {errors.username && <span>{errors.username.message}</span>}
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
            })}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        {error && <p className="form-error">{error}</p>}

        <Link className="forgot-link" to="/forgot-password">
          ¿Olvidaste tu contraseña?
        </Link>

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? "Iniciando..." : "Iniciar sesión"}
        </button>
      </form>

      <div className="divider">
        <span></span>
        <p>o</p>
        <span></span>
      </div>

      <p className="switch-text">
        ¿No tienes cuenta?{" "}
        <button type="button" onClick={onRegister}>
          Regístrate aquí
        </button>
      </p>
    </section>
  );
};