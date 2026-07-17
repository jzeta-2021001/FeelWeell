import { Search } from 'lucide-react';
import { CONTENT_TYPES, CONTENT_CATEGORIES } from '../constants/constants.js';

export const UserContentMobileFilters = ({
    search,
    onSearchChange,
    categoryFilter,
    onCategoryChange,
    typeFilter,
    onTypeChange,
}) => {
    return (
        <div className='flex lg:hidden flex-col gap-3 bg-white border border-[#e5e7f0] rounded-2xl p-4'>
            <div className='flex items-center gap-2 bg-[#f9f9ff] border-[1.5px] border-[#e5e7f0] rounded-xl px-3 h-10'>
                <Search size={15} className='text-fw-gray shrink-0' />
                <input
                    type='text'
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder='Buscar contenido...'
                    className='flex-1 border-none outline-none bg-transparent text-[13.5px] font-semibold text-[#2f3348] placeholder:text-fw-gray'
                />
            </div>
            <div className='grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2'>
                <select
                    value={categoryFilter}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className='flex-1 h-10 border-[1.5px] border-[#e5e7f0] rounded-xl px-2.5 text-xs font-bold text-[#2f3348] outline-none focus:border-fw-purple-light'
                >
                    <option value='ALL'>Todas las categorías</option>
                    {CONTENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                    value={typeFilter}
                    onChange={(e) => onTypeChange(e.target.value)}
                    className='flex-1 h-10 border-[1.5px] border-[#e5e7f0] rounded-xl px-2.5 text-xs font-bold text-[#2f3348] outline-none focus:border-fw-purple-light'
                >
                    <option value='ALL'>Todos los tipos</option>
                    {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
        </div>
    );
};
