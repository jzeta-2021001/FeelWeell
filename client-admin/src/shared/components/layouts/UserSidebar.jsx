import { Home, MessageCircle, Trophy, Flame, LogOut, Dumbbell, Bell, History } from 'lucide-react';
import { useAuthStore } from '../../../features/auth/store/authStore';
import logo from '../../../assets/img/FeellWeellLogo.png';

const NAV_ITEMS = [
    { label: 'Inicio', icon: Home },
    { label: 'Ejercicios', icon: Dumbbell },
    { label: 'Historial', icon: History },
    { label: 'Chat', icon: MessageCircle },
    { label: 'Notificaciones', icon: Bell },
    { label: 'Retos Pendientes', icon: Trophy },
];

export const UserSidebar = ({ active = 'Inicio', unreadCount = 0, hasPendingChallenge = true, onNavigate, onLogout }) => {
    const user = useAuthStore((s) => s.user);
    const streak = user?.streak ?? 0;

    return (
        <aside className='flex flex-col gap-5 px-5 py-7 bg-white border-r border-[rgba(109,114,216,0.12)] min-h-screen'>
            <div className='flex items-center gap-2.5 pb-2'>
                <img src={logo} alt='FeelWeell' className='w-9 h-9 rounded-[10px] object-cover' />
                <span className='text-lg font-black text-[#6d72d8] m-0'>FeelWeell</span>
            </div>

            <nav className='flex flex-col gap-1.5'>
                {NAV_ITEMS.map(({ label, icon: Icon }) => (
                    <button key={label} onClick={() => onNavigate?.(label)}
                        className={`flex items-center gap-2.5 px-4 py-[11px] rounded-[14px] border-none text-[15px] font-bold cursor-pointer text-left transition-colors ${active === label ? 'fw-user-nav-active' : 'bg-transparent text-[#7b8094] hover:bg-[rgba(109,114,216,0.08)] hover:text-[#4a4fbf]'}`}>
                        <Icon size={18} />{label}
                        
                        {/* Notificaciones Badge */}
                        {label === 'Notificaciones' && unreadCount > 0 && (
                            <span className={`ml-auto min-w-[20px] h-5 px-1 rounded-full text-[11px] font-black grid place-items-center ${active === label ? 'bg-white text-[#8b91ef]' : 'bg-[#d14b6d] text-white'}`}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}

                        {/* Indicador de Reto Pendiente */}
                        {label === 'Retos Pendientes' && hasPendingChallenge && (
                            <span 
                                className={`ml-auto w-2.5 h-2.5 rounded-full ${active === label ? 'bg-white' : 'bg-[#d14b6d]'}`} 
                                title="Tienes un reto pendiente hoy"
                            />
                        )}
                    </button>
                ))}
            </nav>

            <div className='mt-auto flex flex-col items-center gap-1 px-4 py-5 rounded-[20px] text-white text-center' style={{ background: 'linear-gradient(135deg,#ffb347,#ff8c42)' }}>
                <Flame size={28} />
                <p className='m-0 text-[22px] font-black'>{streak} días</p>
                <p className='m-0 text-[13px] font-bold opacity-85'>racha activa</p>
            </div>

            <button onClick={onLogout}
                className='flex items-center gap-2 px-4 py-2.5 rounded-xl border-none bg-[#fff0f4] text-[#d14b6d] text-sm font-bold cursor-pointer hover:bg-[#ffd6e0] transition-colors'>
                <LogOut size={16} /> Cerrar sesión
            </button>
        </aside>
    );
};