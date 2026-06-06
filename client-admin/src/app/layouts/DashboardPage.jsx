import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore';
import { DashboardContainer } from '../../shared/components/layouts/DashboardContainer';

export const DashboardPage = () => {
  const { user, logout } = useAuthStore();

  return (
    <DashboardContainer user={user} onLogout={logout}>
      <Outlet />
    </DashboardContainer>
  );
};