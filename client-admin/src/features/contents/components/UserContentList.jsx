import { BookOpen } from 'lucide-react';
import { CATEGORY_STYLES } from '../constants/constants.js';
import { UserContentListItem } from './UserContentListItem.jsx';

const CATEGORY_LABEL = (cat) => cat.charAt(0) + cat.slice(1).toLowerCase();

export const UserContentList = ({ groupedContents, total, loading, categoryFilter, selectedId, onSelect }) => {
    const { recent, older } = groupedContents;
    const dotColor = categoryFilter !== 'ALL' ? CATEGORY_STYLES[categoryFilter]?.dot : '#6d72d8';

    if (loading) {
        return (
            <div className='flex flex-col gap-3 p-2'>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className='flex gap-4 p-3.5 rounded-2xl border-[1.5px] border-transparent animate-pulse'>
                        <div className='w-[76px] h-[76px] rounded-2xl bg-[#e5e7f0] shrink-0' />
                        <div className='flex-1 flex flex-col gap-2 justify-center'>
                            <div className='h-3 bg-[#f0f0f0] rounded w-24' />
                            <div className='h-4 bg-[#e5e7f0] rounded w-3/4' />
                            <div className='h-3 bg-[#f0f0f0] rounded w-full' />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (total === 0) {
        return (
            <div className='flex flex-col items-center justify-center gap-3 py-20 text-center'>
                <div className='w-14 h-14 bg-fw-purple-bg rounded-2xl flex items-center justify-center'>
                    <BookOpen size={24} className='text-fw-purple-light' />
                </div>
                <p className='m-0 text-sm font-bold text-fw-gray'>No hay contenido disponible</p>
                <p className='m-0 text-xs text-[#aaa]'>Prueba con otra categoría, tipo o búsqueda</p>
            </div>
        );
    }

    return (
        <div className='p-1'>
            <div className='flex items-center gap-2.5 mb-1'>
                <span className='w-[11px] h-[11px] rounded-[4px] shrink-0' style={{ background: dotColor }} />
                <h3 className='m-0 text-[20px] font-black text-[#2f3348]'>
                    {categoryFilter === 'ALL' ? 'Todo el contenido' : CATEGORY_LABEL(categoryFilter)}
                </h3>
            </div>
            <p className='m-0 mb-5 text-[13px] text-fw-gray font-semibold'>{total} contenido{total !== 1 ? 's' : ''} disponible{total !== 1 ? 's' : ''}</p>

            {recent.length > 0 && (
                <>
                    <p className='m-0 mb-2.5 ml-1 text-[11px] font-extrabold uppercase tracking-widest text-[#b3b7d1]'>Publicado recientemente</p>
                    {recent.map((c) => (
                        <UserContentListItem key={c._id} content={c} isSelected={c._id === selectedId} onSelect={onSelect} />
                    ))}
                </>
            )}

            {older.length > 0 && (
                <>
                    <p className='m-0 mt-6 mb-2.5 ml-1 text-[11px] font-extrabold uppercase tracking-widest text-[#b3b7d1]'>Hace más de un mes</p>
                    {older.map((c) => (
                        <UserContentListItem key={c._id} content={c} isSelected={c._id === selectedId} onSelect={onSelect} />
                    ))}
                </>
            )}
        </div>
    );
};