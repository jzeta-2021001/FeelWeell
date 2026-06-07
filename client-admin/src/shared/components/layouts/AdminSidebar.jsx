import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Dumbbell, FileText, Heart, BarChart2, ChevronDown, LogOut, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import logo from '../../../assets/img/FeellWeellLogo.png';
import { ProfileModal } from '../../../features/users/components/ProfileModal.jsx';

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

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const initials = `${user?.firstName?.[0] ?? ''}${user?.surname?.[0] ?? ''}`.toUpperCase() || 'FW';
    const fullName = [user?.firstName, user?.surname].filter(Boolean).join(' ') || 'Usuario';

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOpenProfile = () => {
        setDropdownOpen(false);
        setTimeout(() => setProfileOpen(true), 50);
    };

    const handleLogout = () => {
        setDropdownOpen(false);
        onLogout();
    };

    return (
        <>
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

                <div className='mt-auto relative' ref={dropdownRef}>
                    {dropdownOpen && (
                        <div className='absolute bottom-[calc(100%+8px)] left-0 right-0 bg-white border border-[#e5e7f0] rounded-[14px] p-1.5 shadow-[0_8px_32px_rgba(90,85,160,0.14)] z-50 animate-fadeIn'>
                            <button
                                onClick={handleOpenProfile}
                                className='w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] border-none bg-transparent text-sm font-extrabold text-[#444660] cursor-pointer hover:bg-[#f0f1ff] hover:text-[#6d72d8] transition-colors'
                            >
                                <User size={15} /> Mi Perfil
                            </button>
                            <div className='h-px bg-[#f0f1f8] my-1' />
                            <button
                                onClick={handleLogout}
                                className='w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] border-none bg-transparent text-sm font-extrabold text-[#d14b6d] cursor-pointer hover:bg-[#fff0f4] transition-colors'
                            >
                                <LogOut size={15} /> Cerrar sesión
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className='w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] border border-[#e5e7f0] bg-[#f9f9ff] cursor-pointer text-left hover:bg-[#f0f1ff] hover:border-[#c8caef] transition-colors'
                    >
                        <div className='w-9 h-9 flex-shrink-0 rounded-full grid place-items-center text-white text-sm font-black' style={{ background: 'linear-gradient(135deg,#6fb5ff,#c793ff)' }}>
                            {initials}
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='m-0 text-[13px] font-extrabold text-[#2f3348] truncate'>{fullName}</p>
                            <p className='m-0 text-[11px] font-bold text-[#8b8fbb] truncate'>{user?.role}</p>
                        </div>
                        <ChevronDown
                            size={15}
                            className={`text-[#9399c0] flex-shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>
            </aside>

            <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} userBase={user} />
        </>
    );
};