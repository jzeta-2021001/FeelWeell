// src/navigation/AppNavigator.jsx
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { COLORS } from '../shared/constants/theme';
import { LoadingSpinner } from '../shared/components/common/Common';
import { useAuthStore } from '../shared/store/authStore';
import { isAdminRole } from '../shared/constants/roles';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import AdminNavigator from './AdminNavigator';
import InitialQuestionnaireScreen from '../features/questionnaire/screens/InitialQuestionnaireScreen';
import moodClient from '../shared/api/moodClient';

export default function AppNavigator() {
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isAdmin = isAdminRole(user?.role);

  // Estado local para el gating del cuestionario inicial (solo aplica a USER_ROLE)
  const [profileLoading, setProfileLoading] = useState(false);
  const [completedQuestionnaire, setCompletedQuestionnaire] = useState(null); // null = desconocido

  useEffect(() => {
    if (!isAuthenticated || isAdmin) {
      // Los admins no pasan por el cuestionario de bienestar: es una funcionalidad
      // exclusiva de la experiencia de usuario (USER_ROLE).
      setCompletedQuestionnaire(null);
      return;
    }
    // Verificar si ya completó el cuestionario
    (async () => {
      setProfileLoading(true);
      try {
        const response = await moodClient.get('/moodTracking/profile');
        const data = response.data?.data ?? response.data;
        setCompletedQuestionnaire(!!data?.completedQuestionnaire);
      } catch {
        // Si falla, asumir completado para no bloquear al usuario indefinidamente
        setCompletedQuestionnaire(true);
      } finally {
        setProfileLoading(false);
      }
    })();
  }, [isAuthenticated, isAdmin]);

  if (!hasHydrated) {
    return <LoadingSpinner style={{ backgroundColor: COLORS.background }} />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        isAdmin ? (
          // Cualquier rol ADMIN_* recibe su propio panel de administración,
          // filtrado por las secciones a las que tiene acceso su rol.
          <AdminNavigator />
        ) : profileLoading || completedQuestionnaire === null ? (
          // Mientras se verifica el perfil
          <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <LoadingSpinner />
          </View>
        ) : completedQuestionnaire === false ? (
          // Cuestionario inicial obligatorio
          <InitialQuestionnaireScreen onComplete={() => setCompletedQuestionnaire(true)} />
        ) : (
          // Usuario autenticado (USER_ROLE) y con cuestionario completo
          <MainTabs />
        )
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}