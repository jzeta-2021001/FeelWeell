import { useState, useEffect } from 'react';
import { Heart, Plus, X, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
    getAllMessages, 
    createMessage, 
    updateMessage, 
    deleteMessage 
} from '../../../shared/apis/motivational.js';

export const MotivationalPage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        content: '',
        author: '',
        category: 'motivacion',
        isActive: true
    });

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await getAllMessages();
            // Programación Defensiva: Asegurar que la data exista y sea estrictamente un Array
            if (response?.data?.success && Array.isArray(response.data.data)) {
                setMessages(response.data.data);
            } else {
                // Fallback seguro para prevenir la Pantalla Blanca
                setMessages([]);
                console.warn("La API no devolvió una lista válida de mensajes:", response);
            }
        } catch (error) {
            toast.error('Error al sincronizar el catálogo de mensajes.');
            console.error("Detalle de fallo API:", error);
            setMessages([]); // Protección anti-colapso
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleOpenModal = (message = null) => {
        if (message) {
            setEditingId(message.idMotivation);
            setFormData({
                content: message.content || '',
                author: message.author || '',
                category: message.category || 'motivacion',
                isActive: message.isActive
            });
        } else {
            setEditingId(null);
            setFormData({ content: '', author: '', category: 'motivacion', isActive: true });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateMessage(editingId, formData);
                toast.success('Registro actualizado exitosamente.');
            } else {
                await createMessage(formData);
                toast.success('Nuevo mensaje inyectado en la rotación.');
            }
            handleCloseModal();
            fetchMessages();
        } catch (error) {
            toast.error('Fallo en la operación. Verifique los datos.');
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro de excluir este mensaje de la rotación mensual?')) return;
        
        try {
            await deleteMessage(id);
            toast.success('Mensaje desactivado correctamente.');
            fetchMessages();
        } catch (error) {
            toast.error('Error al procesar la baja del registro.');
            console.error(error);
        }
    };

    return (
        <div className="p-6 flex flex-col gap-6 relative">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 shadow-sm">
                        <Heart size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Catálogo Motivacional</h2>
                        <p className="text-sm text-gray-500">Gestión del pool de rotación mensual ({messages.length} registros)</p>
                    </div>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Plus size={16} /> Nuevo mensaje
                </button>
            </div>

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
                                                <button 
                                                    onClick={() => handleOpenModal(m)}
                                                    className="p-1.5 text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                                                    title="Editar registro"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(m.idMotivation)}
                                                    className="p-1.5 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                                                    title="Excluir de rotación"
                                                >
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

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingId ? 'Mantenimiento de Registro' : 'Inyección de Nuevo Mensaje'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col p-6 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">Contenido *</label>
                                <textarea 
                                    required
                                    rows={3}
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
                            {editingId && (
                                <div className="flex items-center gap-2 mt-2">
                                    <input 
                                        type="checkbox"
                                        id="isActiveToggle"
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
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">Ejecutar Operación</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};