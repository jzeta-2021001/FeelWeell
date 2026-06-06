import { useState } from 'react';
import { Settings, Bell, UserRound, BarChart2, Dumbbell, MessageCircle, BellRing } from 'lucide-react';
import { useAuthStore } from '../../auth/store/authStore';
import { useUserStore } from '../store/useUsersStore';
import { EditProfileModal } from '../components/EditProfileModal';
import toast from 'react-hot-toast';

const MOODS = ['Bien', 'Normal', 'Mal', 'Ansioso'];
const QUICK_ACTIONS = [
    { icon: BarChart2, label: 'Historial', sub: '12' },
    { icon: Dumbbell, label: 'Ejercicios', sub: '1/3' },
    { icon: MessageCircle, label: 'Chat', sub: '•' },
    { icon: BellRing, label: 'Alertas', sub: '2' },
];
const DAILY_ITEMS = ['Reto Diario', 'Escribir como me siento'];

export const UserPage = () => {
    const user = useAuthStore((s) => s.user);
    const { updateProfile, loading } = useUserStore();
    const [selectedMood, setSelectedMood] = useState(null);
    const [selectedIntensity, setSelectedIntensity] = useState(null);
    const [showEditProfile, setShowEditProfile] = useState(false);

    const handleSaveProfile = async (profileData) => {
        const result = await updateProfile(profileData);
        if (result.success) { toast.success('Perfil actualizado correctamente'); return { success: true }; }
        toast.error(result.error || 'Error al actualizar el perfil');
        return { success: false };
    };

    return (
        <>
            {/* Topbar */}
            <div className='flex justify-between items-center mb-7'>
                <div />
                <div className='flex gap-2'>
                    {[Settings, Bell].map((Icon, i) => (
                        <button key={i} className='w-[38px] h-[38px] border border-[#e5e7f0] rounded-[10px] bg-white grid place-items-center cursor-pointer text-[#6d72d8]'>
                            <Icon size={18} />
                        </button>
                    ))}
                    <button onClick={() => setShowEditProfile(true)}
                        className='w-[38px] h-[38px] border border-[#e5e7f0] rounded-[10px] bg-white grid place-items-center cursor-pointer text-[#6d72d8]'>
                        <UserRound size={18} />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className='flex flex-col gap-[18px]'>
                <p className='m-0 text-[15px] text-[#7b8094] font-bold'>Hola, {user?.firstName} {user?.surname}</p>
                <h1 className='m-0 text-[32px] font-black text-[#2f3348]'>¿Cómo te sientes hoy?</h1>
                <p className='m-0 text-sm text-[#9b9fb8] italic'>"Cada día es una nueva oportunidad para mejorar."</p>

                {/* Mood */}
                <div className='flex gap-2.5 flex-wrap'>
                    {MOODS.map(label => (
                        <button key={label} onClick={() => setSelectedMood(label)}
                            className={`px-[22px] py-2.5 border-2 rounded-full text-sm font-extrabold cursor-pointer transition-all ${selectedMood === label ? 'bg-[#8b91ef] border-[#8b91ef] text-white' : 'border-[#e5e7f0] bg-white text-[#505570] hover:border-[#8b91ef] hover:text-[#6d72d8]'}`}>
                            {label}
                        </button>
                    ))}
                </div>

                <p className='m-0 text-sm font-extrabold text-[#505570]'>¿Qué tan fuerte sientes la emoción?</p>

                {/* Intensidad */}
                <div className='flex gap-2 flex-wrap'>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                        <button key={n} onClick={() => setSelectedIntensity(n)}
                            className={`w-10 h-10 border-2 rounded-[10px] text-sm font-extrabold cursor-pointer transition-all ${selectedIntensity === n ? 'bg-[#8b91ef] border-[#8b91ef] text-white' : 'border-[#e5e7f0] bg-white text-[#505570] hover:border-[#8b91ef]'}`}>
                            {n}
                        </button>
                    ))}
                </div>

                {/* Daily items */}
                <div className='flex flex-col gap-2.5'>
                    {DAILY_ITEMS.map(label => (
                        <button key={label}
                            className='flex items-center gap-3 px-[18px] py-3.5 border border-[#e5e7f0] rounded-[14px] bg-white cursor-pointer text-left hover:bg-[#f5f6ff] transition-colors'>
                            <span className='text-sm font-extrabold text-[#505570]'>{label}</span>
                        </button>
                    ))}
                </div>

                {/* Quick actions */}
                <div className='grid grid-cols-4 gap-3'>
                    {QUICK_ACTIONS.map(({ icon: Icon, label, sub }) => (
                        <button key={label}
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