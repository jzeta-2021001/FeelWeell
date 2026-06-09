import { Link } from 'react-router-dom';

export const UnauthorizedPage = () => (
  <main className='min-h-screen flex items-center justify-center px-6' style={{ background: 'var(--fw-gradient)' }}>
    <section className='w-full max-w-[520px] bg-[#f3f3f3] rounded-[36px] 
    px-[58px] py-9 shadow-[0_20px_70px_rgba(90,85,140,0.12)] text-center'>
      <div className='mb-7'>
        <h1 className='m-0 text-[#c7c6ff] 
        text-[56px] leading-none font-black'>
          Sin acceso</h1>
        <p className='mt-2 text-[#8a8a8a] 
        text-[17px] font-extrabold'>
          No tienes permiso para entrar aquí</p>
      </div>
      <Link className='text-center text-[#bdbdff] 
      text-[17px] font-black no-underline'
        to='/'>Volver</Link>
    </section>
  </main>
);