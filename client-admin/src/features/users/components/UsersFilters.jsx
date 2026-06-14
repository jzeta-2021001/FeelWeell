export const UsersFilters = ({ search, onSearchChange, roleFilter, onRoleChange }) => (
    <div className='flex gap-3.5 flex-wrap bg-white border border-[#e5e7f0] rounded-lg p-6'>
        <input
            value={search}
            onChange={onSearchChange}
            placeholder='Buscar por nombre, usuario o correo...'
            className='flex-1 min-w-[200px] h-11 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 text-sm text-[#2f3348] font-semibold outline-none focus:border-fw-purple-light transition-colors'
        />
        <select
            value={roleFilter}
            onChange={onRoleChange}
            className='w-[200px] h-11 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 text-sm text-[#2f3348] font-semibold outline-none focus:border-fw-purple-light transition-colors cursor-pointer'
        >
            <option value='ALL'>Todos los roles</option>
            <option value='ADMIN_ROLE'>Admin Principal</option>
            <option value='ADMIN_USERS_ROLE'>Admin Usuarios</option>
            <option value='ADMIN_MOODTRACKING_ROLE'>Admin Mood Tracking</option>
            <option value='ADMIN_HEALTHY_ROLE'>Admin Healthy</option>
            <option value='USER_ROLE'>Usuario</option>
        </select>
    </div>
);