import { Heart, Plus } from 'lucide-react';

const MESSAGES = [
    { text: 'Cada día es una nueva oportunidad para mejorar.', mood: 'General', active: true },
    { text: 'Respirar profundo es el primer paso hacia la calma.', mood: 'Ansioso', active: true },
    { text: 'Está bien no estar bien. Lo importante es seguir.', mood: 'Mal', active: true },
    { text: 'Tu esfuerzo de hoy construye tu bienestar de mañana.', mood: 'Normal', active: false },
    { text: '¡Sigue así! Estás haciendo un gran trabajo.', mood: 'Bien', active: true },
];

export const MotivationalPage = () => (
    <div className="p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                    <Heart size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Mensajes Motivacionales</h2>
                    <p className="text-sm text-gray-500">Mensajes mostrados según el estado de ánimo</p>
                </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                <Plus size={16} /> Nuevo mensaje
            </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Mensaje</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Ánimo</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Estado</th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {MESSAGES.map((m) => (
                            <tr key={m.text} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-3 text-gray-700 max-w-xs">{m.text}</td>
                                <td className="px-5 py-3">
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-700">{m.mood}</span>
                                </td>
                                <td className="px-5 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                                        {m.active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-5 py-3">
                                    <div className="flex justify-end gap-2">
                                        <button className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">Editar</button>
                                        <button className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);