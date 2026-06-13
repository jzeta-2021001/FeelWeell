import { Edit2, Trash2 } from 'lucide-react';

export const MotivationalTable = ({ messages, loading, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Contenido del Mensaje</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Categoría</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Estado</th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Operaciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="text-center py-8 text-gray-500 font-medium">Sincronizando datos...</td>
                            </tr>
                        ) : (!Array.isArray(messages) || messages.length === 0) ? (
                            <tr>
                                <td colSpan="4" className="text-center py-8 text-gray-500 font-medium">No existen registros o hubo un error de red.</td>
                            </tr>
                        ) : (
                            messages.map((m) => (
                                <tr key={m.idMotivation || Math.random()} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3 text-gray-700 max-w-md">
                                        <p className="line-clamp-2">{m.content}</p>
                                        <span className="text-xs text-gray-400 font-medium">- {m.author || 'Anónimo'}</span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-pink-50 text-pink-700 border border-pink-100 uppercase tracking-wider">
                                            {m.category}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${m.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                            {m.isActive ? 'En Rotación' : 'Desactivado'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => onEdit(m)} className="p-1.5 text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => onDelete(m.idMotivation)} className="p-1.5 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};