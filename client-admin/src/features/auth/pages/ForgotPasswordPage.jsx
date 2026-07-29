import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const ForgotPasswordPage = () => {
  const forgotPassword = useAuthStore((s) => s.forgotPassword);
  const loading = useAuthStore((s) => s.loading);
  const { register, handleSubmit } = useForm();

  const onSubmit = async ({ email }) => {
    const result = await forgotPassword(email);
    result.success ? toast.success(result.message) : toast.error(result.error);
  };

  return (
    <main className='min-h-screen flex items-center justify-center px-4 sm:px-6' style={{ background: 'var(--fw-gradient)' }}>
      <section className='w-full max-w-[400px] bg-[#f3f3f3] rounded-[22px] px-6 py-7 sm:px-9 sm:py-8 shadow-[0_20px_70px_rgba(90,85,140,0.12)] text-center'>
        <div className='mb-6 sm:mb-7'>
          <h1 className='m-0 text-[#c7c6ff] text-[26px] sm:text-[28px] leading-none font-black'>Recuperar</h1>
          <p className='mt-2 text-[#8a8a8a] text-sm font-extrabold'>Ingresa tu correo electrónico</p>
        </div>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          <input className='w-full h-11 border-none outline-none rounded-full bg-white px-5 text-sm text-[#5f5f5f] font-bold'
            type='email' placeholder='Correo electrónico' {...register('email', { required: true })} />
          <button className='w-full h-11 border-none rounded-full bg-[#bfc3fb] text-white text-base font-black cursor-pointer disabled:opacity-70'
            type='submit' disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar correo'}
          </button>
        </form>
        <Link className='block mt-4 text-[#bdbdff] text-sm font-black no-underline' to='/'>Volver al login</Link>
      </section>
    </main>
  );
};