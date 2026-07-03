import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Loader2, BellOff, Settings } from 'lucide-react';
import { useNotificationCenter } from '../hooks/useNotificationCenter.js';
import { NotificationItem } from './NotificationItem.jsx';
import { NotificationPreferencesModal } from './NotificationPreferencesModal.jsx';

const PREVIEW_LIMIT = 5;

export const NotificationBell = () => {
    const [open, setOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const preview = notifications.slice(0, PREVIEW_LIMIT);

    return (
        <div className='relative' ref={dropdownRef}>
            <button
                onClick={() => setOpen((o) => !o)}
                className='relative w-[38px] h-[38px] border border-[#e5e7f0] rounded-[10px] bg-white grid place-items-center cursor-pointer text-[#6d72d8] shadow-sm hover:shadow-md transition-all'
            >
                <Bell size={18} />
                {unread > 0 && (
                    <span className='absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#d14b6d] text-white text-[10px] font-black grid place-items-center'>
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>

            {open && (
                <div className='absolute top-[calc(100%+10px)] right-0 w-[360px] max-h-[480px] bg-white border border-[#e5e7f0] rounded-2xl shadow-[0_8px_32px_rgba(90,85,160,0.18)] z-50 animate-fadeIn flex flex-col overflow-hidden'>
                    <div className='flex items-center justify-between px-4 py-3.5 border-b border-[#e5e7f0]'>
                        <p className='m-0 text-sm font-black text-[#2f3348]'>Notificaciones</p>
                        <div className='flex items-center gap-1.5'>
                            {unread > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className='text-[11px] font-extrabold text-[#6d72d8] bg-transparent border-none cursor-pointer hover:underline'
                                >
                                    Marcar todas
                                </button>
                            )}
                            <button
                                onClick={() => setSettingsOpen(true)}
                                title='Preferencias'
                                className='w-7 h-7 rounded-full border-none bg-[#f5f6ff] text-[#7b8094] grid place-items-center cursor-pointer hover:text-[#6d72d8] transition-colors'
                            >
                                <Settings size={13} />
                            </button>
                        </div>
                    </div>

                    <div className='flex-1 overflow-y-auto p-3 flex flex-col gap-2'>
                        {loading ? (
                            <div className='flex justify-center py-10'>
                                <Loader2 size={22} className='animate-spin text-[#8b91ef]' />
                            </div>
                        ) : preview.length === 0 ? (
                            <div className='flex flex-col items-center gap-2 py-10 text-center'>
                                <BellOff size={26} className='text-[#d0d2e8]' />
                                <p className='m-0 text-xs font-bold text-[#9b9fb8]'>No tienes notificaciones</p>
                            </div>
                        ) : (
                            preview.map((n) => (
                                <NotificationItem key={n._id} notification={n} onMarkAsRead={markAsRead} compact />
                            ))
                        )}
                    </div>

                    <button
                        onClick={() => {
                            setOpen(false);
                            navigate('/home/notifications');
                        }}
                        className='w-full py-3 border-t border-[#e5e7f0] bg-white text-xs font-extrabold text-[#6d72d8] cursor-pointer hover:bg-[#f5f6ff] transition-colors'
                    >
                        Ver centro de notificaciones
                    </button>
                </div>
            )}

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