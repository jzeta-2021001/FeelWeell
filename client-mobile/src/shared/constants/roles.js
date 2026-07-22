// src/shared/constants/roles.js

export const ROLES = {
    ADMIN: 'ADMIN_ROLE',
    ADMIN_USERS: 'ADMIN_USERS_ROLE',
    ADMIN_HEALTHY: 'ADMIN_HEALTHY_ROLE',
    ADMIN_MOODTRACKING: 'ADMIN_MOODTRACKING_ROLE',
    USER: 'USER_ROLE',
};

export const ADMIN_ROLES = [
    ROLES.ADMIN,
    ROLES.ADMIN_USERS,
    ROLES.ADMIN_HEALTHY,
    ROLES.ADMIN_MOODTRACKING,
];

export function isAdminRole(role) {
    return ADMIN_ROLES.includes(role);
}

// Mismo criterio de acceso que AdminSidebar.jsx en client-admin,
// para que cada rol vea solo lo que le corresponde.
export const ADMIN_SECTIONS = [
    {
        key: 'users',
        label: 'Usuarios',
        description: 'Gestión de cuentas y estados',
        icon: 'people',
        route: 'AdminUsers',
        roles: [ROLES.ADMIN, ROLES.ADMIN_USERS],
    },
    {
        key: 'exercises',
        label: 'Ejercicios',
        description: 'Catálogo de ejercicios de bienestar',
        icon: 'fitness-center',
        route: 'AdminExercises',
        roles: [ROLES.ADMIN, ROLES.ADMIN_HEALTHY],
    },
    {
        key: 'dailyChallenges',
        label: 'Reto Diario',
        description: 'Dinámicas y retos diarios',
        icon: 'flag',
        route: 'AdminDailyChallenges',
        roles: [ROLES.ADMIN, ROLES.ADMIN_HEALTHY],
    },
    {
        key: 'content',
        label: 'Contenido',
        description: 'Artículos, videos y recursos',
        icon: 'article',
        route: 'AdminContent',
        roles: [ROLES.ADMIN, ROLES.ADMIN_HEALTHY],
    },
    {
        key: 'motivational',
        label: 'Mensajes Motiv.',
        description: 'Frases de refuerzo positivo',
        icon: 'favorite',
        route: 'AdminMotivational',
        roles: [ROLES.ADMIN, ROLES.ADMIN_MOODTRACKING],
    },
    {
        key: 'moodTracking',
        label: 'Mood Tracking',
        description: 'Estadísticas y registros de ánimo',
        icon: 'bar-chart',
        route: 'AdminMoodTracking',
        roles: [ROLES.ADMIN, ROLES.ADMIN_MOODTRACKING],
    },
];

export function getAccessibleSections(role) {
    return ADMIN_SECTIONS.filter((s) => s.roles.includes(role));
}

export default ROLES;