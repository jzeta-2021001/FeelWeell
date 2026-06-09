// Valida el token de activación de cuenta (correo de bienvenida).
// Usa Map-cache para evitar doble request en React StrictMode.
import { useState, useEffect } from 'react';
import { activateAccount as activateAccountRequest } from '../../../shared/apis';
import { showError, showSuccess } from '../../../shared/utils/toast.js';

const verifyPromiseByToken = new Map();
const verifyResultByToken = new Map();
const toastShownByToken = new Map();
const finishCalledByToken = new Map();

export const useVerifyEmail = (token, onFinish) => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token inválido.');
        if (!toastShownByToken.get('invalid-token')) {
          showError('Token inválido.');
          toastShownByToken.set('invalid-token', true);
        }
        if (!finishCalledByToken.get('invalid-token')) {
          finishCalledByToken.set('invalid-token', true);
          onFinish?.();
        }
        return;
      }

      // Reusar resultado cacheado si ya se resolvió
      const cached = verifyResultByToken.get(token);
      if (cached) {
        if (!toastShownByToken.get(token)) {
          toastShownByToken.set(token, true);
          cached.status === 'success'
            ? showSuccess('¡Cuenta activada correctamente!')
            : showError(cached.message);
        }
        if (!finishCalledByToken.get(token)) {
          finishCalledByToken.set(token, true);
          onFinish?.();
        }
        if (isMounted) {
          setStatus(cached.status);
          setMessage(cached.message);
        }
        return;
      }

      // Reusar promesa en curso para este token (evita doble llamada en StrictMode)
      let promise = verifyPromiseByToken.get(token);
      if (!promise) {
        promise = activateAccountRequest(token)
          .then((res) => {
            const successMessage =
              res.data?.alreadyActive
                ? 'Tu cuenta ya estaba activa. Serás redirigido al login...'
                : 'Tu cuenta ha sido activada. Serás redirigido al login...';
            const result = { status: 'success', message: successMessage };
            verifyResultByToken.set(token, result);
            return result;
          })
          .catch(() => {
            // El token ya fue usado o expiró — la cuenta probablemente ya está activa
            const result = {
              status: 'success',
              message: 'Este enlace ya fue usado. Puedes iniciar sesión.',
            };
            verifyResultByToken.set(token, result);
            return result;
          })
          .finally(() => {
            verifyPromiseByToken.delete(token);
          });

        verifyPromiseByToken.set(token, promise);
      }

      const result = await promise;

      if (isMounted) {
        setStatus(result.status);
        setMessage(result.message);
      }

      if (!toastShownByToken.get(token)) {
        toastShownByToken.set(token, true);
        result.status === 'success'
          ? showSuccess('¡Cuenta activada correctamente!')
          : showError(result.message);
      }

      if (!finishCalledByToken.get(token)) {
        finishCalledByToken.set(token, true);
        onFinish?.();
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [token, onFinish]);

  return { status, message };
};
