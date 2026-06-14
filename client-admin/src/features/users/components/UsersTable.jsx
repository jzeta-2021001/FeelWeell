const PAGE_SIZE = 8;

const ROLE_STYLES = {
    ADMIN_ROLE: { label: 'Admin Principal', cls: 'bg-fw-pink/10 text-fw-pink' },
    ADMIN_USERS_ROLE: { label: 'Admin Usuarios', cls: 'bg-fw-purple-bg text-fw-purple' },
    ADMIN_MOODTRACKING_ROLE: { label: 'Admin Mood', cls: 'bg-fw-purple-bg text-fw-purple' },
    ADMIN_HEALTHY_ROLE: { label: 'Admin Healthy', cls: 'bg-fw-purple-bg text-fw-purple' },
    USER_ROLE: { label: 'Usuario', cls: 'bg-fw-purple-bg/60 text-fw-gray' },
};

const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });

export const UsersTable = ({
    users,
    loading,
    currentPage,
    totalPages,
    totalFiltered,
    authUserId,
    onEdit,
    onToggleStatus,
    onDelete,
    onPageChange,
}) => {
    const start = (currentPage - 1) * PAGE_SIZE + (users.length ? 1 : 0);
    const end = (currentPage - 1) * PAGE_SIZE + users.length;

    return (
        <div className='bg-white border border-[#e5e7f0] rounded-lg overflow-hidden'>
            <div className='overflow-x-auto'>
                <table className='w-full border-collapse'>
                    <thead>
                        <tr className='bg-fw-purple-bg/30'>
                            {['Usuario', 'Correo', 'Rol', 'Estado', 'Creado', 'Acciones'].map((h, i) => (
                                <th
                                    key={h}
                                    className={`px-4 py-3 text-left text-[13px] font-extrabold text-fw-gray whitespace-nowrap ${i === 5 ? 'text-right' : ''}`}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading && users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className='px-4 py-8 text-center text-fw-gray/60'>
                                    Cargando usuarios...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className='px-4 py-8 text-center text-fw-gray/60'>
                                    No hay usuarios para mostrar.
                                </td>
                            </tr>
                        ) : (
                            users.map((u) => {
                                const roleStyle = ROLE_STYLES[u.role] || ROLE_STYLES.USER_ROLE;
                                const isSelf = u._id === authUserId;
                                return (
                                    <tr key={u._id} className='border-t border-fw-purple-bg hover:bg-fw-purple-bg/20 transition-colors'>

                                        <td className='px-4 py-3.5'>
                                            <p className='m-0 font-extrabold text-[#2f3348] text-sm'>@{u.username}</p>
                                            <p className='m-0 text-xs text-fw-gray/70 mt-0.5'>
                                                {[u.firstName, u.surname].filter(Boolean).join(' ') || '—'}
                                            </p>
                                        </td>

                                        <td className='px-4 py-3.5 text-sm text-fw-gray'>{u.email}</td>

                                        <td className='px-4 py-3.5'>
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold ${roleStyle.cls}`}>
                                                {roleStyle.label}
                                            </span>
                                        </td>

                                        <td className='px-4 py-3.5'>
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold ${u.isActive ? 'bg-[#e8f5e9] text-[#2e7d52]' : 'bg-fw-pink/10 text-fw-pink'}`}>
                                                {u.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>

                                        <td className='px-4 py-3.5 text-xs text-fw-gray/70'>
                                            {u.createdAt ? formatDate(u.createdAt) : '—'}
                                        </td>

                                        <td className='px-4 py-3.5'>
                                            <div className='flex gap-2 justify-end flex-wrap'>
                                                {!isSelf && (
                                                    <button
                                                        onClick={() => onToggleStatus(u)}
                                                        className={`px-3.5 py-1 border-none rounded-lg text-[13px] font-bold cursor-pointer transition-colors ${u.isActive ? 'bg-fw-purple-light text-white hover:bg-fw-purple' : 'bg-fw-purple-bg text-fw-purple hover:bg-fw-purple hover:text-white transition-colors'}`}
                                                    >
                                                        {u.isActive ? 'Desactivar' : 'Activar'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className='flex justify-between items-center px-5 py-4 border-t border-fw-purple-bg flex-wrap gap-3'>
                <p className='m-0 text-[13px] font-bold text-fw-gray/70'>
                    Mostrando {start} – {end} de {totalFiltered}
                </p>
                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => onPageChange((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className='px-4 py-1.5 border border-[#e5e7f0] rounded-lg bg-white text-[13px] font-bold text-fw-gray cursor-pointer disabled:opacity-40 hover:border-fw-purple-light transition-colors'
                    >
                        Anterior
                    </button>
                    <span className='text-[13px] font-extrabold text-fw-purple'>
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className='px-4 py-1.5 border border-[#e5e7f0] rounded-lg bg-white text-[13px] font-bold text-fw-gray cursor-pointer disabled:opacity-40 hover:border-fw-purple-light transition-colors'
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};