import { useNavigate, useLocation } from 'react-router-dom';
import { UserSidebar } from './UserSidebar';

const PATH_TO_LABEL = {
  '/home': 'Inicio',
  '/home/chat': 'Chat',
  '/home/retos': 'Retos Pendientes',
  '/home/configuraciones': 'Configuraciones',
};

export const UserContainer = ({ onLogout, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeLabel = PATH_TO_LABEL[location.pathname] ?? 'Inicio';
  const handleNavigate = (label) => {
    const entry = Object.entries(PATH_TO_LABEL).find(([, v]) => v === label);
    if (entry) navigate(entry[0]);
  };

  return (
    <div className='min-h-screen grid' style={{ gridTemplateColumns: '280px 1fr', background: 'var(--fw-user-gradient)' }}>
      <UserSidebar active={activeLabel} onNavigate={handleNavigate} onLogout={onLogout} />
      <main className='overflow-y-auto' style={{ padding: 'clamp(20px,3vw,40px)' }}>{children}</main>
    </div>
  );
};