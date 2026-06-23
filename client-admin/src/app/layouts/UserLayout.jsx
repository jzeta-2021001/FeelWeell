import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore';
import { UserContainer } from '../../shared/components/layouts/UserContainer';
import { InitialQuestionnaireModal } from '../../features/mood/components/InitialQuestionnaireModal';

export const UserLayout = () => {
  const { logout } = useAuthStore();
  const [questionnaireChecked, setQuestionnaireChecked] = useState(false);

  return (
    <>
      {!questionnaireChecked && (
        <InitialQuestionnaireModal onComplete={() => setQuestionnaireChecked(true)} />
      )}
      <UserContainer onLogout={logout}>
        <Outlet />
      </UserContainer>
    </>
  );
};