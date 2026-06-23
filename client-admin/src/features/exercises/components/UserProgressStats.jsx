import { CheckCircle2, Bookmark, Clock } from 'lucide-react';

export const UserProgressStats = ({ progress, loading }) => {
    if (loading) {
        return (
            <div className='grid grid-cols-3 gap-3'>
                {[1, 2, 3].map((i) => (
                    <div key={i} className='bg-white border border-[#e5e7f0] rounded-2xl p-4 animate-pulse'>
                        <div className='h-7 bg-[#e5e7f0] rounded w-8 mb-1' />
                        <div className='h-3 bg-[#f0f0f0] rounded w-16' />
                    </div>
                ))}
            </div>
        );
    }

    const stats = [
        {
            icon: CheckCircle2,
            value: progress?.summary?.totalCompleted ?? 0,
            label: 'Completados',
            color: 'text-[#2e7d52]',
            bg: 'bg-[#e8f5e9]',
        },
        {
            icon: Bookmark,
            value: progress?.summary?.totalSaved ?? 0,
            label: 'Guardados',
            color: 'text-fw-purple',
            bg: 'bg-fw-purple-bg',
        },
        {
            icon: Clock,
            value: progress?.summary?.totalPending ?? 0,
            label: 'Pendientes',
            color: 'text-[#e65100]',
            bg: 'bg-[#fff3e0]',
        },
    ];

    return (
        <div className='grid grid-cols-3 gap-3'>
            {stats.map(({ icon: Icon, value, label, color, bg }) => (
                <div key={label} className='bg-white border border-[#e5e7f0] rounded-2xl p-4 flex flex-col gap-1'>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${bg} mb-1`}>
                        <Icon size={16} className={color} />
                    </div>
                    <span className={`text-2xl font-black ${color}`}>{value}</span>
                    <span className='text-xs font-bold text-fw-gray'>{label}</span>
                </div>
            ))}
        </div>
    );
};