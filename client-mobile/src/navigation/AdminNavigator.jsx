// src/navigation/AdminNavigator.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../shared/constants/theme';
import AdminHomeScreen from '../features/admin/screens/AdminHomeScreen';
import AdminUsersScreen from '../features/admin/screens/AdminUsersScreen';
import AdminExercisesScreen from '../features/admin/screens/AdminExercisesScreen';
import AdminContentScreen from '../features/admin/screens/AdminContentScreen';
import AdminMotivationalScreen from '../features/admin/screens/AdminMotivationalScreen';
import AdminMoodTrackingScreen from '../features/admin/screens/AdminMoodTrackingScreen';
import AdminProfileScreen from '../features/admin/screens/AdminProfileScreen';
import ChangePasswordScreen from '../features/profile/screens/ChangePasswordScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
    headerStyle: { backgroundColor: COLORS.surface },
    headerTintColor: COLORS.primary,
    headerTitleStyle: { fontWeight: '800' },
};

export default function AdminNavigator() {
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen
                name="AdminHome"
                component={AdminHomeScreen}
                options={{ title: 'Panel de administración' }}
            />
            <Stack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: 'Usuarios' }} />
            <Stack.Screen
                name="AdminExercises"
                component={AdminExercisesScreen}
                options={{ title: 'Ejercicios' }}
                initialParams={{ sectionTitle: 'Ejercicios' }}
            />
            <Stack.Screen
                name="AdminDailyChallenges"
                component={AdminExercisesScreen}
                options={{ title: 'Reto Diario' }}
                initialParams={{ sectionTitle: 'Reto Diario' }}
            />
            <Stack.Screen name="AdminContent" component={AdminContentScreen} options={{ title: 'Contenido' }} />
            <Stack.Screen
                name="AdminMotivational"
                component={AdminMotivationalScreen}
                options={{ title: 'Mensajes Motivacionales' }}
            />
            <Stack.Screen
                name="AdminMoodTracking"
                component={AdminMoodTrackingScreen}
                options={{ title: 'Mood Tracking' }}
            />
            <Stack.Screen name="AdminProfile" component={AdminProfileScreen} options={{ title: 'Mi Perfil' }} />
            <Stack.Screen
                name="AdminChangePassword"
                component={ChangePasswordScreen}
                options={{ title: 'Cambiar contraseña' }}
            />
        </Stack.Navigator>
    );
}