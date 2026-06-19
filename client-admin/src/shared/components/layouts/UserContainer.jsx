import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserSidebar } from './UserSidebar';
import { useAuthStore } from '../../../features/auth/store/authStore';
import { getStreak } from '../../apis/streak';

const PATH_TO_LABEL = {
  '/home': 'Inicio',
  '/home/exercises': 'Ejercicios',
  '/home/chat': 'Chat',
  '/home/retos': 'Retos Pendientes',
  '/home/configuraciones': 'Configuraciones',
};

export const UserContainer = ({ onLogout, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const updateUser = useAuthStore((s) => s.updateUser);
  const activeLabel = PATH_TO_LABEL[location.pathname] ?? 'Inicio';

  const handleNavigate = (label) => {
    const entry = Object.entries(PATH_TO_LABEL).find(([, v]) => v === label);
    if (entry) navigate(entry[0]);
  };

  useEffect(() => {
    getStreak()
      .then(({ data }) => {
        const currentStreak = data?.currentStreak ?? 0;
        updateUser({ streak: currentStreak });
      })
      .catch((err) => {
        console.error('[UserContainer] Error al obtener racha:', err.message);
      });
  }, [updateUser]);

  return (
    <div className='min-h-screen grid' style={{ gridTemplateColumns: '280px 1fr', background: 'var(--fw-user-gradient)' }}>
      <UserSidebar active={activeLabel} onNavigate={handleNavigate} onLogout={onLogout} />
      <main className='overflow-y-auto' style={{ padding: 'clamp(20px,3vw,40px)' }}>{children}</main>
    </div>
  );
};