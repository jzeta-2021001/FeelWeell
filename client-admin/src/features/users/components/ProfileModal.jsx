import { Shield, Mail, Phone, User, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateProfileRequest } from '../../../shared/apis/users.js';
import { useAuthStore } from '../../../features/auth/store/authStore.js';
import toast from 'react-hot-toast';

const labelCls = 'block text-[12px] font-extrabold text-[#8b8fbb] uppercase tracking-wide mb-1.5';
const inputCls = 'w-full h-11 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 text-sm text-[#2f3348] font-semibold bg-white outline-none focus:border-[#8b91ef] transition-colors';
const readonlyCls = 'w-full h-11 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 text-sm text-[#9b9fb8] font-semibold bg-[#f4f5fc] flex items-center cursor-not-allowed';

export const ProfileModal = ({ isOpen, onClose, userBase }) => {
    const updateUser = useAuthStore((s) => s.updateUser);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: userBase?.username || '',
            email: userBase?.email || '',
            phone: userBase?.phone || '',
        },
    });

    if (!isOpen) return null;

    const initials = `${userBase?.firstName?.[0] ?? ''}${userBase?.surname?.[0] ?? ''}`.toUpperCase() || '??';
    const fullName = [userBase?.firstName, userBase?.surname].filter(Boolean).join(' ') || 'Sin nombre';

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const payload = Object.fromEntries(
                Object.entries(data).filter(([, v]) => v !== '')
            );
            const response = await updateProfileRequest(payload);
            updateUser(response.data?.data ?? payload);
            toast.success('Perfil actualizado correctamente');
            onClose();
        } catch (error) {
            const msg =
                error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.message ||
                'Error al guardar los cambios';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className='fixed inset-0 bg-[rgba(40,40,80,0.35)] backdrop-blur-[3px] flex items-center justify-center z-[999] p-5 animate-fadeIn'
            onClick={onClose}
        >
            <div
                className='w-full max-w-[560px] bg-white rounded-[24px] shadow-[0_24px_80px_rgba(90,85,140,0.18)] overflow-hidden animate-fadeInScale'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className='relative px-7 pt-8 pb-6 text-center' style={{ background: 'linear-gradient(135deg, #6fb5ff 0%, #c793ff 100%)' }}>
                    <button
                        onClick={onClose}
                        className='absolute top-4 right-4 w-8 h-8 grid place-items-center rounded-full border-none bg-white/25 text-white cursor-pointer hover:bg-white/40 transition-colors'
                    >
                        <X size={16} />
                    </button>

                    <div className='w-[72px] h-[72px] rounded-full bg-white/25 text-white text-2xl font-black grid place-items-center mx-auto mb-3.5 border-[3px] border-white/50'>
                        {initials}
                    </div>

                    <h2 className='m-0 text-[22px] font-black text-white mb-2'>{fullName}</h2>

                    <div className='flex items-center justify-center gap-3 flex-wrap'>
                        <span className='text-[13px] font-bold text-white/85'>{userBase?.email}</span>
                        <span className='flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold'>
                            <Shield size={12} />
                            {userBase?.role}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='px-7 py-6'>
                        <div className='grid grid-cols-2 gap-4'>

                            <div>
                                <label className={labelCls}>
                                    <span className='flex items-center gap-1'><User size={12} /> Nombre completo</span>
                                </label>
                                <div className={readonlyCls}>{fullName}</div>
                            </div>

                            <div>
                                <label className={labelCls}>
                                    <span className='flex items-center gap-1'><Shield size={12} /> Rol</span>
                                </label>
                                <div className={readonlyCls}>{userBase?.role || 'Sin rol'}</div>
                            </div>

                            <div>
                                <label className={labelCls}>
                                    <span className='flex items-center gap-1'><User size={12} /> Username</span>
                                </label>
                                <input
                                    className={inputCls}
                                    {...register('username', {
                                        required: 'El username es obligatorio',
                                        minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                                    })}
                                />
                                {errors.username && (
                                    <span className='text-[#d14b6d] text-[12px] font-bold mt-1 block'>{errors.username.message}</span>
                                )}
                            </div>

                            <div>
                                <label className={labelCls}>
                                    <span className='flex items-center gap-1'><Mail size={12} /> Correo electrónico</span>
                                </label>
                                <input
                                    className={inputCls}
                                    type='email'
                                    {...register('email', {
                                        required: 'El correo es obligatorio',
                                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato inválido' },
                                    })}
                                />
                                {errors.email && (
                                    <span className='text-[#d14b6d] text-[12px] font-bold mt-1 block'>{errors.email.message}</span>
                                )}
                            </div>

                            <div>
                                <label className={labelCls}>
                                    <span className='flex items-center gap-1'><Phone size={12} /> Teléfono <span className='normal-case text-[#9b9fb8] font-bold'>(opcional)</span></span>
                                </label>
                                <input
                                    className={inputCls}
                                    type='tel'
                                    {...register('phone')}
                                />
                            </div>

                            <div>
                                <label className={labelCls}>Estado de cuenta</label>
                                <div className={readonlyCls}>
                                    <span className={userBase?.isActive ? 'text-[#23845a] font-extrabold' : 'text-[#d14b6d] font-extrabold'}>
                                        {userBase?.isActive ? 'Activa' : 'Inactiva'}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className='flex justify-end gap-3 px-7 pb-6'>
                        <button
                            type='button'
                            onClick={onClose}
                            disabled={loading}
                            className='h-[42px] px-6 border-[1.5px] border-[#e5e7f0] rounded-full bg-white text-sm font-extrabold text-[#7b8094] cursor-pointer hover:bg-[#f0f1ff] hover:border-[#bbbfef] transition-colors disabled:opacity-50'
                        >
                            Cancelar
                        </button>
                        <button
                            type='submit'
                            disabled={loading}
                            className='h-[42px] px-6 border-none rounded-full text-white text-sm font-black cursor-pointer disabled:opacity-60 transition-opacity'
                            style={{ background: 'linear-gradient(135deg, #6fb5ff, #c793ff)' }}
                        >
                            {loading ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};