import { X } from 'lucide-react';
import { UserContentDetailBody } from './UserContentDetailBody.jsx';

export const UserContentModal = ({ content, onClose }) => {
    if (!content) return null;

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className='xl:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn'
            onClick={handleBackdrop}
        >
            <div className='bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fadeInScale relative'>
                <button
                    onClick={onClose}
                    className='absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center border-none cursor-pointer text-[#555] hover:bg-white transition-colors'
                >
                    <X size={16} />
                </button>
                <UserContentDetailBody content={content} />
            </div>
        </div>
    );
};