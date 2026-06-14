import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '../../features/auth/pages/AuthPage';
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage';
import { ActivateAccountPage } from '../../features/auth/pages/ActivateAccountPage';
import { ChangePasswordPage } from '../../features/auth/pages/ChangePasswordPage';
import { UnauthorizedPage } from '../../features/auth/pages/UnauthorizedPage';
import { ProtectedRoutes } from './ProtectedRoutes';
import { RoleGuard } from './RoleGuard';
import { UserLayout } from '../layouts/UserLayout';
import { DashboardPage } from '../layouts/DashboardPage';
import { UserAdminPage } from '../../features/users/pages/UserAdminPage.jsx';
import { PanelPage } from '../../features/dashboard/pages/PanelPage';
import { ExercisesPage } from '../../features/dashboard/pages/ExercisesPage';
import { ContentPage } from '../../features/dashboard/pages/ContentPage';
import { UserPage } from '../../features/users/pages/UserPage';
import { MotivationalPage } from '../../features/dashboard/pages/MotivationalPage';
import { MoodTrackingPage } from '../../features/dashboard/pages/MoodTrackingPage';
import { ChatPage } from '../../features/chat/pages/ChatPage.jsx';
import { ExercisesAdminPage } from '../../features/exercises/page/ExercisesAdminPage.jsx';
import { ContentsAdminPage } from '../../features/contents/pages/ContentsAdminPage.jsx';

const ADMIN_ROLES = [
  'ADMIN_ROLE',
  'ADMIN_USERS_ROLE',
  'ADMIN_MOODTRACKING_ROLE',
  'ADMIN_HEALTHY_ROLE',
];

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Públicas ── */}
      <Route path='/' element={<AuthPage />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      <Route path='/reset-password/:token' element={<ResetPasswordPage />} />
      <Route path='/activate/:token' element={<ActivateAccountPage />} />
      <Route path='/unauthorized' element={<UnauthorizedPage />} />

      {/* ── Vista USER_ROLE ── */}
      <Route
        path='/home'
        element={
          <ProtectedRoutes>
            <RoleGuard allowedRoles={['USER_ROLE']}>
              <UserLayout />
            </RoleGuard>
          </ProtectedRoutes>
        }
      >
        <Route index element={<UserPage />} />
        <Route path='chat' element={<ChatPage />} />
      </Route>

      {/* ── Vista ADMIN ── */}
      <Route
        path='/dashboard/*'
        element={
          <ProtectedRoutes>
            <RoleGuard allowedRoles={ADMIN_ROLES}>
              <DashboardPage />
            </RoleGuard>
          </ProtectedRoutes>
        }
      >
        <Route index element={<Navigate to='panel' replace />} />
        <Route path='panel' element={<PanelPage />} />
        <Route
          path='users'
          element={
            <RoleGuard allowedRoles={['ADMIN_ROLE', 'ADMIN_USERS_ROLE']}>
              <UserAdminPage />
            </RoleGuard>
          }
        />
        <Route
          path='exercises'
          element={
            <RoleGuard allowedRoles={['ADMIN_ROLE', 'ADMIN_HEALTHY_ROLE']}>
              <ExercisesAdminPage />
            </RoleGuard>
          }
        />
        <Route
          path='content'
          element={
            <RoleGuard allowedRoles={['ADMIN_ROLE', 'ADMIN_HEALTHY_ROLE']}>
              <ContentsAdminPage />
            </RoleGuard>
          }
        />
        <Route
          path='motivational'
          element={
            <RoleGuard allowedRoles={['ADMIN_ROLE', 'ADMIN_MOODTRACKING_ROLE']}>
              <MotivationalPage />
            </RoleGuard>
          }
        />
        <Route
          path='mood-tracking'
          element={
            <RoleGuard allowedRoles={['ADMIN_ROLE', 'ADMIN_MOODTRACKING_ROLE']}>
              <MoodTrackingPage />
            </RoleGuard>
          }
        />
        <Route path='change-password' element={<ChangePasswordPage />} />
      </Route>

      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};