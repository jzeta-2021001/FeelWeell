import { BookOpen } from 'lucide-react';
import { UserContentDetailBody } from './UserContentDetailBody.jsx';

export const UserContentDetailPanel = ({ content }) => {
    return (
        <div className='hidden xl:flex flex-col bg-white border-l border-[#e5e7f0] h-full overflow-hidden'>
            {content ? (
                <UserContentDetailBody content={content} />
            ) : (
                <div className='flex-1 flex flex-col items-center justify-center gap-3 text-center p-8'>
                    <div className='w-14 h-14 bg-fw-purple-bg rounded-2xl flex items-center justify-center'>
                        <BookOpen size={24} className='text-fw-purple-light' />
                    </div>
                    <p className='m-0 text-sm font-bold text-fw-gray'>Selecciona un contenido</p>
                    <p className='m-0 text-xs text-[#aaa]'>Elige un elemento de la lista para leerlo aquí</p>
                </div>
            )}
        </div>
    );
};