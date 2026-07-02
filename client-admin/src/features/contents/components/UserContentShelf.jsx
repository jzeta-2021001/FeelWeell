import { Search, LayoutGrid } from 'lucide-react';
import { CONTENT_TYPES, CONTENT_CATEGORIES, CATEGORY_STYLES, CATEGORY_ICONS } from '../constants/constants.js';

const TYPE_LABELS = {
    'VIDEO': 'Video',
    'ARTÍCULO': 'Artículo',
    'RECURSO': 'Recurso',
};

export const UserContentShelf = ({
    search,
    onSearchChange,
    categoryFilter,
    onCategoryChange,
    typeFilter,
    onTypeChange,
    categoryCounts,
}) => {
    return (
        <div className='hidden lg:flex flex-col gap-6 bg-[#fcfcff] border-r border-[#e5e7f0] p-6 h-full overflow-y-auto'>
            <div>
                <h2 className='m-0 text-lg font-black text-[#2f3348]'>Biblioteca</h2>
                <p className='m-0 mt-1 text-xs text-fw-gray font-semibold'>Explora contenido para tu bienestar</p>
            </div>

            <div className='flex items-center gap-2 bg-white border-[1.5px] border-[#e5e7f0] rounded-xl px-3 h-10'>
                <Search size={15} className='text-fw-gray shrink-0' />
                <input
                    type='text'
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder='Buscar...'
                    className='flex-1 border-none outline-none bg-transparent text-[13.5px] font-semibold text-[#2f3348] placeholder:text-fw-gray'
                />
            </div>

            <div>
                <p className='m-0 mb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#9b9fb8]'>Categorías</p>
                <div className='flex flex-col gap-1'>
                    <button
                        onClick={() => onCategoryChange('ALL')}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-none cursor-pointer text-left transition-colors ${categoryFilter === 'ALL' ? 'bg-white shadow-sm border border-[#e5e7f0]' : 'bg-transparent hover:bg-fw-purple-bg'}`}
                    >
                        <span className='w-[9px] h-[9px] rounded-[3px] shrink-0 bg-fw-gray' />
                        <span className={`flex-1 text-[13.5px] font-extrabold ${categoryFilter === 'ALL' ? 'text-[#2f3348]' : 'text-[#4a4f6b]'}`}>Todas</span>
                        <span className='text-[11.5px] font-extrabold text-[#aeb2cc]'>{categoryCounts.ALL ?? 0}</span>
                    </button>

                    {CONTENT_CATEGORIES.map((cat) => {
                        const style = CATEGORY_STYLES[cat];
                        const Icon = CATEGORY_ICONS[cat] ?? LayoutGrid;
                        const isActive = categoryFilter === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => onCategoryChange(cat)}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-none cursor-pointer text-left transition-colors ${isActive ? 'bg-white shadow-sm border border-[#e5e7f0]' : 'bg-transparent hover:bg-fw-purple-bg'}`}
                            >
                                <span className='w-[9px] h-[9px] rounded-[3px] shrink-0' style={{ background: style?.dot }} />
                                <Icon size={13} className='shrink-0' style={{ color: style?.dot }} />
                                <span className={`flex-1 text-[13.5px] font-extrabold capitalize ${isActive ? 'text-[#2f3348]' : 'text-[#4a4f6b]'}`}>
                                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                </span>
                                <span className='text-[11.5px] font-extrabold text-[#aeb2cc]'>{categoryCounts[cat] ?? 0}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <p className='m-0 mb-3 text-[11px] font-extrabold uppercase tracking-widest text-[#9b9fb8]'>Tipo</p>
                <div className='flex gap-1.5 flex-wrap'>
                    <button
                        onClick={() => onTypeChange('ALL')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border-[1.5px] cursor-pointer transition-colors ${typeFilter === 'ALL' ? 'border-fw-purple-light text-fw-purple bg-fw-purple-bg' : 'border-[#e5e7f0] bg-white text-fw-gray hover:border-fw-purple-light'}`}
                    >
                        Todos
                    </button>
                    {CONTENT_TYPES.map((t) => (
                        <button
                            key={t}
                            onClick={() => onTypeChange(t)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border-[1.5px] cursor-pointer transition-colors ${typeFilter === t ? 'border-fw-purple-light text-fw-purple bg-fw-purple-bg' : 'border-[#e5e7f0] bg-white text-fw-gray hover:border-fw-purple-light'}`}
                        >
                            {TYPE_LABELS[t]}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};