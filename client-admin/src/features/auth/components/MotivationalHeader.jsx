import { Heart, Plus } from 'lucide-react';

export const MotivationalHeader = ({ totalMessages, onOpenModal }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 shadow-sm">
                    <Heart size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Catálogo Motivacional</h2>
                    <p className="text-sm text-gray-500">Gestión del pool de rotación mensual ({totalMessages} registros)</p>
                </div>
            </div>
            <button 
                onClick={onOpenModal}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
                <Plus size={16} /> Nuevo mensaje
            </button>
        </div>
    );
};