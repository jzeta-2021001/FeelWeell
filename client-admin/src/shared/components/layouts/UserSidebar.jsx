import { Home, MessageCircle, Trophy, Settings, Flame, LogOut, Dumbbell, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../../features/auth/store/authStore';
import logo from '../../../assets/img/FeellWeellLogo.png';

const NAV_ITEMS = [
    { label: 'Inicio', icon: Home },
    { label: 'Ejercicios', icon: Dumbbell },
    { label: 'Contenido', icon: BookOpen },
    { label: 'Chat', icon: MessageCircle },
    { label: 'Retos Pendientes', icon: Trophy },
    { label: 'Configuraciones', icon: Settings },
];

export const UserSidebar = ({ active = 'Inicio', onNavigate, onLogout }) => {
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