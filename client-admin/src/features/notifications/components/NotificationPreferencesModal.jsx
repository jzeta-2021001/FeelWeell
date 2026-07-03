import { useEffect, useState } from 'react';
import { X, Smile, Dumbbell, Flame, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const TYPES = [
    { value: 'MOOD_REMINDER', label: 'Registro de ánimo', icon: Smile, desc: 'Recordatorio diario para registrar cómo te sientes' },
    { value: 'EXERCISE_REMINDER', label: 'Ejercicios pendientes', icon: Dumbbell, desc: 'Aviso cuando tienes un ejercicio guardado sin completar' },
    { value: 'STREAK_ALERT', label: 'Racha en riesgo', icon: Flame, desc: 'Alerta cuando tu racha está por perderse' },
];

export const NotificationPreferencesModal = ({ isOpen, onClose, preferences, onToggleType, onUpdatePreferences }) => {
    const [reminderTime, setReminderTime] = useState('09:00');
    const [pushEnabled, setPushEnabled] = useState(true);
    const [savingTime, setSavingTime] = useState(false);
    const [togglingType, setTogglingType] = useState(null);

    useEffect(() => {
        if (preferences) {
            setReminderTime(preferences.reminderTime ?? '09:00');
            setPushEnabled(preferences.pushEnabled ?? true);
        }
    }, [preferences]);

    if (!isOpen) return null;

    const activeTypes = preferences?.activeTypes ?? [];

    const handleToggle = async (type) => {
        setTogglingType(type);
        const isActive = activeTypes.includes(type);
        const result = await onToggleType(type, !isActive);
        setTogglingType(null);
        if (!result.success) toast.error(result.error || 'No se pudo actualizar');
    };

    const handleSaveGeneral = async () => {
        setSavingTime(true);
        const result = await onUpdatePreferences({ reminderTime, pushEnabled });
        setSavingTime(false);
        if (result.success) toast.success('Preferencias guardadas');
        else toast.error(result.error || 'No se pudieron guardar las preferencias');
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4' onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className='w-full max-w-md bg-white rounded-3xl p-6 flex flex-col gap-5 animate-fadeInScale max-h-[85vh] overflow-y-auto'
            >
                <div className='flex items-center justify-between'>
                    <h2 className='m-0 text-lg font-black text-[#2f3348]'>Preferencias de notificaciones</h2>
                    <button
                        onClick={onClose}
                        className='w-8 h-8 rounded-full border-none bg-[#f5f6ff] text-[#7b8094] grid place-items-center cursor-pointer hover:bg-[#e5e7f0] transition-colors'
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className='flex flex-col gap-3'>
                    <p className='m-0 text-xs font-extrabold text-[#8b91ef] uppercase tracking-widest'>Tipos de alerta</p>
                    {TYPES.map(({ value, label, icon: Icon, desc }) => {
                        const active = activeTypes.includes(value);
                        return (
                            <div
                                key={value}
                                className='flex items-center gap-3 p-3.5 border border-[#e5e7f0] rounded-2xl'
                            >
                                <div className='w-9 h-9 rounded-xl bg-[#edefff] text-[#6d72d8] grid place-items-center shrink-0'>
                                    <Icon size={16} />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='m-0 text-sm font-black text-[#2f3348]'>{label}</p>
                                    <p className='m-0 text-xs text-[#9b9fb8] font-semibold mt-0.5'>{desc}</p>
                                </div>
                                <button
                                    onClick={() => handleToggle(value)}
                                    disabled={togglingType === value}
                                    className={`relative w-11 h-6 rounded-full border-none cursor-pointer transition-colors shrink-0 disabled:opacity-60 ${
                                        active ? 'bg-[#8b91ef]' : 'bg-[#e5e7f0]'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                            active ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className='flex flex-col gap-3 pt-2 border-t border-[#e5e7f0]'>
                    <p className='m-0 text-xs font-extrabold text-[#8b91ef] uppercase tracking-widest'>General</p>

                    <div className='flex items-center justify-between gap-3'>
                        <label className='text-sm font-bold text-[#505570]'>Hora de recordatorio diario</label>
                        <input
                            type='time'
                            value={reminderTime}
                            onChange={(e) => setReminderTime(e.target.value)}
                            className='h-10 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3 text-sm font-semibold text-[#2f3348] outline-none focus:border-[#8b91ef] cursor-pointer'
                        />
                    </div>

                    <div className='flex items-center justify-between gap-3'>
                        <label className='text-sm font-bold text-[#505570]'>Notificaciones push</label>
                        <button
                            onClick={() => setPushEnabled((p) => !p)}
                            className={`relative w-11 h-6 rounded-full border-none cursor-pointer transition-colors shrink-0 ${
                                pushEnabled ? 'bg-[#8b91ef]' : 'bg-[#e5e7f0]'
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                    pushEnabled ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                        </button>
                    </div>

                    <button
                        onClick={handleSaveGeneral}
                        disabled={savingTime}
                        className='w-full h-11 mt-1 border-none rounded-full bg-[#8b91ef] text-white text-sm font-black cursor-pointer hover:bg-[#7278e0] transition-colors disabled:opacity-60 flex items-center justify-center gap-2'
                    >
                        {savingTime && <Loader2 size={16} className='animate-spin' />}
                        {savingTime ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
};