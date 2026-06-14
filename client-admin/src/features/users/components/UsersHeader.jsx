import { Users as UsersIcon, UserPlus } from 'lucide-react';

export const UsersHeader = ({ onNewUser }) => (
    <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3.5'>
            <div className='w-10 h-10 rounded-xl bg-fw-purple-bg grid place-items-center text-fw-purple'>
                <UsersIcon size={20} />
            </div>
            <div>
                <h2 className='m-0 text-[22px] font-black text-[#2f3348]'>Gestión de usuarios</h2>
                <p className='m-0 text-sm font-bold text-fw-gray'>Listado y administración de cuentas</p>
            </div>
        </div>
        <button
            onClick={onNewUser}
            className='flex items-center gap-2 h-[42px] px-5 border-none rounded-full bg-fw-purple-light text-white text-[15px] font-black cursor-pointer hover:bg-fw-purple transition-colors'
        >
            <UserPlus size={16} /> Nuevo usuario
        </button>
    </div>
);