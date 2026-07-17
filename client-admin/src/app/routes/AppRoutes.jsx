import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoutes } from './ProtectedRoutes';
import { RoleGuard } from './RoleGuard';
import { UserLayout } from '../layouts/UserLayout';
import { DashboardPage } from '../layouts/DashboardPage';

const AuthPage = lazy(() => import('../../features/auth/pages/AuthPage').then((module) => ({ default: module.AuthPage })));
const ForgotPasswordPage = lazy(() => import('../../features/auth/pages/ForgotPasswordPage').then((module) => ({ default: module.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('../../features/auth/pages/ResetPasswordPage').then((module) => ({ default: module.ResetPasswordPage })));
const ActivateAccountPage = lazy(() => import('../../features/auth/pages/ActivateAccountPage').then((module) => ({ default: module.ActivateAccountPage })));
const ChangePasswordPage = lazy(() => import('../../features/auth/pages/ChangePasswordPage').then((module) => ({ default: module.ChangePasswordPage })));
const UnauthorizedPage = lazy(() => import('../../features/auth/pages/UnauthorizedPage').then((module) => ({ default: module.UnauthorizedPage })));
const UserAdminPage = lazy(() => import('../../features/users/pages/UserAdminPage.jsx').then((module) => ({ default: module.UserAdminPage })));
const UserPage = lazy(() => import('../../features/users/pages/UserPage').then((module) => ({ default: module.UserPage })));
const MoodPage = lazy(() => import('../../features/users/pages/MoodPage').then((module) => ({ default: module.MoodPage })));
const ChatPage = lazy(() => import('../../features/chat/pages/ChatPage.jsx').then((module) => ({ default: module.ChatPage })));
const ExercisesAdminPage = lazy(() => import('../../features/exercises/pages/ExercisesAdminPage.jsx').then((module) => ({ default: module.ExercisesAdminPage })));
const ContentsAdminPage = lazy(() => import('../../features/contents/pages/ContentsAdminPage.jsx').then((module) => ({ default: module.ContentsAdminPage })));
const UserExercisesPage = lazy(() => import('../../features/exercises/pages/UserExercisesPage.jsx').then((module) => ({ default: module.UserExercisesPage })));
const UserContentsPage = lazy(() => import('../../features/contents/pages/UserContentsPage.jsx').then((module) => ({ default: module.UserContentsPage })));
const NotificationsPage = lazy(() => import('../../features/notifications/pages/NotificationsPage.jsx').then((module) => ({ default: module.NotificationsPage })));
const RetosPage = lazy(() => import('../../features/exercises/pages/RetosPage.jsx').then((module) => ({ default: module.RetosPage })));
const DailyChallengesAdminPage = lazy(() => import('../../features/exercises/pages/DailyChallengesAdminPage.jsx').then((module) => ({ default: module.DailyChallengesAdminPage })));
const HistoryPage = lazy(() => import('../../features/exercises/pages/HistoryPage.jsx').then((module) => ({ default: module.HistoryPage })));
const MotivationalPage = lazy(() => import('../../features/dashboard/pages/MotivationalPage').then((module) => ({ default: module.MotivationalPage })));
const MoodTrackingPage = lazy(() => import('../../features/dashboard/pages/MoodTrackingPage').then((module) => ({ default: module.MoodTrackingPage })));

const ADMIN_ROLES = [
  'ADMIN_ROLE',
  'ADMIN_USERS_ROLE',
  'ADMIN_MOODTRACKING_ROLE',
  'ADMIN_HEALTHY_ROLE',
];

export const AppRoutes = () => {
  return (
    <Suspense fallback={<div className='min-h-screen grid place-items-center bg-[#f6f7fb] text-[#6d72d8] font-bold'>Cargando...</div>}>
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
        <Route path='exercises' element={<UserExercisesPage />} />
        <Route path='content' element={<UserContentsPage />} />
        <Route path='mood' element={<MoodPage />} />
        <Route path='notifications' element={<NotificationsPage />} />
        <Route path='retos' element={<RetosPage />} />
        
        {/* NUEVA RUTA: Historial del Usuario */}
        <Route path='history' element={<HistoryPage />} />
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
          path='daily-challenges'
          element={
            <RoleGuard allowedRoles={['ADMIN_ROLE', 'ADMIN_HEALTHY_ROLE']}>
              <DailyChallengesAdminPage />
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
    </Suspense>
  );
};
