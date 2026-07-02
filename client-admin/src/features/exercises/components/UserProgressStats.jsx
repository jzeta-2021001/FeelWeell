import { CheckCircle2, Bookmark, Clock } from 'lucide-react';

const STATS = [
    { key: 'totalCompleted', icon: CheckCircle2, label: 'Completados', color: '#2e7d52', bg: '#e8f5e9' },
    { key: 'totalSaved', icon: Bookmark, label: 'Guardados', color: '#6d72d8', bg: '#edefff' },
    { key: 'totalPending', icon: Clock, label: 'Pendientes', color: '#e65100', bg: '#fff3e0' },
];

export const UserProgressStats = ({ progress, loading }) => {
    return (
        <div className='grid grid-cols-3 gap-3'>
            {STATS.map(({ key, icon: Icon, label, color, bg }) => (
                <div key={key} className='bg-white border border-[#e5e7f0] rounded-2xl p-4 flex flex-col gap-1'>
                    <div className='w-8 h-8 rounded-xl flex items-center justify-center mb-1' style={{ background: bg }}>
                        <Icon size={15} style={{ color }} />
                    </div>
                    {loading
                        ? <div className='h-7 w-8 bg-[#f0f0f0] rounded animate-pulse' />
                        : <span className='text-2xl font-black' style={{ color }}>
                            {progress?.summary?.[key] ?? 0}
                        </span>
                    }
                    <span className='text-[11px] font-bold text-fw-gray'>{label}</span>
                </div>
            ))}
        </div>
    );
};