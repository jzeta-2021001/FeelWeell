import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const inputCls = 'w-full h-11 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 text-sm text-[#2f3348] font-semibold outline-none focus:border-[#8b91ef] transition-colors';
const labelCls = 'block text-[13px] font-extrabold text-[#505570] mb-1.5';

export const EditProfileModal = ({ isOpen, onClose, onSave, user, loading }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (isOpen && user) reset({ firstName: user.firstName || '', surname: user.surname || '', email: user.email || '', username: user.username || '', phone: user.phone || '' });
    }, [isOpen, user, reset]);

    if (!isOpen) return null;

    const onSubmit = async (data) => {
        const payload = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== ''));
        const result = await onSave(payload);
        if (result.success) onClose();
    };

    const initials = `${user?.firstName?.[0] ?? ''}${user?.surname?.[0] ?? ''}`.toUpperCase() || '?';

    return (
        <div className='fixed inset-0 bg-[rgba(40,40,80,0.35)] flex items-center justify-center z-[999] p-5'>
            <div className='w-full max-w-[560px] max-h-[calc(100vh-40px)] bg-white rounded-[24px] shadow-[0_24px_80px_rgba(90,85,140,0.18)] overflow-hidden flex flex-col'>
                <div className='flex justify-between items-center px-7 pt-6 pb-4 border-b border-[#f0f1f8]'>
                    <div className='flex items-center gap-3.5'>
                        <div className='w-12 h-12 rounded-full bg-[#edefff] text-[#6d72d8] text-base font-black grid place-items-center'>{initials}</div>
                        <div>
                            <h2 className='m-0 text-lg font-black text-[#2f3348]'>Editar perfil</h2>
                            <p className='mt-0.5 text-[13px] text-[#9b9fb8] font-bold'>@{user?.username}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className='border-none bg-[#f0f1f8] rounded-lg w-8 h-8 cursor-pointer text-sm text-[#7b8094]'>✕</button>
                </div>

                <form className='flex flex-col gap-4 overflow-y-auto px-5 py-5 sm:px-7' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-1 gap-3.5 sm:grid-cols-2'>
                        <div><label className={labelCls}>Nombre</label>
                            <input className={inputCls} {...register('firstName', { required: 'El nombre es obligatorio' })} />
                            {errors.firstName && <span className='text-[#d14b6d] text-[13px] font-bold'>{errors.firstName.message}</span>}
                        </div>
                        <div><label className={labelCls}>Apellido</label>
                            <input className={inputCls} {...register('surname', { required: 'El apellido es obligatorio' })} />
                            {errors.surname && <span className='text-[#d14b6d] text-[13px] font-bold'>{errors.surname.message}</span>}
                        </div>
                    </div>

                    <div><label className={labelCls}>Correo electrónico</label>
                        <input className={inputCls} type='email' {...register('email', { required: 'El correo es obligatorio', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato inválido' } })} />
                        {errors.email && <span className='text-[#d14b6d] text-[13px] font-bold'>{errors.email.message}</span>}
                    </div>

                    <div className='grid grid-cols-1 gap-3.5 sm:grid-cols-2'>
                        <div><label className={labelCls}>Usuario</label>
                            <input className={inputCls} {...register('username', { required: 'El usuario es obligatorio', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })} />
                            {errors.username && <span className='text-[#d14b6d] text-[13px] font-bold'>{errors.username.message}</span>}
                        </div>
                        <div><label className={labelCls}>Teléfono <span className='font-bold text-[#9b9fb8]'>(opcional)</span></label>
                            <input className={inputCls} type='tel' inputMode='numeric' maxLength={8} placeholder='12345678' {...register('phone', { pattern: { value: /^$|^\d{8}$/, message: 'Ingresa exactamente 8 dígitos' } })} />
                            {errors.phone && <span className='text-[#d14b6d] text-[13px] font-bold'>{errors.phone.message}</span>}
                        </div>
                    </div>

                    <div className='flex justify-end gap-3 pt-2'>
                        <button type='button' onClick={onClose} disabled={loading}
                            className='h-[42px] px-5 border-[1.5px] border-[#e5e7f0] rounded-full bg-white text-sm font-extrabold text-[#7b8094] cursor-pointer'>
                            Cancelar
                        </button>
                        <button type='submit' disabled={loading}
                            className='h-[42px] px-6 border-none rounded-full bg-[#bfc3fb] text-white text-[15px] font-black cursor-pointer disabled:opacity-70'>
                            {loading ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
