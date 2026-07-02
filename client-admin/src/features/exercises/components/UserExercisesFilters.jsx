import { Search } from 'lucide-react';

const TYPES = [
    { value: 'ALL', label: 'Todos' },
    { value: 'RESPIRACIÓN', label: 'Respiración' },
    { value: 'MEDITACIÓN', label: 'Meditación' },
    { value: 'YOGA', label: 'Yoga' },
    { value: 'RELAJACIÓN', label: 'Relajación' },
    { value: 'MINDFULNESS', label: 'Mindfulness' },
    { value: 'ESTIRAMIENTO', label: 'Estiramiento' },
];

export const UserExercisesFilters = ({ search, onSearch, typeFilter, onTypeChange }) => (
    <div className='flex flex-col gap-3'>
        <div className='relative'>
            <Search size={14} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-fw-gray pointer-events-none' />
            <input
                type='text'
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder='Buscar ejercicio...'
                className='w-full pl-9 pr-4 py-2.5 border border-[#e5e7f0] rounded-xl bg-white text-sm font-semibold text-[#2f3348] placeholder:text-fw-gray focus:outline-none focus:border-fw-purple transition-colors'
            />
        </div>

        <div className='flex gap-2 flex-wrap'>
            {TYPES.map(({ value, label }) => (
                <button key={value} onClick={() => onTypeChange(value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-extrabold border-none cursor-pointer transition-colors
                        ${typeFilter === value
                            ? 'bg-fw-purple text-white'
                            : 'bg-white border border-[#e5e7f0] text-fw-gray hover:border-fw-purple hover:text-fw-purple'
                        }`}
                >
                    {label}
                </button>
            ))}
        </div>
    </div>
);