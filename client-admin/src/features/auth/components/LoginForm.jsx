import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import logo from '../../../assets/img/FeellWeellLogo.png';

export const LoginForm = ({ onRegister }) => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (formData) => {
    useAuthStore.setState({ error: null });
    const result = await login(formData);
    if (result.success) {
      toast.success('Bienvenido a FeelWeell');
      navigate(result.role === 'USER_ROLE' ? '/home' : '/dashboard');
      return;
    }
    toast.error(result.error);
  };

  return (
    <section className='w-full max-w-[400px] bg-[#f3f3f3] rounded-[22px] px-6 py-7 shadow-[0_20px_70px_rgba(90,85,140,0.12)] sm:px-9 sm:py-8'>
      <div className='text-center mb-7 sm:mb-8'>
        <img src={logo} alt='FeelWeell' className='w-[100px] h-[60px] object-contain block mx-auto mb-2' />
        <h1 className='m-0 text-[#c7c6ff] text-2xl font-black'>FeelWeell</h1>
        <p className='mt-0.5 text-[#6f6f6f] text-sm font-extrabold'>Tu espacio de bienestar emocional</p>
      </div>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-1.5'>
          <label className='text-[#707070] text-sm font-extrabold pl-2'>Correo o usuario</label>
          <input className='w-full h-11 border-none outline-none rounded-full bg-white px-5 text-sm text-[#5f5f5f] font-bold focus:shadow-[0_0_0_3px_rgba(190,190,255,0.55)]'
            type='text' {...register('username', { required: 'El correo o usuario es obligatorio' })} />
          {errors.username && <span className='text-[#d14b6d] text-xs font-bold'>{errors.username.message}</span>}
        </div>

        <div className='flex flex-col gap-1.5'>
          <label className='text-[#707070] text-sm font-extrabold pl-2'>Contraseña</label>
          <div className='relative'>
            <input className='w-full h-11 border-none outline-none rounded-full bg-white pl-5 pr-11 text-sm text-[#5f5f5f] font-bold focus:shadow-[0_0_0_3px_rgba(190,190,255,0.55)]'
              type={showPassword ? 'text' : 'password'} {...register('password', { required: 'La contraseña es obligatoria' })} />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-4 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer text-gray-400 hover:text-gray-600 transition-colors'
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && <span className='text-[#d14b6d] text-xs font-bold'>{errors.password.message}</span>}
        </div>

        {error && <p className='text-[#d14b6d] text-xs font-bold m-0'>{error}</p>}

        <Link className='text-center text-[#bdbdff] text-sm font-black no-underline mt-1' to='/forgot-password'>
          ¿Olvidaste tu contraseña?
        </Link>

        <button className='w-full h-11 border-none rounded-full bg-[#bfc3fb] text-white text-base font-black cursor-pointer disabled:opacity-70'
          type='submit' disabled={loading}>
          {loading ? 'Iniciando...' : 'Iniciar sesión'}
        </button>
      </form>

      <div className='flex items-center gap-3 my-5 mx-2.5'>
        <span className='flex-1 h-px bg-[#d9e0ee]' />
        <p className='m-0 text-[#777] text-sm font-black'>o</p>
        <span className='flex-1 h-px bg-[#d9e0ee]' />
      </div>

      <p className='text-center m-0 text-[#6f6f6f] text-sm font-black'>
        ¿No tienes cuenta?{' '}
        <button className='border-none bg-transparent text-[#bdbdff] font-[inherit] cursor-pointer p-0' type='button' onClick={onRegister}>
          Regístrate aquí
        </button>
      </p>
    </section>
  );
};