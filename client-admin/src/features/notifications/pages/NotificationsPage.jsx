import { useMemo, useState } from 'react';
import { Bell, BellOff, Loader2, Settings, Smile, Dumbbell, Flame } from 'lucide-react';
import { useNotificationCenter } from '../hooks/useNotificationCenter.js';
import { NotificationItem } from '../components/NotificationItem.jsx';
import { NotificationPreferencesModal } from '../components/NotificationPreferencesModal.jsx';

const FILTERS = [
    { id: 'ALL', label: 'Todas', icon: Bell },
    { id: 'UNREAD', label: 'No leídas', icon: BellOff },
    { id: 'MOOD_REMINDER', label: 'Ánimo', icon: Smile },
    { id: 'EXERCISE_REMINDER', label: 'Ejercicios', icon: Dumbbell },
    { id: 'STREAK_ALERT', label: 'Racha', icon: Flame },
];

export const NotificationsPage = () => {
    const {
        notifications,
        unread,
        preferences,
        loading,
        markAsRead,
        markAllAsRead,
        updatePreferences,
        toggleType,
    } = useNotificationCenter();

    const [activeFilter, setActiveFilter] = useState('ALL');
    const [settingsOpen, setSettingsOpen] = useState(false);

    const filtered = useMemo(() => {
        if (activeFilter === 'ALL') return notifications;
        if (activeFilter === 'UNREAD') return notifications.filter((n) => !n.read);
        return notifications.filter((n) => n.type === activeFilter);
    }, [notifications, activeFilter]);

    return (
        <div className='flex flex-col gap-5'>
            {/* Header */}
            <div className='rounded-2xl p-4 sm:p-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center' style={{ background: 'linear-gradient(135deg,#c5c8f2 0%,#d8d4ff 50%,#b9c9f5 100%)' }}>
                <div className='flex items-start gap-3 min-w-0'>
                    <div className='w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center'>
                        <Bell size={20} className='text-[#3d3a8c]' />
                    </div>
                    <div>
                        <h1 className='m-0 text-xl font-black text-[#2f3348]'>Centro de Notificaciones</h1>
                        <p className='m-0 text-xs font-semibold text-[#4a4f6b]'>
                            Alertas de racha, recordatorios de ejercicios y de registro de ánimo
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setSettingsOpen(true)}
                    className='flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-white/60 border-none text-[#3d3a8c] text-xs font-extrabold cursor-pointer hover:bg-white/90 transition-colors sm:self-auto'
                >
                    <Settings size={14} />
                    Preferencias
                </button>
            </div>

            {/* Filtros */}
            <div className='grid grid-cols-2 gap-1 bg-white border border-[#e5e7f0] rounded-xl p-1.5 sm:flex'>
                {FILTERS.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveFilter(id)}
                        className={`min-w-0 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-extrabold border-none cursor-pointer transition-all whitespace-nowrap sm:flex-1 ${
                            activeFilter === id
                                ? 'bg-[#8b91ef] text-white shadow-sm'
                                : 'bg-transparent text-[#7b8094] hover:bg-[#f0f1ff] hover:text-[#6d72d8]'
                        }`}
                    >
                        <Icon size={14} />
                        <span>{label}</span>
                        {id === 'UNREAD' && unread > 0 && (
                            <span
                                className={`ml-0.5 text-[10px] font-black rounded-full px-1.5 ${
                                    activeFilter === id ? 'bg-white/25 text-white' : 'bg-[#edefff] text-[#6d72d8]'
                                }`}
                            >
                                {unread}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Lista */}
            <div className='bg-white border border-[#e5e7f0] rounded-2xl p-4 sm:p-5'>
                <div className='flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between'>
                    <p className='m-0 text-sm font-black text-[#2f3348]'>
                        {filtered.length} {filtered.length === 1 ? 'notificación' : 'notificaciones'}
                    </p>
                    {unread > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className='text-xs font-extrabold text-[#6d72d8] bg-transparent border-none cursor-pointer hover:underline'
                        >
                            Marcar todas como leídas
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className='flex justify-center py-16'>
                        <Loader2 size={28} className='animate-spin text-[#8b91ef]' />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className='flex flex-col items-center gap-3 py-16 text-center'>
                        <BellOff size={36} className='text-[#d0d2e8]' />
                        <p className='text-sm font-bold text-[#9b9fb8] m-0'>No hay notificaciones en esta categoría</p>
                    </div>
                ) : (
                    <div className='flex flex-col gap-3'>
                        {filtered.map((n) => (
                            <NotificationItem key={n._id} notification={n} onMarkAsRead={markAsRead} />
                        ))}
                    </div>
                )}
            </div>

            <NotificationPreferencesModal
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                preferences={preferences}
                onToggleType={toggleType}
                onUpdatePreferences={updatePreferences}
            />
        </div>
    );
};
