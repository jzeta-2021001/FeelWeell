import { useEffect, useMemo, useState } from 'react';
import { Users as UsersIcon, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserStore } from '../../users/store/useUsersStore';
import { useAuthStore } from '../../auth/store/authStore';
import { CreateUserModal } from './CreateUserModal';
import { EditProfileModal } from './EditProfileModal';

const PAGE_SIZE = 8;

const ROLE_STYLES = {
    ADMIN_ROLE: { label: 'Admin Principal', cls: 'bg-[#fce4ec] text-[#c62828]' },
    ADMIN_USERS_ROLE: { label: 'Admin Usuarios', cls: 'bg-[#ede7f6] text-[#6d72d8]' },
    ADMIN_MOODTRACKING_ROLE: { label: 'Admin Mood', cls: 'bg-[#e3f2fd] text-[#1565c0]' },
    ADMIN_HEALTHY_ROLE: { label: 'Admin Healthy', cls: 'bg-[#e8f5e9] text-[#2e7d52]' },
    USER_ROLE: { label: 'Usuario', cls: 'bg-[#f0f1f8] text-[#7b8094]' },
};

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });

export const Users = () => {
    const { users, loading, getAllUsers, toggleUserStatus, deleteUser, createUser, updateProfile } = useUserStore();
    const authUser = useAuthStore((s) => s.user);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [page, setPage] = useState(1);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);

    useEffect(() => { getAllUsers(); }, [getAllUsers]);

    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        return users.filter(u => {
            const fullName = `${u.firstName || ''} ${u.surname || ''}`.toLowerCase();
            const matchSearch = !q || fullName.includes(q) || (u.username || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
            return matchSearch && (roleFilter === 'ALL' || u.role === roleFilter);
        });
    }, [users, search, roleFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const paginatedUsers = useMemo(() => filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE), [filteredUsers, currentPage]);

    const handleToggleStatus = async (user) => {
        const result = await toggleUserStatus(user._id);
        result.success ? toast.success(`Usuario ${user.isActive ? 'desactivado' : 'activado'} correctamente`) : toast.error(result.error || 'Error al cambiar estado');
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`¿Eliminar a "${user.username}" permanentemente?`)) return;
        const result = await deleteUser(user._id);
        result.success ? toast.success('Usuario eliminado correctamente') : toast.error(result.error || 'Error al eliminar usuario');
    };

    const handleCreate = async (userData) => {
        const result = await createUser(userData);
        if (result.success) { toast.success('Usuario creado. Se envió correo de activación.'); await getAllUsers({ force: true }); return { success: true }; }
        toast.error(result.error || 'No se pudo crear el usuario');
        return { success: false };
    };

    const handleEditSave = async (profileData) => {
        const result = await updateProfile(profileData);
        if (result.success) { toast.success('Perfil actualizado correctamente'); return { success: true }; }
        toast.error(result.error || 'Error al actualizar el perfil');
        return { success: false };
    };

    return (
        <div className='flex flex-col gap-5'>
            {/* Header */}
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-3.5'>
                    <div className='w-10 h-10 rounded-xl bg-[#edefff] grid place-items-center text-[#6d72d8]'><UsersIcon size={20} /></div>
                    <div>
                        <h2 className='m-0 text-[22px] font-black text-[#2f3348]'>Gestión de usuarios</h2>
                        <p className='m-0 text-sm font-bold text-[#7b8094]'>Listado y administración de cuentas</p>
                    </div>
                </div>
                <button onClick={() => setCreateModalOpen(true)}
                    className='flex items-center gap-2 h-[42px] px-5 border-none rounded-full bg-[#bfc3fb] text-white text-[15px] font-black cursor-pointer'>
                    <UserPlus size={16} /> Nuevo usuario
                </button>
            </div>

            {/* Filtros */}
            <div className='flex gap-3.5 flex-wrap bg-white border border-[#e5e7f0] rounded-lg p-6'>
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder='Buscar por nombre, usuario o correo...'
                    className='flex-1 min-w-[200px] h-11 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 text-sm text-[#2f3348] font-semibold outline-none focus:border-[#8b91ef]' />
                <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
                    className='w-[200px] h-11 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 text-sm text-[#2f3348] font-semibold outline-none focus:border-[#8b91ef] cursor-pointer'>
                    <option value='ALL'>Todos los roles</option>
                    <option value='ADMIN_ROLE'>Admin Principal</option>
                    <option value='ADMIN_USERS_ROLE'>Admin Usuarios</option>
                    <option value='ADMIN_MOODTRACKING_ROLE'>Admin Mood Tracking</option>
                    <option value='ADMIN_HEALTHY_ROLE'>Admin Healthy</option>
                    <option value='USER_ROLE'>Usuario</option>
                </select>
            </div>

            {/* Tabla */}
            <div className='bg-white border border-[#e5e7f0] rounded-lg overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-[#f6f7fb]'>
                                {['Usuario', 'Correo', 'Rol', 'Estado', 'Creado', 'Acciones'].map((h, i) => (
                                    <th key={h} className={`px-4 py-3 text-left text-[13px] font-extrabold text-[#7b8094] whitespace-nowrap ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading && users.length === 0 ? (
                                <tr><td colSpan={6} className='px-4 py-8 text-center text-[#9b9fb8]'>Cargando usuarios...</td></tr>
                            ) : paginatedUsers.length === 0 ? (
                                <tr><td colSpan={6} className='px-4 py-8 text-center text-[#9b9fb8]'>No hay usuarios para mostrar.</td></tr>
                            ) : paginatedUsers.map(u => {
                                const roleStyle = ROLE_STYLES[u.role] || ROLE_STYLES.USER_ROLE;
                                const isSelf = u._id === authUser?._id;
                                return (
                                    <tr key={u._id} className='border-t border-[#f0f1f8] hover:bg-[#fafbff] transition-colors'>
                                        <td className='px-4 py-3.5'>
                                            <p className='m-0 font-extrabold text-[#2f3348] text-sm'>@{u.username}</p>
                                            <p className='m-0 text-xs text-[#9b9fb8] mt-0.5'>{[u.firstName, u.surname].filter(Boolean).join(' ') || '—'}</p>
                                        </td>
                                        <td className='px-4 py-3.5 text-sm text-[#7b8094]'>{u.email}</td>
                                        <td className='px-4 py-3.5'>
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold ${roleStyle.cls}`}>{roleStyle.label}</span>
                                        </td>
                                        <td className='px-4 py-3.5'>
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold ${u.isActive ? 'bg-[#e8f5e9] text-[#2e7d52]' : 'bg-[#fce4ec] text-[#c62828]'}`}>
                                                {u.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className='px-4 py-3.5 text-xs text-[#9b9fb8]'>{u.createdAt ? formatDate(u.createdAt) : '—'}</td>
                                        <td className='px-4 py-3.5'>
                                            <div className='flex gap-2 justify-end flex-wrap'>
                                                <button onClick={() => setEditTarget(u)} className='px-3.5 py-1 border-none rounded-lg text-[13px] font-bold cursor-pointer bg-[#edefff] text-[#6d72d8]'>Editar</button>
                                                {!isSelf && (
                                                    <button onClick={() => handleToggleStatus(u)} className={`px-3.5 py-1 border-none rounded-lg text-[13px] font-bold cursor-pointer ${u.isActive ? 'bg-[#fff3d8] text-[#ad7115]' : 'bg-[#e8f5e9] text-[#2e7d52]'}`}>
                                                        {u.isActive ? 'Desactivar' : 'Activar'}
                                                    </button>
                                                )}
                                                {!isSelf && (
                                                    <button onClick={() => handleDelete(u)} className='px-3.5 py-1 border-none rounded-lg text-[13px] font-bold cursor-pointer bg-[#fce4ec] text-[#c62828]'>Eliminar</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className='flex justify-between items-center px-5 py-4 border-t border-[#f0f1f8] flex-wrap gap-3'>
                    <p className='m-0 text-[13px] font-bold text-[#9b9fb8]'>
                        Mostrando {(currentPage - 1) * PAGE_SIZE + (paginatedUsers.length ? 1 : 0)} – {(currentPage - 1) * PAGE_SIZE + paginatedUsers.length} de {filteredUsers.length}
                    </p>
                    <div className='flex items-center gap-3'>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                            className='px-4 py-1.5 border border-[#e5e7f0] rounded-lg bg-white text-[13px] font-bold text-[#505570] cursor-pointer disabled:opacity-40'>Anterior</button>
                        <span className='text-[13px] font-extrabold text-[#6d72d8]'>{currentPage} / {totalPages}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            className='px-4 py-1.5 border border-[#e5e7f0] rounded-lg bg-white text-[13px] font-bold text-[#505570] cursor-pointer disabled:opacity-40'>Siguiente</button>
                    </div>
                </div>
            </div>

            <CreateUserModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} onCreate={handleCreate} loading={loading} />
            <EditProfileModal isOpen={!!editTarget} onClose={() => setEditTarget(null)} onSave={handleEditSave} user={editTarget} loading={loading} />
        </div>
    );
};