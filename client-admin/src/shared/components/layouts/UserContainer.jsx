import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserSidebar } from './UserSidebar';
import { useAuthStore } from '../../../features/auth/store/authStore';
import { getStreak } from '../../apis/streak';
import { useNotificationCenter } from '../../../features/notifications/hooks/useNotificationCenter.js';

const PATH_TO_LABEL = {
  '/home': 'Inicio',
  '/home/exercises': 'Ejercicios',
  '/home/chat': 'Chat',
  '/home/notifications': 'Notificaciones',
  '/home/retos': 'Retos Pendientes',
};

export const UserContainer = ({ onLogout, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extraer información del usuario en sesión
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  
  const activeLabel = PATH_TO_LABEL[location.pathname] ?? 'Inicio';
  const { unread } = useNotificationCenter();

  // Estado para el indicador del sidebar
  const [hasPendingChallenge, setHasPendingChallenge] = useState(true);

  // Controladores de estado de vista
  const isChat = location.pathname === '/home/chat';

  // Sincronización del estado del reto con el LocalStorage y el Sidebar
  useEffect(() => {
    const checkChallengeStatus = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const storageKey = `fw_challenge_completed_${user?.id || user?._id}_${todayStr}`;
        const isCompleted = localStorage.getItem(storageKey) === 'true';
        setHasPendingChallenge(!isCompleted);
    };

    checkChallengeStatus();
    
    // Escuchar el evento que dispara el widget cuando se completa el reto
    window.addEventListener('challengeCompleted', checkChallengeStatus);
    return () => window.removeEventListener('challengeCompleted', checkChallengeStatus);
  }, [user]);

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
      {/* Pasamos el estado hasPendingChallenge al Sidebar */}
      <UserSidebar 
        active={activeLabel} 
        unreadCount={unread} 
        hasPendingChallenge={hasPendingChallenge}
        onNavigate={handleNavigate} 
        onLogout={onLogout} 
      />
      <main
        className={isChat ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}
        style={isChat ? { height: '100vh' } : { padding: 'clamp(20px,3vw,40px)' }}
      >
        {isChat ? (
            children 
        ) : (
            <div style={{ padding: 'clamp(20px,3vw,40px)' }}>
                {children}
            </div>
        )}
      </main>
    </div>
  );
};