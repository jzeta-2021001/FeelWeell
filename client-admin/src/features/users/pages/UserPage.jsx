import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Bell, UserRound, BarChart2, Dumbbell, MessageCircle, BookOpen, Flame } from 'lucide-react';
import { useAuthStore } from '../../auth/store/authStore';
import { useUserStore } from '../store/useUsersStore';
import { useMoodStore } from '../../mood/store/moodStore.js';
import { EditProfileModal } from '../components/EditProfileModal';
import { TiyuMascot } from '../../../shared/components/ui/TiyuMascot.jsx';
import toast from 'react-hot-toast';

const MOOD_TO_EMOTION = {
    Bien: 'FELIZ',
    Normal: 'NEUTRAL',
    Mal: 'TRISTE',
    Ansioso: 'ANSIOSO',
};

const EMOTION_TO_MOOD = Object.fromEntries(
    Object.entries(MOOD_TO_EMOTION).map(([mood, emotion]) => [emotion, mood])
);

const MOODS = [
    { label: 'Bien', emoji: '😌' },
    { label: 'Normal', emoji: '😐' },
    { label: 'Mal', emoji: '😔' },
    { label: 'Ansioso', emoji: '😟' },
];

const DAILY_ITEMS = ['Reto Diario', 'Escribir como me siento'];

export const UserPage = () => {
    const user = useAuthStore((s) => s.user);
    const justLoggedIn = useAuthStore((s) => s.justLoggedIn);
    const clearJustLoggedIn = useAuthStore((s) => s.clearJustLoggedIn);
    const { updateProfile, loading } = useUserStore();
    const { todayMood, checkingToday, submitting, checkTodayMood, registerMood } = useMoodStore();
    const [selectedMood, setSelectedMood] = useState(null);
    const [selectedIntensity, setSelectedIntensity] = useState(null);
    const [feelingText, setFeelingText] = useState('');
    const [showEditProfile, setShowEditProfile] = useState(false);
    const navigate = useNavigate();
    const [dailyMessage, setDailyMessage] = useState("");
    const [loadingMessage, setLoadingMessage] = useState(true);
    const tiyuRef = useRef(null);

    // Tiyú saluda una sola vez, justo cuando el usuario acaba de iniciar sesión
    // (la bandera se limpia de inmediato para que no vuelva a saludar si el
    // usuario navega dentro de la app y regresa a esta pantalla).
    useEffect(() => {
        if (justLoggedIn) {
            tiyuRef.current?.sayHello();
            clearJustLoggedIn();
        }
    }, [justLoggedIn, clearJustLoggedIn]);

    const QUICK_ACTIONS = [
        { icon: BarChart2, label: 'Historial', sub: '12' },
        { icon: Dumbbell, label: 'Ejercicios', sub: '1/3', onClick: () => navigate('/home/exercises') },
        { icon: MessageCircle, label: 'Chat', sub: '•', onClick: () => navigate('/home/chat') },
        { icon: BookOpen, label: 'Contenido', sub: '•', onClick: () => navigate('/home/content') },
    ];

    useEffect(() => {
        const fetchDailyMessage = async () => {
            if (!user?.id && !user?._id) return;
            const userId = user.id || user._id;

            try {
                const baseUrl = import.meta.env.VITE_DAILY_MESSAGE_URL || 'http://localhost:5000';
                const response = await fetch(`${baseUrl}/api/daily-message/today/${userId}`);
                const result = await response.json();

                if (result.success && result.data) {
                    setDailyMessage(result.data.content || result.data.message || "Cada día es una nueva oportunidad para mejorar.");
                } else {
                    throw new Error("Estructura de respuesta inválida");
                }
            } catch (error) {
                console.error("Error al obtener el mensaje del día:", error);
                setDailyMessage("Cada día es una nueva oportunidad para mejorar.");
            } finally {
                setLoadingMessage(false);
            }
        };

        fetchDailyMessage();
    }, [user]);

    useEffect(() => {
        if (todayMood) {
            setSelectedMood(EMOTION_TO_MOOD[todayMood.emotion] ?? null);
            setSelectedIntensity(todayMood.intensity ?? null);
            setFeelingText(todayMood.note ?? '');
        } else {
            setSelectedMood(null);
            setSelectedIntensity(null);
            setFeelingText('');
        }
    }, [todayMood]);

    useEffect(() => {
        if (user?.id || user?._id) checkTodayMood();
    }, [user?.id, user?._id, checkTodayMood]);

    const handleSubmitMood = async () => {
        if (!selectedMood) { toast.error('Selecciona cómo te sientes'); return; }
        const result = await registerMood({
            emotion: MOOD_TO_EMOTION[selectedMood],
            intensity: selectedIntensity ?? 5,
            note: feelingText.trim(),
        });
        if (result.success) {
            toast.success('¡Registraste tu estado de ánimo!');
        } else {
            toast.error(result.error);
        }
    };

    const handleSaveProfile = async (profileData) => {
        const result = await updateProfile(profileData);
        if (result.success) { toast.success('Perfil actualizado correctamente'); return { success: true }; }
        toast.error(result.error || 'Error al actualizar el perfil');
        return { success: false };
    };

    return (
        <>
            <div className='flex justify-between items-center mb-7'>
                <div />
                <div className='flex gap-2'>
                    {[Settings, Bell].map((Icon, i) => (
                        <button key={i} className='w-[38px] h-[38px] border border-[#e5e7f0] rounded-[10px] bg-white grid place-items-center cursor-pointer text-[#6d72d8] shadow-sm hover:shadow-md transition-all'>
                            <Icon size={18} />
                        </button>
                    ))}
                    <button onClick={() => setShowEditProfile(true)}
                        className='w-[38px] h-[38px] border border-[#e5e7f0] rounded-[10px] bg-white grid place-items-center cursor-pointer text-[#6d72d8] shadow-sm hover:shadow-md transition-all'>
                        <UserRound size={18} />
                    </button>
                </div>
            </div>

            <div className='flex flex-col gap-[18px]'>
                <p className='m-0 text-[15px] text-[#7b8094] font-bold'>Hola, {user?.firstName} {user?.surname}</p>
                <h1 className='m-0 text-[32px] font-black text-[#2f3348]'>¿Cómo te sientes hoy?</h1>

                <div className='bg-gradient-to-r from-[#f5f6ff] to-white border-l-[5px] border-[#6d72d8] rounded-r-2xl p-5 my-1 shadow-sm flex items-start gap-4 transition-all hover:shadow-md'>
                    <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-[#eef0ff] to-[#dfe2fb] shrink-0 flex items-center justify-center overflow-hidden'>
                        <TiyuMascot ref={tiyuRef} size={62} />
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-[11px] font-extrabold text-[#8b91ef] uppercase tracking-widest mb-1.5'>Inspiración del día</span>
                        {loadingMessage ? (
                            <div className='h-4 bg-[#e5e7f0] rounded w-64 animate-pulse mt-1'></div>
                        ) : (
                            <p className='m-0 text-[15px] text-[#4a4f6b] font-medium italic leading-relaxed'>
                                "{dailyMessage}"
                            </p>
                        )}
                    </div>
                </div>

                {/* Widget de racha */}
                <div className='bg-[#fffbeb] border border-[#fde68a] rounded-2xl px-5 py-4 shadow-sm'>
                    <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center gap-2'>
                            <Flame size={18} className='text-[#f59e0b]' />
                            <span className='text-sm font-extrabold text-[#92400e]'>Tu racha</span>
                        </div>
                        <span className='text-lg font-black text-[#f59e0b]'>
                            {user?.streak ?? 0} <span className='text-sm font-bold text-[#b45309]'>día{(user?.streak ?? 0) !== 1 ? 's' : ''}</span>
                        </span>
                    </div>
                    <p className='m-0 text-[11px] text-[#b45309] font-semibold mb-2'>
                        Próximo hito: 7 días
                    </p>
                    <div className='w-full bg-[#fde68a] rounded-full h-2'>
                        <div
                            className='bg-[#f59e0b] h-2 rounded-full transition-all duration-500'
                            style={{ width: `${Math.min(((user?.streak ?? 0) / 7) * 100, 100)}%` }}
                        />
                    </div>
                    <p className='m-0 text-right text-[11px] text-[#b45309] font-bold mt-1'>
                        {Math.round(Math.min(((user?.streak ?? 0) / 7) * 100, 100))}%
                    </p>
                </div>

                <div className='bg-white border border-[#e5e7f0] rounded-2xl p-5 shadow-sm flex flex-col gap-5 mt-2'>
                    <div>
                        <p className='m-0 text-sm font-extrabold text-[#505570] mb-3'>Selecciona tu estado de ánimo</p>
                        <div className='grid grid-cols-4 gap-2.5'>
                            {MOODS.map(({ label, emoji }) => (
                                <button
                                    key={label}
                                    onClick={() => !todayMood && setSelectedMood(label)}
                                    disabled={!!todayMood}
                                    className={`flex flex-col items-center gap-2 py-4 px-2 rounded-2xl transition-all border-2 ${selectedMood === label ? 'bg-fw-purple-light border-fw-purple-light shadow-md' : 'bg-fw-purple-bg/60 border-transparent hover:border-fw-purple-light'} ${todayMood ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}>
                                    <span className='text-3xl leading-none'>{emoji}</span>
                                    <span className={`text-[13px] font-extrabold ${selectedMood === label ? 'text-white' : 'text-[#505570]'}`}>{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className='flex justify-between items-center mb-2'>
                            <p className='m-0 text-sm font-extrabold text-[#505570]'>¿Qué tan fuerte sientes la emoción?</p>
                            <span className='text-lg font-black text-fw-purple'>{selectedIntensity ?? 5}</span>
                        </div>
                        <input
                            type='range'
                            min={1}
                            max={10}
                            value={selectedIntensity ?? 5}
                            onChange={(e) => !todayMood && setSelectedIntensity(Number(e.target.value))}
                            disabled={!!todayMood}
                            className='w-full h-2 rounded-full appearance-none cursor-pointer accent-fw-purple bg-fw-purple-bg disabled:cursor-not-allowed disabled:opacity-90'
                        />
                        <div className='flex justify-between mt-1.5'>
                            <span className='text-[11px] font-bold text-[#9b9fb8]'>Leve (1)</span>
                            <span className='text-[11px] font-bold text-[#9b9fb8]'>Muy fuerte (10)</span>
                        </div>
                    </div>

                    <div>
                        <p className='m-0 text-sm font-extrabold text-[#505570] mb-2'>Escribir cómo me siento (opcional)</p>
                        <textarea
                            value={feelingText}
                            onChange={(e) => !todayMood && setFeelingText(e.target.value)}
                            disabled={!!todayMood}
                            placeholder='Puedes escribir lo que estás pensando...'
                            rows={3}
                            className='w-full border-[1.5px] border-[#e5e7f0] rounded-[14px] px-3.5 py-3 text-sm text-[#2f3348] font-semibold outline-none focus:border-fw-purple-light transition-colors resize-none placeholder:text-[#9b9fb8] placeholder:font-medium bg-fw-purple-bg/30 disabled:cursor-not-allowed disabled:opacity-90'
                        />
                    </div>
                </div>

                <button
                    onClick={handleSubmitMood}
                    disabled={submitting || !!todayMood}
                    className='h-[46px] rounded-full bg-fw-purple text-white text-[15px] font-black cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:bg-fw-purple-light transition-colors'
                >
                    {todayMood ? 'Ya registraste tu ánimo hoy ✓' : submitting ? 'Guardando...' : 'Guardar estado de ánimo'}
                </button>

                <button
                    className='flex items-center gap-3 px-[18px] py-3.5 border border-[#e5e7f0] rounded-[14px] bg-white cursor-pointer text-left hover:bg-[#f5f6ff] hover:border-[#c5c8f2] transition-colors shadow-sm mt-2'>
                    <span className='text-sm font-extrabold text-[#505570]'>Reto Diario</span>
                </button>

                <div className='grid grid-cols-4 gap-3'>
                    {QUICK_ACTIONS.map(({ icon: Icon, label, sub, onClick }) => (
                        <button key={label}
                            onClick={onClick}
                            className='flex flex-col items-center gap-1.5 px-2.5 py-[18px] border border-[#e5e7f0] rounded-2xl bg-white cursor-pointer hover:bg-[#f5f6ff] transition-colors'>
                            <Icon size={26} className='text-[#6d72d8]' />
                            <span className='text-[13px] font-extrabold text-[#505570]'>{label}</span>
                            <span className='text-xs font-bold text-[#9b9fb8]'>{sub}</span>
                        </button>
                    ))}
                </div>
            </div>

            <EditProfileModal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} onSave={handleSaveProfile} user={user} loading={loading} />
        </>
    );
};