import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { activateAccountRequest } from '../../../shared/apis';

export const ActivateAccountPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState({ title: 'Activando cuenta', message: 'Estamos validando tu enlace...', tone: 'loading' });

  useEffect(() => {
    activateAccountRequest(token)
      .then(res => setStatus({ title: res.data.alreadyActive ? 'Cuenta activa' : 'Cuenta activada', message: res.data.message, tone: 'success' }))
      .catch(() => setStatus({ title: 'Tu cuenta fue activada', message: 'Este enlace ya fue usado. Puedes iniciar sesión.', tone: 'success' }));
  }, [token]);

  return (
    <main className='min-h-screen flex items-center justify-center px-6' style={{ background: 'var(--fw-gradient)' }}>
      <section className='w-full max-w-[520px] bg-[#f3f3f3] rounded-[36px] px-[58px] py-9 shadow-[0_20px_70px_rgba(90,85,140,0.12)] text-center'>
        <div className='flex flex-col items-center gap-3.5 mb-7'>
          <span className={`w-14 h-14 grid place-items-center rounded-full text-[15px] font-black ${status.tone === 'success' ? 'bg-[#e8f8ef] text-[#23845a]' : 'bg-[#edefff] text-[#7378df]'}`}>
            {status.tone === 'success' ? 'OK' : '...'}
          </span>
          <h1 className='m-0 text-[#7f83e6] text-[40px] leading-none font-black'>{status.title}</h1>
          <p className='m-0 text-[#707070] text-[17px] font-extrabold leading-snug'>{status.message}</p>
        </div>
        <Link className='flex items-center justify-center w-full h-14 border-none rounded-full bg-[#bfc3fb] text-white text-xl font-black no-underline' to='/'>
          Ir al login
        </Link>
      </section>
    </main>
  );
};