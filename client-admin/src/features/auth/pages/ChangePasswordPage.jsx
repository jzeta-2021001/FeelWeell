import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const changePassword = useAuthStore((s) => s.changePassword);
  const loading = useAuthStore((s) => s.loading);
  const { register, handleSubmit, watch } = useForm();
  const newPassword = watch('newPassword');

  const onSubmit = async ({ currentPassword, newPassword }) => {
    const result = await changePassword({ currentPassword, newPassword });
    if (result.success) { toast.success(result.message); navigate('/dashboard'); return; }
    toast.error(result.error);
  };

  return (
    <main className='min-h-screen flex items-center justify-center px-6' style={{ background: 'var(--fw-gradient)' }}>
      <section className='w-full max-w-[520px] bg-[#f3f3f3] rounded-[36px] px-[58px] py-9 shadow-[0_20px_70px_rgba(90,85,140,0.12)] text-center'>
        <div className='mb-[58px]'>
          <h1 className='m-0 text-[#c7c6ff] text-[56px] leading-none font-black'>Cambiar clave</h1>
          <p className='mt-2 text-[#8a8a8a] text-[17px] font-extrabold'>Actualiza tu contraseña</p>
        </div>
        <form className='flex flex-col gap-7' onSubmit={handleSubmit(onSubmit)}>
          <input className='w-full h-14 border-none outline-none rounded-full bg-white px-7 text-base text-[#5f5f5f] font-bold'
            type='password' placeholder='Contraseña actual' {...register('currentPassword', { required: true })} />
          <input className='w-full h-14 border-none outline-none rounded-full bg-white px-7 text-base text-[#5f5f5f] font-bold'
            type='password' placeholder='Nueva contraseña' {...register('newPassword', { required: true, minLength: 8 })} />
          <input className='w-full h-14 border-none outline-none rounded-full bg-white px-7 text-base text-[#5f5f5f] font-bold'
            type='password' placeholder='Confirmar contraseña'
            {...register('confirmPassword', { required: true, validate: v => v === newPassword || 'Las contraseñas no coinciden' })} />
          <button className='w-full h-14 border-none rounded-full bg-[#bfc3fb] text-white text-xl font-black cursor-pointer disabled:opacity-70'
            type='submit' disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </form>
        <Link className='block mt-4 text-[#bdbdff] text-[17px] font-black no-underline' to='/'>Volver</Link>
      </section>
    </main>
  );
};