import { useState, useEffect, useCallback } from 'react';
import { BarChart2, Flame, RotateCcw, AlertCircle } from 'lucide-react';
import { adminGetAllStreaks, adminResetStreak } from '../../../shared/apis/streak';
import toast from 'react-hot-toast';

const MOOD_STATS = [
    { label: 'Bien',    count: 1423, pct: 36, bg: 'bg-green-50',  emoji: '😊' },
    { label: 'Normal',  count: 1102, pct: 28, bg: 'bg-indigo-50', emoji: '😐' },
    { label: 'Ansioso', count:  867, pct: 22, bg: 'bg-orange-50', emoji: '😰' },
    { label: 'Mal',     count:  515, pct: 13, bg: 'bg-pink-50',   emoji: '😔' },
];

const MOOD_BADGE = {
    Bien:    'bg-green-100 text-green-700',
    Normal:  'bg-blue-100 text-blue-700',
    Ansioso: 'bg-orange-100 text-orange-700',
    Mal:     'bg-pink-100 text-pink-700',
};

const RECENT = [
    { user: '@maria_g',  mood: 'Bien',    intensity: 7, date: '04 Jun 2026' },
    { user: '@jluis_m',  mood: 'Ansioso', intensity: 8, date: '04 Jun 2026' },
    { user: '@sofia_r',  mood: 'Normal',  intensity: 5, date: '04 Jun 2026' },
    { user: '@carlos_p', mood: 'Mal',     intensity: 9, date: '03 Jun 2026' },
];

// ── Sección de Rachas ──────────────────────────────────────────────────────

const StreaksSection = () => {
    const [streaks, setStreaks]         = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);
    const [resetting, setResetting]     = useState(null);
    const [confirmId, setConfirmId]     = useState(null);

    const fetchStreaks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await adminGetAllStreaks();
            setStreaks(data.data ?? []);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar las rachas');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStreaks(); }, [fetchStreaks]);

    const handleReset = async (userId) => {
        setResetting(userId);
        setConfirmId(null);
        try {
            await adminResetStreak(userId);
            toast.success(`Racha de ${userId} reseteada`);
            // Actualizar solo esa fila localmente
            setStreaks(prev =>
                prev.map(s => s.userId === userId
                    ? { ...s, currentStreak: 0, lastRegisteredAt: null }
                    : s
                )
            );
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al resetear la racha');
        } finally {
            setResetting(null);
        }
    };

    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header de la sección */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-50">
                <div className="flex items-center gap-2">
                    <Flame size={16} className="text-orange-400" />
                    <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                        Rachas de usuarios
                    </h3>
                </div>
                <button
                    onClick={fetchStreaks}
                    disabled={loading}
                    className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold flex items-center gap-1 disabled:opacity-40"
                >
                    <RotateCcw size={12} className={loading ? 'animate-spin' : ''} />
                    Actualizar
                </button>
            </div>

            {/* Estados */}
            {loading && (
                <div className="flex flex-col gap-2 p-5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                </div>
            )}

            {!loading && error && (
                <div className="flex items-center gap-2 p-5 text-red-500">
                    <AlertCircle size={16} />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {!loading && !error && streaks.length === 0 && (
                <p className="text-sm text-gray-400 p-5">No hay rachas registradas aún.</p>
            )}

            {/* Tabla */}
            {!loading && !error && streaks.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Usuario</th>
                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Racha actual</th>
                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Racha máx.</th>
                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Último registro</th>
                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {streaks.map((s) => (
                                <tr key={s.userId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3 font-medium text-gray-800">
                                        <span className="block">{s.username ?? s.userId}</span>
                                        <span className="text-[11px] text-gray-400 font-normal">{s.userId}</span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <Flame size={13} className={s.currentStreak > 0 ? 'text-orange-400' : 'text-gray-300'} />
                                            <span className={`font-bold ${s.currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                                                {s.currentStreak} días
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-gray-500">{s.maxStreak} días</td>
                                    <td className="px-5 py-3 text-gray-400">{formatDate(s.lastRegisteredAt)}</td>
                                    <td className="px-5 py-3">
                                        {confirmId === s.userId ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">¿Confirmar?</span>
                                                <button
                                                    onClick={() => handleReset(s.userId)}
                                                    disabled={resetting === s.userId}
                                                    className="text-xs px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 font-semibold"
                                                >
                                                    {resetting === s.userId ? '...' : 'Sí'}
                                                </button>
                                                <button
                                                    onClick={() => setConfirmId(null)}
                                                    className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 font-semibold"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setConfirmId(s.userId)}
                                                disabled={s.currentStreak === 0}
                                                className="text-xs px-3 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                Resetear
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// ── Página principal ───────────────────────────────────────────────────────

export const MoodTrackingPage = () => (
    <div className="p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                <BarChart2 size={20} />
            </div>
            <div>
                <h2 className="text-lg font-semibold text-gray-800">Mood Tracking</h2>
                <p className="text-sm text-gray-500">Seguimiento del estado de ánimo de los usuarios</p>
            </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4">
            {MOOD_STATS.map(({ label, count, pct, bg, emoji }) => (
                <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg ${bg} text-lg`}>{emoji}</div>
                        <span className="text-xs text-gray-400 font-medium">{pct}%</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{count.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
                </div>
            ))}
        </div>

        {/* Tabla de registros recientes */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase px-5 pt-4 pb-2">
                Registros recientes
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Usuario</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Ánimo</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Intensidad</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Fecha</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {RECENT.map((r, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-3 font-medium text-gray-800">{r.user}</td>
                                <td className="px-5 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${MOOD_BADGE[r.mood]}`}>{r.mood}</span>
                                </td>
                                <td className="px-5 py-3 text-gray-500">{r.intensity} / 10</td>
                                <td className="px-5 py-3 text-gray-400">{r.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Sección de rachas (conectada al backend) */}
        <StreaksSection />
    </div>
);