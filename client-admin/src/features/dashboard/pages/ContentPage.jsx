import { FileText, Plus } from 'lucide-react';

const CONTENT = [
    { title: 'Cómo manejar la ansiedad', type: 'Artículo', author: 'Dr. López', date: '01 Jun 2026', status: 'Publicado' },
    { title: 'Técnicas de relajación rápida', type: 'Video', author: 'Admin', date: '28 May 2026', status: 'Publicado' },
    { title: 'Guía de sueño saludable', type: 'PDF', author: 'Dr. Martínez', date: '20 May 2026', status: 'Borrador' },
    { title: 'Mindfulness para principiantes', type: 'Artículo', author: 'Admin', date: '15 May 2026', status: 'Publicado' },
];

export const ContentPage = () => (
    <div className="p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                    <FileText size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Contenido</h2>
                    <p className="text-sm text-gray-500">Gestión de contenido educativo</p>
                </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                <Plus size={16} /> Nuevo contenido
            </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Título</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Tipo</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Autor</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Fecha</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Estado</th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {CONTENT.map((c) => (
                            <tr key={c.title} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-3 font-medium text-gray-800">{c.title}</td>
                                <td className="px-5 py-3">
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{c.type}</span>
                                </td>
                                <td className="px-5 py-3 text-gray-500">{c.author}</td>
                                <td className="px-5 py-3 text-gray-400">{c.date}</td>
                                <td className="px-5 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'Publicado' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {c.status}
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