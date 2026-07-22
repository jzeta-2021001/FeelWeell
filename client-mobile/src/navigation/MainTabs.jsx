// src/navigation/MainTabs.jsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../shared/constants/theme';
import PlaceholderScreen from '../shared/components/common/PlaceholderScreen';
import HomeScreen from '../features/home/screens/HomeScreen';
import MoodScreen from '../features/mood/screens/MoodScreen';
import MoodHistoryScreen from '../features/mood/screens/MoodHistoryScreen';
import ExercisesListScreen from '../features/exercises/screens/ExercisesListScreen';
import ExerciseDetailScreen from '../features/exercises/screens/ExerciseDetailScreen';
import ExerciseProgressScreen from '../features/exercises/screens/ExerciseProgressScreen';
import ContentListScreen from '../features/content/screens/ContentListScreen';
import ContentDetailScreen from '../features/content/screens/ContentDetailScreen';
import ChatScreen from '../features/chat/screens/ChatScreen';

import ProfileScreen from '../features/profile/screens/ProfileScreen';
import ChangePasswordScreen from '../features/profile/screens/ChangePasswordScreen';
import NotificationsScreen from '../features/notifications/screens/NotificationsScreen';

const Tab = createBottomTabNavigator();

const HomeStackNav = createNativeStackNavigator();
const MoodStackNav = createNativeStackNavigator();
const ExercisesStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();

// --- HomeStack (Inicio) ---
function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
      <HomeStackNav.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStackNav.Screen name="ContentList" component={ContentListScreen} />
      <HomeStackNav.Screen name="ContentDetail" component={ContentDetailScreen} />
    </HomeStackNav.Navigator>
  );
}

// --- MoodStack (Ánimo) ---
function MoodStack() {
  return (
    <MoodStackNav.Navigator screenOptions={{ headerShown: false }}>
      <MoodStackNav.Screen name="MoodScreen" component={MoodScreen} />
      <MoodStackNav.Screen name="MoodHistory" component={MoodHistoryScreen} />
    </MoodStackNav.Navigator>
  );
}

// --- ExercisesStack (Ejercicios) ---
function ExercisesStack() {
  return (
    <ExercisesStackNav.Navigator screenOptions={{ headerShown: false }}>
      <ExercisesStackNav.Screen name="ExercisesList" component={ExercisesListScreen} />
      <ExercisesStackNav.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
      <ExercisesStackNav.Screen name="ExerciseProgress" component={ExerciseProgressScreen} />
    </ExercisesStackNav.Navigator>
  );
}

// --- ProfileStack (Perfil) ---
function ProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStackNav.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStackNav.Screen name="Notifications" component={NotificationsScreen} />
      <ProfileStackNav.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </ProfileStackNav.Navigator>
  );
}

const ICONS = {
  Inicio: 'home',
  'Ánimo': 'self-improvement',
  Ejercicios: 'spa',
  'Tiyú': 'forum',
  Perfil: 'person',
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: route.name === 'Tiyú',
        headerTitle: 'Tiyú',
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name={ICONS[route.name]} size={size} color={color} />
        ),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 62,
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeStack} />
      <Tab.Screen name="Ánimo" component={MoodStack} />
      <Tab.Screen name="Ejercicios" component={ExercisesStack} />
      <Tab.Screen name="Tiyú" component={ChatScreen} />
      <Tab.Screen name="Perfil" component={ProfileStack} />
    </Tab.Navigator>
  );
}
