import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useContentStore } from '../store/contentStore.js';
import { useSaveContent } from '../hooks/useSaveContent.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { ContentsHeader } from '../components/ContentsHeader.jsx';
import { ContentsFilters } from '../components/ContentsFilters.jsx';
import { ContentsGrid } from '../components/ContentsGrid.jsx';
import { ContentModal } from '../components/ContentModal.jsx';
import { ConfirmModal } from '../../users/components/ConfirmModal.jsx';

export const ContentsAdminPage = () => {
    const { contents, loading, getContent, deleteContent } = useContentStore();
    const { saveContent } = useSaveContent();
    const authUser = useAuthStore((s) => s.user);
    const canManage = authUser?.role === 'ADMIN_HEALTHY_ROLE';
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => { getContent(); }, [getContent]);

    const filteredContents = useMemo(() => {
        const q = search.trim().toLowerCase();
        return contents.filter((c) => {
            const matchSearch = !q || (c.title || '').toLowerCase().includes(q);
            const matchType = typeFilter === 'ALL' || c.type === typeFilter;
            const matchCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
            return matchSearch && matchType && matchCategory;
        });
    }, [contents, search, typeFilter, categoryFilter]);

    const handleNewContent = () => { setEditTarget(null); setModalOpen(true); };
    const handleEdit = (content) => { setEditTarget(content); setModalOpen(true); };
    const handleCloseModal = () => { setModalOpen(false); setEditTarget(null); };

    const handleSave = async (data) => {
        const result = await saveContent(data, editTarget?._id);
        if (result?.success) {
            toast.success(editTarget ? 'Contenido actualizado correctamente' : 'Contenido creado correctamente');
            return { success: true };
        }
        toast.error(result?.error || 'Ocurrió un error al guardar el contenido');
        return { success: false };
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        const result = await deleteContent(deleteTarget._id);
        result.success
            ? toast.success('Contenido eliminado correctamente')
            : toast.error(result.error || 'Error al eliminar el contenido');
        setDeleteTarget(null);
    };

    return (
        <div className='flex flex-col gap-5'>
            <ContentsHeader onNewContent={handleNewContent} canManage={canManage} />

            <ContentsFilters
                search={search}
                onSearchChange={(e) => setSearch(e.target.value)}
                typeFilter={typeFilter}
                onTypeChange={(e) => setTypeFilter(e.target.value)}
                categoryFilter={categoryFilter}
                onCategoryChange={(e) => setCategoryFilter(e.target.value)}
            />

            <ContentsGrid
                contents={filteredContents}
                loading={loading}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                canManage={canManage}
            />

            {canManage && (
                <ContentModal
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    content={editTarget}
                    loading={loading}
                />
            )}

            {canManage && deleteTarget && (
                <ConfirmModal
                    title='Eliminar contenido'
                    description={`¿Eliminar el contenido "${deleteTarget.title}"? Esta acción no se puede deshacer.`}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
};