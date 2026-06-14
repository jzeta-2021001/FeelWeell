import { ContentCard } from './ContentCard.jsx';

export const ContentsGrid = ({ contents, loading, onEdit, onDelete, canManage }) => {
    if (loading && contents.length === 0) {
        return (
            <div className='bg-white border border-[#e5e7f0] rounded-lg px-4 py-12 text-center text-fw-gray/60 font-bold'>
                Cargando contenidos...
            </div>
        );
    }

    if (contents.length === 0) {
        return (
            <div className='bg-white border border-[#e5e7f0] rounded-lg px-4 py-12 text-center text-fw-gray/60 font-bold'>
                No hay contenidos para mostrar.
            </div>
        );
    }

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {contents.map((content) => (
                <ContentCard
                    key={content._id}
                    content={content}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    canManage={canManage}
                />
            ))}
        </div>
    );
};