import { useState } from 'react';
import { ArrowLeft, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/chatStore.js';
import imgTiyu from '../../../assets/img/tiyu.jpeg'

const ClearHistoryModal = ({ onConfirm, onCancel }) => (
    <div className='fixed inset-0 bg-[#7b8094] flex items-center justify-center z-[999] p-5'>
        <div className='w-full max-w-[340px] bg-white rounded-[20px] overflow-hidden animate-fadeInScale'>

            <div className='flex justify-center pt-7 pb-4'>
                <div className='w-14 h-14 rounded-full bg-[#8b91ef] flex items-center justify-center'>
                    <Trash2 size={24} className='text-[#edefff]' />
                </div>
            </div>

            <div className='px-6 pb-5 text-center'>
                <h3 className='text-[17px] font-black text-[#2f3348] mb-1.5'>
                    Limpiar historial
                </h3>
                <p className='text-[13px] font-bold text-[#9b9fb8] leading-relaxed'>
                    ¿Está seguro que quiere limpiar el chat? Se pueden perder mensajes importantes.
                </p>
            </div>

            <div className='flex gap-2.5 px-6 pb-6'>
                <button
                    onClick={onCancel}
                    className='flex-1 h-11 border-[1.5px] border-[#e5e7f0] rounded-full bg-white text-[13px] font-extrabold text-[#7b8094] hover:bg-[#f5f6ff] transition-colors'
                >
                    Cancelar
                </button>
                <button
                    onClick={onConfirm}
                    className='flex-1 h-11 rounded-full bg-[#8b91ef] text-white text-[13px] font-extrabold hover:bg-[#6d72d8] transition-colors'
                >
                    Sí, limpiar
                </button>
            </div>
        </div>
    </div>
);

export const ChatHeader = () => {
    const navigate = useNavigate();
    const clearMessages = useChatStore((s) => s.clearMessages);
    const [showModal, setShowModal] = useState(false);
    const handleBack = () => navigate('/home');

    const handleConfirmClear = () => {
        clearMessages();
        setShowModal(false);
    };
    return (
        <>
        <header className='flex items-center gap-3 px-4 py-3 border-b border-[#edefff] bg-white/80 backdrop-blur-md sticky top-0 z-10'>
            <button
                onClick={handleBack}
                className='w-9 h-9 flex items-center justify-center rounded-[10px] border border-[#e5e7f0] bg-white text-[#6d72d8] hover:bg-[#edefff] transition-colors'
                aria-label='Volver'
            >
                <ArrowLeft size={18} />
            </button>

            <div className='flex items-center gap-3 flex-1'>
                <div className='relative'>
                    <div>
                        <img
                            src={imgTiyu}
                            alt='Tiyú AI'
                            className='rounded-full w-10 h-10'
                        />
                    </div>
                    <span className='absolute bottom-0 right-0 w-3 h-3 bg-[#6d72d8] border-2 border-white rounded-full' />
                </div>

                <div className='flex flex-col'>
                    <span className='text-[15px] font-black text-[#2f3348] leading-tight'>Tiyú</span>
                    <span className='text-[11px] font-bold text-[#6d72d8] leading-tight'>
                        En línea · Siempre aquí para ti
                    </span>
                </div>
            </div>

            <button
                onClick={() => setShowModal(true)}
                className='text-[11px] font-bold text-[#9b9fb8] hover:text-[#6d72d8] transition-colors px-2 py-1 rounded-lg hover:bg-[#edefff]'
            >
                Limpiar
            </button>
        </header>
        {showModal && (
            <ClearHistoryModal 
                onConfirm={handleConfirmClear}
                onCancel={() => setShowModal(false)}
            />
        )}
        </>
    );
}