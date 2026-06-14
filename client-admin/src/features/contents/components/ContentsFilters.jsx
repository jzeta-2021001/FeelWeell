import { CONTENT_TYPES, CONTENT_CATEGORIES } from '../constants/constants.js';

export const ContentsFilters = ({ search, onSearchChange, typeFilter, onTypeChange, categoryFilter, onCategoryChange }) => (
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
            {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
            value={categoryFilter}
            onChange={onCategoryChange}
            className='w-[220px] h-11 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 text-sm text-[#2f3348] font-semibold outline-none focus:border-fw-purple-light transition-colors cursor-pointer'
        >
            <option value='ALL'>Todas las categorías</option>
            {CONTENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
    </div>
);