import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const inputCls = 'w-full h-14 border-none outline-none rounded-full bg-white px-7 text-base text-[#5f5f5f] font-bold placeholder-[#c7c6ee] focus:shadow-[0_0_0_3px_rgba(190,190,255,0.55)]';

export const RegisterForm = ({ onLogin }) => {
  const registerUser = useAuthStore((s) => s.registerUser);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    const result = await registerUser(formData);
    if (result.success) { toast.success(result.message); onLogin(); return; }
    toast.error(result.error);
  };

  return (
    <section className='w-full max-w-[500px] bg-[#f3f3f3] rounded-[36px] px-[58px] pt-[34px] pb-9 shadow-[0_20px_70px_rgba(90,85,140,0.12)] min-h-[650px]'>
      <div className='text-center mb-[58px]'>
        <h1 className='m-0 text-[#c7c6ff] text-[56px] leading-none font-black'>Registrate</h1>
        <p className='mt-2 text-[#8a8a8a] text-[17px] font-extrabold'>Ingresa los datos que se te piden</p>
      </div>

      <form className='flex flex-col gap-7' onSubmit={handleSubmit(onSubmit)}>
        {[
          { name: 'firstName', placeholder: 'Nombres', rules: { required: 'El nombre es obligatorio', minLength: { value: 2, message: 'Mínimo 2 caracteres' } } },
          { name: 'surname', placeholder: 'Apellidos', rules: { required: 'El apellido es obligatorio', minLength: { value: 2, message: 'Mínimo 2 caracteres' } } },
          { name: 'username', placeholder: 'Usuario', rules: { required: 'El usuario es obligatorio', minLength: { value: 2, message: 'Mínimo 2 caracteres' } } },
        ].map(({ name, placeholder, rules }) => (
          <div key={name}>
            <input className={inputCls} type='text' placeholder={placeholder} {...register(name, { setValueAs: v => v.trim(), ...rules })} />
            {errors[name] && <span className='text-[#d14b6d] text-[13px] font-bold'>{errors[name].message}</span>}
          </div>
        ))}

        <div>
          <input className={inputCls} type='email' placeholder='Correo electrónico'
            {...register('email', { required: 'El correo es obligatorio', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' } })} />
          {errors.email && <span className='text-[#d14b6d] text-[13px] font-bold'>{errors.email.message}</span>}
        </div>

        <div>
          <input className={inputCls} type='password' placeholder='Contraseña'
            {...register('password', { required: 'La contraseña es obligatoria', minLength: { value: 8, message: 'Mínimo 8 caracteres' } })} />
          {errors.password && <span className='text-[#d14b6d] text-[13px] font-bold'>{errors.password.message}</span>}
        </div>

        {error && <p className='text-[#d14b6d] text-[13px] font-bold m-0'>{error}</p>}

        <button className='w-full h-14 border-none rounded-full bg-[#bfc3fb] text-white text-xl font-black cursor-pointer disabled:opacity-70'
          type='submit' disabled={loading}>
          {loading ? 'Creando...' : 'Crear cuenta'}
        </button>
      </form>

      <p className='text-center mt-6 text-[#6f6f6f] text-lg font-black'>
        ¿Ya tienes cuenta?{' '}
        <button className='border-none bg-transparent text-[#bdbdff] font-[inherit] cursor-pointer p-0' type='button' onClick={onLogin}>
          Inicia sesión
        </button>
      </p>
    </section>
  );
};