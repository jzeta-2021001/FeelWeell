import { Smile, Dumbbell, Flame, Bell, Check } from 'lucide-react';

const TYPE_CONFIG = {
    MOOD_REMINDER: { icon: Smile, color: '#6d72d8', bg: '#edefff' },
    EXERCISE_REMINDER: { icon: Dumbbell, color: '#6d72d8', bg: '#edefff' },
    STREAK_ALERT: { icon: Flame, color: '#f59e0b', bg: '#fffbeb' },
    GENERAL: { icon: Bell, color: '#7b8094', bg: '#f5f6ff' },
};

const SEVERITY_DOT = {
    INFO: '#8b91ef',
    ADVERTENCIA: '#f59e0b',
    CRÍTICO: '#d14b6d',
};

const formatRelativeTime = (dateStr) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;
    const days = Math.floor(hours / 24);
    return `Hace ${days} d`;
};

export const NotificationItem = ({ notification, onMarkAsRead, compact = false }) => {
    const { icon: Icon, color, bg } = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.GENERAL;
    const dotColor = SEVERITY_DOT[notification.severity] ?? SEVERITY_DOT.INFO;

    return (
        <div
            className={`flex items-start gap-3 ${compact ? 'p-3' : 'p-4'} rounded-2xl border transition-colors ${
                notification.read ? 'bg-white border-[#e5e7f0]' : 'bg-[#f5f6ff] border-[#c5c8f2]'
            }`}
        >
            <div
                className='w-10 h-10 rounded-xl flex items-center justify-center shrink-0'
                style={{ backgroundColor: bg, color }}
            >
                <Icon size={18} />
            </div>

            <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2'>
                    {!notification.read && (
                        <span className='w-2 h-2 rounded-full shrink-0' style={{ backgroundColor: dotColor }} />
                    )}
                    <p className='m-0 text-sm font-black text-[#2f3348] truncate'>{notification.title}</p>
                </div>
                <p className='m-0 mt-1 text-xs text-[#7b8094] font-semibold leading-relaxed break-words'>
                    {notification.message}
                </p>
                <p className='m-0 mt-1.5 text-[11px] text-[#c5c7d8] font-bold'>
                    {formatRelativeTime(notification.createdAt)}
                </p>
            </div>

            {!notification.read && onMarkAsRead && (
                <button
                    onClick={() => onMarkAsRead(notification._id)}
                    title='Marcar como leída'
                    className='w-7 h-7 rounded-full border border-[#e5e7f0] bg-white grid place-items-center cursor-pointer text-[#9b9fb8] hover:text-[#6d72d8] hover:border-[#8b91ef] transition-colors shrink-0'
                >
                    <Check size={13} />
                </button>
            )}
        </div>
    );
};
