import { Trash2 } from 'lucide-react';

export const ConfirmModal = ({ title, description, onConfirm, onCancel }) => (
    <div className='fixed inset-0 bg-fw-gray/40 flex items-center justify-center z-[999] p-5'>
        <div className='w-full max-w-[340px] bg-white rounded-[20px] overflow-hidden animate-fadeInScale'>

            <div className='flex justify-center pt-7 pb-4'>
                <div className='w-14 h-14 rounded-full bg-fw-pink/10 flex items-center justify-center'>
                    <Trash2 size={24} className='text-fw-pink' />
                </div>
            </div>

            <div className='px-6 pb-5 text-center'>
                <h3 className='text-[17px] font-black text-[#2f3348] mb-1.5'>{title}</h3>
                <p className='text-[13px] font-bold text-fw-gray leading-relaxed'>{description}</p>
            </div>

            <div className='flex gap-2.5 px-6 pb-6'>
                <button
                    onClick={onCancel}
                    className='flex-1 h-11 border-[1.5px] border-[#e5e7f0] rounded-full bg-white text-[13px] font-extrabold text-fw-gray hover:bg-fw-purple-bg transition-colors'
                >
                    Cancelar
                </button>
                <button
                    onClick={onConfirm}
                    className='flex-1 h-11 rounded-full bg-fw-pink text-white text-[13px] font-extrabold hover:opacity-90 transition-opacity'
                >
                    Sí, eliminar
                </button>
            </div>
        </div>
    </div>
);