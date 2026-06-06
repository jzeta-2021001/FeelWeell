import { Users, FileText, Flame, Dumbbell } from 'lucide-react';

const STATS = [
    { icon: Users, label: 'Usuarios activos', value: '1,248', delta: '+12 hoy', bg: 'bg-indigo-50', iconColor: 'text-indigo-500' },
    { icon: FileText, label: 'Registros de ánimo', value: '3,907', delta: '+38 hoy', bg: 'bg-indigo-50', iconColor: 'text-indigo-500' },
    { icon: Flame, label: 'Rachas activas', value: '892', delta: '+5 hoy', bg: 'bg-orange-50', iconColor: 'text-orange-400' },
    { icon: Dumbbell, label: 'Ejercicios usados', value: '4', delta: '1 inact.', bg: 'bg-green-50', iconColor: 'text-green-500' },
];

const RECENT_ACTIVITY = [
    { user: '@maria_g', action: 'registró ánimo: Bien (7)', time: 'hace 2 min' },
    { user: '@jluis_m', action: 'completó ejercicio: Respiración 4-7-8', time: 'hace 8 min' },
    { user: '@sofia_r', action: 'inició racha de 7 días', time: 'hace 15 min' },
    { user: '@carlos_p', action: 'registró ánimo: Mal (9)', time: 'hace 22 min' },
];

export const PanelPage = () => (
    <div className="p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Panel General</h2>
                    <p className="text-sm text-gray-500">Panel de administración · FeelWell</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">⚙️</button>
                <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">🔔</button>
            </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4">
            {STATS.map(({ icon: Icon, label, value, delta, bg, iconColor }) => (
                <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg ${bg}`}>
                            <Icon size={20} className={iconColor} />
                        </div>
                        <span className="text-xs text-gray-400 font-medium">{delta}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
                </div>
            ))}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-400 tracking-widest px-5 pt-4 pb-2 uppercase">
                Actividad reciente
            </h3>
            <div className="divide-y divide-gray-50">
                {RECENT_ACTIVITY.map(({ user, action, time }) => (
                    <div key={user + time} className="flex items-center gap-3 px-5 py-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-sm shrink-0">
                            👤
                        </div>
                        <p className="text-sm text-gray-600 flex-1">
                            <span className="font-semibold text-gray-800">{user}</span> {action}
                        </p>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);