import { X, AlertTriangle } from 'lucide-react';

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Desactivar", cancelText = "Cancelar" }) => {
    // Si no está abierto, no renderizar nada
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col p-6 border border-gray-100">
                {/* Cabecera con icono de advertencia */}
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                        <AlertTriangle size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{message}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
                    >
                        {cancelText}
                    </button>
                    <button 
                        type="button" 
                        onClick={onConfirm} 
                        className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};