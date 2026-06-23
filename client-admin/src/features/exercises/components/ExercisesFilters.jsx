export const EXERCISE_TYPES = ['RESPIRACIÓN', 'MEDITACIÓN', 'YOGA', 'RELAJACIÓN', 'MINDFULNESS', 'ESTIRAMIENTO'];
export const PROFILE_TYPES  = ['EQUILIBRADO', 'RESILIENTE', 'ANSIOSO', 'DEPRESIVO'];

export const ExercisesFilters = ({ search, onSearchChange, typeFilter, onTypeChange, profileFilter, onProfileChange }) => (
    <div className='flex gap-3.5 flex-wrap bg-white border border-[#e5e7f0] rounded-lg p-6'>
        <input
            value={search}
            onChange={onSearchChange}
            placeholder='Buscar por título...'
            className='flex-1 min-w-[200px] h-11 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 text-sm text-[#2f3348] font-semibold outline-none focus:border-fw-purple-light transition-colors'
        />
        <select
            value={typeFilter}
            onChange={onTypeChange}
            className='w-[200px] h-11 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 text-sm text-[#2f3348] font-semibold outline-none focus:border-fw-purple-light transition-colors cursor-pointer'
        >
            <option value='ALL'>Todos los tipos</option>
            {EXERCISE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
            value={profileFilter}
            onChange={onProfileChange}
            className='w-[200px] h-11 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 text-sm text-[#2f3348] font-semibold outline-none focus:border-fw-purple-light transition-colors cursor-pointer'
        >
            <option value='ALL'>Todos los perfiles</option>
            {PROFILE_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
    </div>
);