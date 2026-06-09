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
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--fw-gradient)' }}
    >
      <section className="w-full max-w-[520px] bg-[#f3f3f3] rounded-[36px] px-[58px] py-9 shadow-[0_20px_70px_rgba(90,85,140,0.12)] text-center">
        <div className="flex flex-col items-center gap-4 mb-8">
          <img
            src={logo}
            alt="FeelWeell"
            className="w-[90px] h-[76px] object-contain"
          />

          <span
            className={`w-14 h-14 grid place-items-center rounded-full text-[15px] font-black ${
              status === 'loading'
                ? 'bg-[#edefff] text-[#7378df]'
                : 'bg-[#e8f8ef] text-[#23845a]'
            }`}
          >
            {status === 'loading' ? '...' : 'OK'}
          </span>

          <h1 className="m-0 text-[#7f83e6] text-[36px] leading-none font-black">
            {status === 'loading' ? 'Activando cuenta' : '¡Cuenta activada!'}
          </h1>

          <p
            className="m-0 text-[#707070] text-[17px] font-extrabold leading-snug"
            aria-live="polite"
          >
            {displayMessage}
          </p>

          {status !== 'loading' && (
            <p className="m-0 text-[#9a9a9a] text-sm">
              Redirigiendo al login en unos segundos…
            </p>
          )}
        </div>

        <Link
          className="flex items-center justify-center w-full h-14 border-none rounded-full bg-[#bfc3fb] text-white text-xl font-black no-underline"
          to="/"
        >
          Ir al login
        </Link>
      </section>
    </main>
  );
};
