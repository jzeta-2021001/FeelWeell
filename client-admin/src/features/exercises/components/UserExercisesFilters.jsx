import { Search } from 'lucide-react';

const TYPES = ['RESPIRACIÓN', 'MEDITACIÓN', 'YOGA', 'RELAJACIÓN', 'MINDFULNESS', 'ESTIRAMIENTO'];

const TYPE_LABELS = {
    'RESPIRACIÓN': 'Respiración',
    'MEDITACIÓN': 'Meditación',
    'YOGA': 'Yoga',
    'RELAJACIÓN': 'Relajación',
    'MINDFULNESS': 'Mindfulness',
    'ESTIRAMIENTO': 'Estiramiento',
};

export const UserExercisesFilters = ({ search, onSearch, typeFilter, onTypeChange }) => {
    return (
        <div className='flex flex-col gap-3'>
            {/* Buscador */}
            <div className='relative'>
                <Search size={15} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-fw-gray pointer-events-none' />
                <input
                    type='text'
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder='Buscar ejercicio...'
                    className='w-full pl-9 pr-4 py-2.5 border border-[#e5e7f0] rounded-xl bg-white text-sm font-semibold text-[#2f3348] placeholder:text-fw-gray focus:outline-none focus:border-fw-purple transition-colors'
                />
            </div>

            {/* Chips de tipo */}
            <div className='flex gap-2 flex-wrap'>
                <button
                    onClick={() => onTypeChange('ALL')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border-none cursor-pointer transition-colors ${typeFilter === 'ALL' ? 'bg-fw-purple text-white' : 'bg-white border border-[#e5e7f0] text-fw-gray hover:border-fw-purple hover:text-fw-purple'}`}
                >
                    Todos
                </button>
                {TYPES.map((t) => (
                    <button
                        key={t}
                        onClick={() => onTypeChange(t)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border-none cursor-pointer transition-colors ${typeFilter === t ? 'bg-fw-purple text-white' : 'bg-white border border-[#e5e7f0] text-fw-gray hover:border-fw-purple hover:text-fw-purple'}`}
                    >
                        {TYPE_LABELS[t]}
                    </button>
                ))}
            </div>
        </div>
    );
};