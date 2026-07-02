import { useForm } from 'react-hook-form';

const inputCls = 'w-full h-11 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 text-sm text-[#2f3348] font-semibold outline-none focus:border-[#8b91ef] transition-colors';
const labelCls = 'block text-[13px] font-extrabold text-[#505570] mb-1.5';

export const CreateUserModal = ({ isOpen, onClose, onCreate, loading }) => {
    const { register, handleSubmit, getValues, reset, formState: { errors } } = useForm();

    if (!isOpen) return null;

    const onSubmit = async (data) => {
        const { confirmPassword, ...userData } = data;
        const result = await onCreate(userData);
        if (result.success) { reset(); onClose(); }
    };

    const handleClose = () => { reset(); onClose(); };

    return (
        <div className='fixed inset-0 bg-[rgba(40,40,80,0.35)] flex items-center justify-center z-[999] p-5'>
            <div className='w-full max-w-[560px] bg-white rounded-[24px] shadow-[0_24px_80px_rgba(90,85,140,0.18)] overflow-hidden'>
                <div className='flex justify-between items-start px-7 pt-6 pb-4 border-b border-[#f0f1f8]'>
                    <div>
                        <h2 className='m-0 text-lg font-black text-[#2f3348]'>Nuevo usuario</h2>
                        <p className='mt-0.5 text-[13px] text-[#9b9fb8] font-bold'>Completa la información para registrar un nuevo usuario</p>
                    </div>
                    <button type='button' onClick={handleClose} className='border-none bg-[#f0f1f8] rounded-lg w-8 h-8 cursor-pointer text-sm text-[#7b8094]'>✕</button>
                </div>

                <form className='flex flex-col gap-4 px-7 py-5' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-2 gap-3.5'>
                        <div><label className={labelCls}>Nombre</label>
                            <input className={inputCls} {...register('firstName', { required: 'El nombre es obligatorio' })} />
                            {errors.firstName && <span className='text-[#d14b6d] text-[13px] font-bold'>{errors.firstName.message}</span>}
                        </div>
                        <div><label className={labelCls}>Apellido</label>
                            <input className={inputCls} {...register('surname', { required: 'El apellido es obligatorio' })} />
                            {errors.surname && <span className='text-[#d14b6d] text-[13px] font-bold'>{errors.surname.message}</span>}
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-3.5'>
                        <div><label className={labelCls}>Usuario</label>
                            <input className={inputCls} {...register('username', { required: 'El usuario es obligatorio', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })} />
                            {errors.username && <span className='text-[#d14b6d] text-[13px] font-bold'>{errors.username.message}</span>}
                        </div>
                        <div><label className={labelCls}>Teléfono</label>
                            <input className={inputCls} type='tel' {...register('phone')} />
                        </div>
                    </div>

                    <div><label className={labelCls}>Correo electrónico</label>
                        <input className={inputCls} type='email' {...register('email', { required: 'El correo es obligatorio', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato inválido' } })} />
                        {errors.email && <span className='text-[#d14b6d] text-[13px] font-bold'>{errors.email.message}</span>}
                    </div>

                    <div><label className={labelCls}>Rol</label>
                        <select className={inputCls} {...register('role', { required: 'El rol es obligatorio' })}>
                            <option value=''>Selecciona un rol</option>
                            <option value='USER_ROLE'>Usuario</option>
                            <option value='ADMIN_ROLE'>Administrador general</option>
                            <option value='ADMIN_USERS_ROLE'>Admin de usuarios</option>
                            <option value='ADMIN_MOODTRACKING_ROLE'>Admin de Mood Tracking</option>
                            <option value='ADMIN_HEALTHY_ROLE'>Admin de Healthy</option>
                        </select>
                        {errors.role && <span className='text-[#d14b6d] text-[13px] font-bold'>{errors.role.message}</span>}
                    </div>

                    <div className='grid grid-cols-2 gap-3.5'>
                        <div><label className={labelCls}>Contraseña</label>
                            <input className={inputCls} type='password' {...register('password', { required: 'La contraseña es obligatoria', minLength: { value: 8, message: 'Mínimo 8 caracteres' } })} />
                            {errors.password && <span className='text-[#d14b6d] text-[13px] font-bold'>{errors.password.message}</span>}
                        </div>
                        <div><label className={labelCls}>Confirmar contraseña</label>
                            <input className={inputCls} type='password' {...register('confirmPassword', { required: 'Confirma la contraseña', validate: v => v === getValues('password') || 'Las contraseñas no coinciden' })} />
                            {errors.confirmPassword && <span className='text-[#d14b6d] text-[13px] font-bold'>{errors.confirmPassword.message}</span>}
                        </div>
                    </div>

                    <div className='pt-1'>
                        <label className='flex items-start gap-2.5 cursor-pointer select-none'>
                            <span className='relative mt-0.5 shrink-0'>
                                <input
                                    type='checkbox'
                                    className='peer sr-only'
                                    {...register('acceptTerms', { required: 'Debes aceptar los términos y condiciones' })}
                                />
                                <span className='block w-5 h-5 rounded-[6px] border-[1.5px] border-[#e5e7f0] bg-white transition-colors duration-150 peer-checked:bg-[#8b91ef] peer-checked:border-[#8b91ef] peer-focus-visible:ring-2 peer-focus-visible:ring-[#8b91ef]/30' />
                                <svg
                                    className='pointer-events-none absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150'
                                    viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round'
                                >
                                    <polyline points='20 6 9 17 4 12' />
                                </svg>
                            </span>
                            <span className='text-[13px] font-bold text-[#505570] leading-snug'>
                                Acepto los{' '}
                                <a href='#' onClick={(e) => e.stopPropagation()} className='text-[#6d72d8] font-extrabold hover:underline'>
                                    términos y condiciones
                                </a>
                            </span>
                        </label>
                        {errors.acceptTerms && <span className='block text-[#d14b6d] text-[13px] font-bold mt-1.5'>{errors.acceptTerms.message}</span>}
                    </div>

                    <div className='flex justify-end gap-3 pt-2'>
                        <button type='button' onClick={handleClose} disabled={loading}
                            className='h-[42px] px-5 border-[1.5px] border-[#e5e7f0] rounded-full bg-white text-sm font-extrabold text-[#7b8094] cursor-pointer'>
                            Cancelar
                        </button>
                        <button type='submit' disabled={loading}
                            className='h-[42px] px-6 border-none rounded-full bg-[#bfc3fb] text-white text-[15px] font-black cursor-pointer disabled:opacity-70'>
                            {loading ? 'Creando...' : 'Crear usuario'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};