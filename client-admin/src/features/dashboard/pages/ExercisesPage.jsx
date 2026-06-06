import { Dumbbell, Plus } from 'lucide-react';

const EXERCISES = [
    { name: 'Respiración 4-7-8', category: 'Respiración', duration: '5 min', uses: 312, status: 'Activo' },
    { name: 'Meditación guiada', category: 'Meditación', duration: '10 min', uses: 198, status: 'Activo' },
    { name: 'Escaneo corporal', category: 'Mindfulness', duration: '8 min', uses: 145, status: 'Activo' },
    { name: 'Diario de gratitud', category: 'Escritura', duration: '15 min', uses: 89, status: 'Inactivo' },
    { name: 'Caminata consciente', category: 'Movimiento', duration: '20 min', uses: 67, status: 'Activo' },
];

export const ExercisesPage = () => (
    <div className="p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                    <Dumbbell size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Ejercicios</h2>
                    <p className="text-sm text-gray-500">Gestión de ejercicios de bienestar</p>
                </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                <Plus size={16} /> Nuevo ejercicio
            </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Nombre</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Categoría</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Duración</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Usos</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Estado</th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {EXERCISES.map((ex) => (
                            <tr key={ex.name} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-3 font-medium text-gray-800">{ex.name}</td>
                                <td className="px-5 py-3">
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">{ex.category}</span>
                                </td>
                                <td className="px-5 py-3 text-gray-500">{ex.duration}</td>
                                <td className="px-5 py-3 text-gray-500">{ex.uses}</td>
                                <td className="px-5 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ex.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                                        {ex.status}
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