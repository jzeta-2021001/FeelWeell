import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export const RegisterForm = ({ onLogin }) => {
  const registerUser = useAuthStore((state) => state.registerUser);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const result = await registerUser(formData);

    if (result.success) {
      toast.success(result.message);
      onLogin();
      return;
    }

    toast.error(result.error);
  };

  return (
    <section className="auth-card register-card">
      <div className="register-title">
        <h1>Registrate</h1>
        <p>Ingresa los datos que se te piden</p>
      </div>

      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Nombres"
          {...register("firstName", {
            setValueAs: (value) => value.trim(),
            required: "El nombre es obligatorio",
            minLength: {
              value: 2,
              message: "Minimo 2 caracteres",
            },
            maxLength: {
              value: 35,
              message: "Maximo 35 caracteres",
            },
          })}
        />
        {errors.firstName && <span>{errors.firstName.message}</span>}

        <input
          type="text"
          placeholder="Apellidos"
          {...register("surname", {
            setValueAs: (value) => value.trim(),
            required: "El apellido es obligatorio",
            minLength: {
              value: 2,
              message: "Minimo 2 caracteres",
            },
            maxLength: {
              value: 35,
              message: "Maximo 35 caracteres",
            },
          })}
        />
        {errors.surname && <span>{errors.surname.message}</span>}

        <input
          type="text"
          placeholder="Usuario"
          {...register("username", {
            setValueAs: (value) => value.trim(),
            required: "El usuario es obligatorio",
            minLength: {
              value: 2,
              message: "Minimo 2 caracteres",
            },
            maxLength: {
              value: 40,
              message: "Maximo 40 caracteres",
            },
          })}
        />
        {errors.username && <span>{errors.username.message}</span>}

        <input
          type="email"
          placeholder="Correo electronico"
          {...register("email", {
            setValueAs: (value) => value.trim(),
            required: "El correo es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Ingresa un correo valido",
            },
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}

        <input
          type="password"
          placeholder="Contraseña"
          {...register("password", {
            required: "La contraseña es obligatoria",
            minLength: {
              value: 8,
              message: "Minimo 8 caracteres",
            },
          })}
        />
        {errors.password && <span>{errors.password.message}</span>}

        {error && <p className="form-error">{error}</p>}

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>

      <p className="switch-text register-switch">
        Ya tienes cuenta?{" "}
        <button type="button" onClick={onLogin}>
          Inicia sesion
        </button>
      </p>
    </section>
  );
};
