import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import logo from '../../../assets/img/FeellWeellLogo.png';

export const LoginForm = ({ onRegister }) => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const { register, handleSubmit, formState: { errors } } = useForm();

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
    <section className='w-full max-w-[520px] bg-[#f3f3f3] rounded-[36px] px-[58px] py-9 shadow-[0_20px_70px_rgba(90,85,140,0.12)] min-h-[600px]'>
      <div className='text-center mb-[70px]'>
        <img src={logo} alt='FeelWeell' className='w-[130px] h-[110px] object-contain block mx-auto mb-2' />
        <h1 className='m-0 text-[#c7c6ff] text-[32px] font-black'>FeelWeell</h1>
        <p className='mt-0.5 text-[#6f6f6f] text-lg font-extrabold'>Tu espacio de bienestar emocional</p>
      </div>

      <form className='flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-2.5'>
          <label className='text-[#707070] text-lg font-extrabold pl-2'>Correo o usuario</label>
          <input className='w-full h-14 border-none outline-none rounded-full bg-white px-7 text-base text-[#5f5f5f] font-bold focus:shadow-[0_0_0_3px_rgba(190,190,255,0.55)]'
            type='text' {...register('username', { required: 'El correo o usuario es obligatorio' })} />
          {errors.username && <span className='text-[#d14b6d] text-[13px] font-bold'>{errors.username.message}</span>}
        </div>

        <div className='flex flex-col gap-2.5'>
          <label className='text-[#707070] text-lg font-extrabold pl-2'>Contraseña</label>
          <input className='w-full h-14 border-none outline-none rounded-full bg-white px-7 text-base text-[#5f5f5f] font-bold focus:shadow-[0_0_0_3px_rgba(190,190,255,0.55)]'
            type='password' {...register('password', { required: 'La contraseña es obligatoria' })} />
          {errors.password && <span className='text-[#d14b6d] text-[13px] font-bold'>{errors.password.message}</span>}
        </div>

        {error && <p className='text-[#d14b6d] text-[13px] font-bold m-0'>{error}</p>}

        <Link className='text-center text-[#bdbdff] text-[17px] font-black no-underline mt-2.5' to='/forgot-password'>
          ¿Olvidaste tu contraseña?
        </Link>

        <button className='w-full h-14 border-none rounded-full bg-[#bfc3fb] text-white text-xl font-black cursor-pointer disabled:opacity-70'
          type='submit' disabled={loading}>
          {loading ? 'Iniciando...' : 'Iniciar sesión'}
        </button>
      </form>

      <div className='flex items-center gap-3 my-6 mx-2.5'>
        <span className='flex-1 h-px bg-[#d9e0ee]' />
        <p className='m-0 text-[#777] font-black'>o</p>
        <span className='flex-1 h-px bg-[#d9e0ee]' />
      </div>

      <p className='text-center m-0 text-[#6f6f6f] text-lg font-black'>
        ¿No tienes cuenta?{' '}
        <button className='border-none bg-transparent text-[#bdbdff] font-[inherit] cursor-pointer p-0' type='button' onClick={onRegister}>
          Regístrate aquí
        </button>
      </p>
    </section>
  );
};