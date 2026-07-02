import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useUserStore } from '../store/useUsersStore.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { UsersHeader } from '../components/UsersHeader.jsx';
import { UsersFilters } from '../components/UsersFilters.jsx';
import { UsersTable } from '../components/UsersTable.jsx';
import { ConfirmModal } from '../components/ConfirmModal.jsx';
import { CreateUserModal } from '../components/CreateUserModal.jsx';

const PAGE_SIZE = 8;

export const UserAdminPage = () => {
    const { users, loading, getAllUsers, toggleUserStatus, deleteUser, createUser, updateProfile } =
        useUserStore();
    const authUser = useAuthStore((s) => s.user);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [page, setPage] = useState(1);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => { getAllUsers(); }, [getAllUsers]);

    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        return users.filter((u) => {
            const fullName = `${u.firstName || ''} ${u.surname || ''}`.toLowerCase();
            const matchSearch =
                !q ||
                fullName.includes(q) ||
                (u.username || '').toLowerCase().includes(q) ||
                (u.email || '').toLowerCase().includes(q);
            return matchSearch && (roleFilter === 'ALL' || u.role === roleFilter);
        });
    }, [users, search, roleFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const paginatedUsers = useMemo(
        () => filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
        [filteredUsers, currentPage],
    );

    const handleSearchChange = (e) => { setSearch(e.target.value); setPage(1); };
    const handleRoleChange = (e) => { setRoleFilter(e.target.value); setPage(1); };

    const handleToggleStatus = async (user) => {
        const result = await toggleUserStatus(user._id);
        result.success
            ? toast.success(`Usuario ${user.isActive ? 'desactivado' : 'activado'} correctamente`)
            : toast.error(result.error || 'Error al cambiar estado');
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        const result = await deleteUser(deleteTarget._id);
        result.success
            ? toast.success('Usuario eliminado correctamente')
            : toast.error(result.error || 'Error al eliminar usuario');
        setDeleteTarget(null);
    };

    const handleCreate = async (userData) => {
        const result = await createUser(userData);
        if (result.success) {
            toast.success('Usuario creado. Se envió correo de activación.');
            return { success: true };
        }
        toast.error(result.error || 'No se pudo crear el usuario');
        return { success: false };
    };

    const handleEditSave = async (profileData) => {
        const result = await updateProfile(editTarget._id, profileData);
        if (result.success) {
            toast.success('Perfil actualizado correctamente');
            return { success: true };
        }
        toast.error(result.error || 'Error al actualizar el perfil');
        return { success: false };
    };

    return (
        <div className='flex flex-col gap-5'>
            <UsersHeader onNewUser={() => setCreateModalOpen(true)} />

            <UsersFilters
                search={search}
                onSearchChange={handleSearchChange}
                roleFilter={roleFilter}
                onRoleChange={handleRoleChange}
            />

            <UsersTable
                users={paginatedUsers}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                totalFiltered={filteredUsers.length}
                authUserId={authUser?._id}
                onEdit={setEditTarget}
                onToggleStatus={handleToggleStatus}
                onDelete={setDeleteTarget}
                onPageChange={setPage}
            />

            <CreateUserModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreate={handleCreate}
                loading={loading}
            />
        </div>
    );
};