import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore';
import { UserContainer } from '../../shared/components/layouts/UserContainer';

export const UserLayout = () => {
    const { logout } = useAuthStore();

    return (
        <UserContainer onLogout={logout}>
            <Outlet />
        </UserContainer>
    );
};