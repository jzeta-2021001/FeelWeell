import { Link } from 'react-router-dom';

export const UnauthorizedPage = () => (
  <main className='min-h-screen flex items-center justify-center px-4 sm:px-6' style={{ background: 'var(--fw-gradient)' }}>
    <section className='w-full max-w-[400px] bg-[#f3f3f3] rounded-[22px] px-6 py-7 sm:px-9 sm:py-8 shadow-[0_20px_70px_rgba(90,85,140,0.12)] text-center'>
      <div className='mb-5'>
        <h1 className='m-0 text-[#c7c6ff] text-[26px] sm:text-[28px] leading-none font-black'>
          Sin acceso</h1>
        <p className='mt-2 text-[#8a8a8a] text-sm font-extrabold'>
          No tienes permiso para entrar aquí</p>
      </div>
      <Link className='text-center text-[#bdbdff] text-sm font-black no-underline'
        to='/'>Volver</Link>
    </section>
  </main>
);