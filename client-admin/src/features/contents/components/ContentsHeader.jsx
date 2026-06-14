import { BookOpen } from 'lucide-react';

export const ContentsHeader = ({ onNewContent, canManage }) => (
    <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3.5'>
            <div className='w-10 h-10 rounded-xl bg-fw-purple-bg grid place-items-center text-fw-purple'>
                <BookOpen size={20} />
            </div>
            <div>
                <h2 className='m-0 text-[22px] font-black text-[#2f3348]'>Gestión de contenidos</h2>
                <p className='m-0 text-sm font-bold text-fw-gray'>Contenido educativo de bienestar para los usuarios</p>
            </div>
        </div>
        {canManage && (
            <button
                onClick={onNewContent}
                className='flex items-center gap-2 h-[42px] px-5 border-none rounded-full bg-fw-purple-light text-white text-[15px] font-black cursor-pointer hover:bg-fw-purple transition-colors'
            >
                + Nuevo contenido
            </button>
        )}
    </div>
);