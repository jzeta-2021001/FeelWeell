import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useUserContents } from '../hooks/useUserContents.js';
import { UserContentShelf } from '../components/UserContentShelf.jsx';
import { UserContentMobileFilters } from '../components/UserContentMobileFilters.jsx';
import { UserContentList } from '../components/UserContentList.jsx';
import { UserContentDetailPanel } from '../components/UserContentDetailPanel.jsx';
import { UserContentModal } from '../components/UserContentModal.jsx';

export const UserContentsPage = () => {
    const {
        contents,
        groupedContents,
        categoryCounts,
        loading,
        categoryFilter,
        setCategoryFilter,
        typeFilter,
        setTypeFilter,
        search,
        setSearch,
        selectedContent,
        selectedId,
        setSelectedId,
    } = useUserContents();

    // Solo se usa en pantallas < xl, donde el panel de detalle no se muestra inline
    const [mobileContent, setMobileContent] = useState(null);

    const handleSelect = (id) => {
        setSelectedId(id);
        if (window.innerWidth < 1280) {
            const found = contents.find((c) => c._id === id);
            setMobileContent(found ?? null);
        }
    };

    return (
        <div className='flex flex-col gap-5'>
            {/* Encabezado */}
            <div className='rounded-2xl p-6' style={{ background: 'linear-gradient(135deg,#c5c8f2 0%,#d8d4ff 50%,#b9c9f5 100%)' }}>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center'>
                        <BookOpen size={20} className='text-[#3d3a8c]' />
                    </div>
                    <div>
                        <h1 className='m-0 text-xl font-black text-[#2f3348]'>Biblioteca de Contenido</h1>
                        <p className='m-0 text-xs font-semibold text-[#4a4f6b]'>Artículos, videos y recursos para tu bienestar emocional</p>
                    </div>
                </div>
            </div>

            {/* Filtros compactos (solo visibles bajo el breakpoint lg, donde el estante lateral se oculta) */}
            <UserContentMobileFilters
                search={search}
                onSearchChange={setSearch}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
            />

            {/* Workspace de biblioteca: estante + lista + lector */}
            <div
                className='bg-white border border-[#e5e7f0] rounded-2xl overflow-hidden grid'
                style={{ gridTemplateColumns: 'minmax(0,1fr)', minHeight: '70vh' }}
            >
                <div className='grid lg:grid-cols-[248px_1fr] xl:grid-cols-[248px_1fr_380px]'>
                    <UserContentShelf
                        search={search}
                        onSearchChange={setSearch}
                        categoryFilter={categoryFilter}
                        onCategoryChange={setCategoryFilter}
                        typeFilter={typeFilter}
                        onTypeChange={setTypeFilter}
                        categoryCounts={categoryCounts}
                    />

                    <div className='p-5 lg:p-6 overflow-y-auto' style={{ maxHeight: '78vh' }}>
                        <UserContentList
                            groupedContents={groupedContents}
                            total={contents.length}
                            loading={loading}
                            categoryFilter={categoryFilter}
                            selectedId={selectedId}
                            onSelect={handleSelect}
                        />
                    </div>

                    <UserContentDetailPanel content={selectedContent} />
                </div>
            </div>

            {/* Lector en modal para pantallas medianas/pequeñas */}
            <UserContentModal content={mobileContent} onClose={() => setMobileContent(null)} />
        </div>
    );
};