import { useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import logo from '../../../assets/img/FeellWeellLogo.png';

export const ActivateAccountPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const handleFinish = useCallback(() => {
    setTimeout(() => navigate('/'), 2000);
  }, [navigate]);

  const { status, message } = useVerifyEmail(token, handleFinish);

  const displayMessage =
    status === 'loading' ? 'Verificando tu enlace de activación, por favor espera...' : message;

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 sm:px-6"
      style={{ background: 'var(--fw-gradient)' }}
    >
      <section className="w-full max-w-[400px] bg-[#f3f3f3] rounded-[22px] px-6 py-7 sm:px-9 sm:py-8 shadow-[0_20px_70px_rgba(90,85,140,0.12)] text-center">
        <div className="flex flex-col items-center gap-3 mb-6">
          <img src={logo} alt="FeelWeell" className="w-[54px] h-[46px] object-contain" />

          <span
            className={`w-11 h-11 grid place-items-center rounded-full text-xs font-black ${status === 'loading'
                ? 'bg-[#edefff] text-[#7378df]'
                : 'bg-[#e8f8ef] text-[#23845a]'
              }`}
          >
            {status === 'loading' ? '...' : 'OK'}
          </span>

          <h1 className="m-0 text-[#7f83e6] text-xl sm:text-[22px] leading-tight font-black">
            {status === 'loading' ? 'Activando cuenta' : '¡Cuenta activada!'}
          </h1>

          <p className="m-0 text-[#707070] text-sm font-extrabold leading-snug" aria-live="polite">
            {displayMessage}
          </p>

          {status !== 'loading' && (
            <p className="m-0 text-[#9a9a9a] text-xs">
              Redirigiendo al login en unos segundos…
            </p>
          )}
        </div>

        <Link
          className="flex items-center justify-center w-full h-11 border-none rounded-full bg-[#bfc3fb] text-white text-base font-black no-underline"
          to="/"
        >
          Ir al login
        </Link>
      </section>
    </main>
  );
};