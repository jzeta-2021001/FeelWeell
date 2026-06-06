import { BarChart2 } from 'lucide-react';

const MOOD_STATS = [
    { label: 'Bien', count: 1423, pct: 36, bg: 'bg-green-50', emoji: '😊' },
    { label: 'Normal', count: 1102, pct: 28, bg: 'bg-indigo-50', emoji: '😐' },
    { label: 'Ansioso', count: 867, pct: 22, bg: 'bg-orange-50', emoji: '😰' },
    { label: 'Mal', count: 515, pct: 13, bg: 'bg-pink-50', emoji: '😔' },
];

const MOOD_BADGE = {
    Bien: 'bg-green-100 text-green-700',
    Normal: 'bg-blue-100 text-blue-700',
    Ansioso: 'bg-orange-100 text-orange-700',
    Mal: 'bg-pink-100 text-pink-700',
};

const RECENT = [
    { user: '@maria_g', mood: 'Bien', intensity: 7, date: '04 Jun 2026' },
    { user: '@jluis_m', mood: 'Ansioso', intensity: 8, date: '04 Jun 2026' },
    { user: '@sofia_r', mood: 'Normal', intensity: 5, date: '04 Jun 2026' },
    { user: '@carlos_p', mood: 'Mal', intensity: 9, date: '03 Jun 2026' },
];

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

        {/* Table */}
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
    </div>
);