import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Dumbbell, FileText, Heart, BarChart2, LogOut } from 'lucide-react';
import logo from '../../../assets/img/FeellWeellLogo.png';

const ALL_ITEMS = [
    { label: 'Panel General', to: '/dashboard/panel', icon: LayoutDashboard, roles: [] },
    { label: 'Usuarios', to: '/dashboard/users', icon: Users, roles: ['ADMIN_ROLE', 'ADMIN_USERS_ROLE'] },
    { label: 'Ejercicios', to: '/dashboard/exercises', icon: Dumbbell, roles: ['ADMIN_ROLE', 'ADMIN_HEALTHY_ROLE'] },
    { label: 'Contenido', to: '/dashboard/content', icon: FileText, roles: ['ADMIN_ROLE', 'ADMIN_HEALTHY_ROLE'] },
    { label: 'Mensajes Motiv.', to: '/dashboard/motivational', icon: Heart, roles: ['ADMIN_ROLE', 'ADMIN_MOODTRACKING_ROLE'] },
    { label: 'Mood Tracking', to: '/dashboard/mood-tracking', icon: BarChart2, roles: ['ADMIN_ROLE', 'ADMIN_MOODTRACKING_ROLE'] },
];

export const AdminSidebar = ({ user, onLogout }) => {
    const location = useLocation();
    const items = ALL_ITEMS.filter(i => i.roles.length === 0 || i.roles.includes(user?.role));

    return (
        <aside className='flex flex-col gap-7 p-7 bg-white border-r border-[#e5e7f0] min-h-screen'>
            <div className='flex items-center gap-3.5'>
                <img src={logo} alt='FeelWeell' className='w-[38px] h-[38px] rounded-[10px] object-cover' />
                <div>
                    <h1 className='m-0 text-xl text-[#6d72d8] font-black'>FeelWeell</h1>
                    <p className='m-0 text-xs text-[#8b91ef] font-extrabold'>Admin</p>
                </div>
            </div>

            <nav className='flex flex-col gap-2.5'>
                {items.map(({ label, to, icon: Icon }) => (
                    <Link key={to} to={to}
                        className={`min-h-11 flex items-center gap-2.5 rounded-xl px-3.5 text-[15px] font-extrabold no-underline transition-colors ${location.pathname.startsWith(to) ? 'fw-nav-active' : 'text-[#565b70] hover:bg-[#edefff] hover:text-[#6d72d8]'}`}>
                        <Icon size={18} />{label}
                    </Link>
                ))}
            </nav>

            <button onClick={onLogout}
                className='mt-auto min-h-11 flex items-center gap-2.5 rounded-xl px-3.5 border-none bg-[#fff0f4] text-[#d14b6d] text-[15px] font-extrabold cursor-pointer'>
                <LogOut size={16} /> Cerrar sesión
            </button>
        </aside>
    );
};