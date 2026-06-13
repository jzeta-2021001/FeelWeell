import { X } from 'lucide-react';

export const MotivationalModal = ({ isOpen, onClose, onSubmit, formData, setFormData, isEditing }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-800">
                        {isEditing ? 'Mantenimiento de Registro' : 'Inyección de Nuevo Mensaje'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={onSubmit} className="flex flex-col p-6 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-gray-700">Contenido *</label>
                        <textarea 
                            required rows={3}
                            className="px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm resize-none"
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-gray-700">Autor</label>
                            <input 
                                type="text"
                                className="px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
                                value={formData.author}
                                onChange={(e) => setFormData({...formData, author: e.target.value})}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-gray-700">Categoría</label>
                            <select 
                                className="px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm bg-white"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="motivacion">Motivación</option>
                                <option value="resiliencia">Resiliencia</option>
                                <option value="bienestar">Bienestar</option>
                                <option value="autoestima">Autoestima</option>
                            </select>
                        </div>
                    </div>
                    {isEditing && (
                        <div className="flex items-center gap-2 mt-2">
                            <input 
                                type="checkbox" id="isActiveToggle"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                            />
                            <label htmlFor="isActiveToggle" className="text-sm font-medium text-gray-700 cursor-pointer">
                                Habilitado para el pool de rotación
                            </label>
                        </div>
                    )}
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">Ejecutar Operación</button>
                    </div>
                </form>
            </div>
        </div>
    );
};