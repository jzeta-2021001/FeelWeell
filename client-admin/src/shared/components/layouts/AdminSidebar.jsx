import { Link, useLocation } from 'react-router-dom';
import { Users, Dumbbell, FileText, Heart, BarChart2, ChevronDown, LogOut, User, Target, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import logo from '../../../assets/img/FeellWeellLogo.png';
import { ProfileModal } from '../../../features/users/components/ProfileModal.jsx';

const ALL_ITEMS = [
    { label: 'Usuarios', to: '/dashboard/users', icon: Users, roles: ['ADMIN_ROLE', 'ADMIN_USERS_ROLE'] },
    { label: 'Ejercicios', to: '/dashboard/exercises', icon: Dumbbell, roles: ['ADMIN_ROLE', 'ADMIN_HEALTHY_ROLE'] },
    { label: 'Contenido', to: '/dashboard/content', icon: FileText, roles: ['ADMIN_ROLE', 'ADMIN_HEALTHY_ROLE'] },
    { label: 'Reto Diario', to: '/dashboard/daily-challenges', icon: Target, roles: ['ADMIN_ROLE', 'ADMIN_HEALTHY_ROLE'] },
    { label: 'Mensajes Motiv.', to: '/dashboard/motivational', icon: Heart, roles: ['ADMIN_ROLE', 'ADMIN_MOODTRACKING_ROLE'] },
    { label: 'Mood Tracking', to: '/dashboard/mood-tracking', icon: BarChart2, roles: ['ADMIN_ROLE', 'ADMIN_MOODTRACKING_ROLE'] },
];

export const AdminSidebar = ({ user, onLogout }) => {
    const location = useLocation();
    const items = ALL_ITEMS.filter(i => i.roles.length === 0 || i.roles.includes(user?.role));

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
            <aside className='relative flex items-center gap-3 p-3 bg-white border-b border-[#e5e7f0] md:static md:flex-col md:items-stretch md:gap-7 md:p-7 md:border-b-0 md:border-r md:min-h-screen'>
                <div className='flex shrink-0 items-center gap-3.5'>
                    <img src={logo} alt='FeelWeell' className='w-[38px] h-[38px] rounded-[10px] object-cover' />
                    <div>
                        <h1 className='m-0 text-xl text-[#6d72d8] font-black'>FeelWeell</h1>
                        <p className='m-0 text-xs text-[#8b91ef] font-extrabold'>Admin</p>
                    </div>
                </div>

                <button type='button' onClick={() => setMobileMenuOpen((open) => !open)} aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobileMenuOpen}
                    className='ml-auto grid h-10 w-10 place-items-center rounded-xl border-none bg-[#f0f1ff] text-[#6d72d8] cursor-pointer md:hidden'>
                    {mobileMenuOpen ? <X size={21} /> : <Menu size={22} />}
                </button>

                <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} absolute top-full left-0 right-0 z-40 flex-col gap-1.5 border-b border-[#e5e7f0] bg-white p-3 shadow-[0_14px_30px_rgba(70,72,140,0.12)] md:static md:flex md:min-w-0 md:flex-1 md:gap-2.5 md:border-0 md:bg-transparent md:p-0 md:shadow-none md:flex-col`}>
                    {items.map(({ label, to, icon: Icon }) => (
                        <Link key={to} to={to} onClick={() => setMobileMenuOpen(false)}
                            className={`min-h-11 shrink-0 flex items-center gap-2.5 rounded-xl px-3.5 text-[15px] font-extrabold no-underline transition-colors ${location.pathname.startsWith(to) ? 'fw-nav-active' : 'text-[#565b70] hover:bg-[#edefff] hover:text-[#6d72d8]'}`}>
                            <Icon size={18} /><span>{label}</span>
                        </Link>
                    ))}
                </nav>

                <div className='relative shrink-0 md:mt-auto' ref={dropdownRef}>
                    {dropdownOpen && (
                        <div className='absolute top-[calc(100%+8px)] right-0 w-[180px] bg-white border border-[#e5e7f0] rounded-[14px] p-1.5 shadow-[0_8px_32px_rgba(90,85,160,0.14)] z-50 animate-fadeIn md:bottom-[calc(100%+8px)] md:top-auto md:left-0 md:right-0 md:w-auto'>
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
                        className='flex items-center gap-3 px-3 py-2.5 rounded-[14px] border border-[#e5e7f0] bg-[#f9f9ff] cursor-pointer text-left hover:bg-[#f0f1ff] hover:border-[#c8caef] transition-colors md:w-full'
                    >
                        <div className='w-9 h-9 flex-shrink-0 rounded-full grid place-items-center text-white text-sm font-black' style={{ background: 'linear-gradient(135deg,#6fb5ff,#c793ff)' }}>
                            {initials}
                        </div>
                        <div className='hidden min-w-0 md:block md:flex-1'>
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
