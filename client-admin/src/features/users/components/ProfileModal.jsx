import { Shield, Mail, Phone, User, Lock, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../../features/auth/store/authStore.js';
import toast from 'react-hot-toast';

const labelCls = 'block text-[13px] font-extrabold text-[#505570] mb-1.5';
const inputCls = 'w-full h-11 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 text-sm text-[#2f3348] font-semibold bg-white outline-none focus:border-fw-purple-light transition-colors';
const inputErrCls = 'w-full h-11 border-[1.5px] border-fw-pink rounded-[10px] px-3.5 text-sm text-[#2f3348] font-semibold bg-white outline-none focus:border-fw-pink transition-colors';
const readonlyCls = 'w-full h-11 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 text-sm text-fw-gray font-semibold bg-[#f4f5fc] flex items-center cursor-not-allowed';
const errCls = 'text-fw-pink text-[12px] font-bold mt-1 block';

const PasswordInput = ({ registration, error, placeholder }) => {
    const [show, setShow] = useState(false);
    return (
        <div className='relative'>
            <input
                type={show ? 'text' : 'password'}
                placeholder={placeholder}
                className={`${error ? inputErrCls : inputCls} pr-11`}
                {...registration}
            />
            <button
                type='button'
                onClick={() => setShow((v) => !v)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-fw-gray hover:text-fw-purple transition-colors'
            >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    );
};

export const ProfileModal = ({ isOpen, onClose, userBase }) => {
    const updateOwnProfile = useAuthStore((s) => s.updateOwnProfile);
    const changePassword = useAuthStore((s) => s.changePassword);
    const loading = useAuthStore((s) => s.loading);
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    const {
        register: regProfile,
        handleSubmit: submitProfile,
        reset: resetProfile,
        formState: { errors: profileErrors, isSubmitting: isSavingProfile },
    } = useForm();

    const {
        register: regPassword,
        handleSubmit: submitPassword,
        reset: resetPassword,
        watch,
        formState: { errors: passwordErrors, isSubmitting: isSavingPassword },
    } = useForm();

    useEffect(() => {
        if (isOpen && userBase) {
            resetProfile({
                username: userBase.username || '',
                email: userBase.email || '',
                phone: userBase.phone || '',
            });
            resetPassword();
            setShowPasswordSection(false);
        }
    }, [isOpen, userBase, resetProfile, resetPassword]);

    if (!isOpen) return null;

    const initials = `${userBase?.firstName?.[0] ?? ''}${userBase?.surname?.[0] ?? ''}`.toUpperCase() || '?';
    const fullName = [userBase?.firstName, userBase?.surname].filter(Boolean).join(' ') || 'Sin nombre';

    const onSaveProfile = async (data) => {
        const payload = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== ''));
        const result = await updateOwnProfile(payload);
        if (result.success) {
            toast.success('Perfil actualizado correctamente');
            onClose();
        } else {
            toast.error(result.error || 'Error al guardar los cambios');
        }
    };

    const onSavePassword = async (data) => {
        const result = await changePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
        });
        if (result.success) {
            toast.success('Contraseña actualizada correctamente');
            resetPassword();
            setShowPasswordSection(false);
        } else {
            toast.error(result.error || 'Error al cambiar la contraseña');
        }
    };

    return (
        <div className='fixed inset-0 bg-[rgba(40,40,80,0.35)] flex items-center justify-center z-[999] p-5 overflow-y-auto'>
            <div className='w-full max-w-[560px] bg-white rounded-[24px] shadow-[0_24px_80px_rgba(90,85,140,0.18)] overflow-hidden animate-fadeInScale my-auto'>
                <div className='flex justify-between items-center px-7 pt-6 pb-4 border-b border-[#f0f1f8]'>
                    <div className='flex items-center gap-3.5'>
                        <div className='w-12 h-12 rounded-full bg-fw-purple-bg text-fw-purple text-base font-black grid place-items-center'>
                            {initials}
                        </div>
                        <div>
                            <h2 className='m-0 text-lg font-black text-[#2f3348]'>Mi perfil</h2>
                            <p className='mt-0.5 text-[13px] text-fw-gray font-bold'>@{userBase?.username}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className='border-none bg-[#f0f1f8] rounded-lg w-8 h-8 cursor-pointer text-sm text-fw-gray hover:bg-fw-purple-bg hover:text-fw-purple transition-colors'
                    >
                        X
                    </button>
                </div>

                <form className='flex flex-col gap-4 px-7 pt-5 pb-4' onSubmit={submitProfile(onSaveProfile)}>
                    <div className='grid grid-cols-2 gap-3.5'>
                        <div>
                            <label className={labelCls}>
                                <span className='flex items-center gap-1.5'><User size={12} /> Nombre completo</span>
                            </label>
                            <div className={readonlyCls}>{fullName}</div>
                        </div>
                        <div>
                            <label className={labelCls}>
                                <span className='flex items-center gap-1.5'><Shield size={12} /> Rol</span>
                            </label>
                            <div className={readonlyCls}>{userBase?.role || 'Sin rol'}</div>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-3.5'>
                        <div>
                            <label className={labelCls}>
                                <span className='flex items-center gap-1.5'><User size={12} /> Username</span>
                            </label>
                            <input
                                className={profileErrors.username ? inputErrCls : inputCls}
                                {...regProfile('username', {
                                    required: 'El username es obligatorio',
                                    minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                                })}
                            />
                            {profileErrors.username && <span className={errCls}>{profileErrors.username.message}</span>}
                        </div>
                        <div>
                            <label className={labelCls}>
                                <span className='flex items-center gap-1.5'><Phone size={12} /> Teléfono <span className='font-bold text-fw-gray'>(opcional)</span></span>
                            </label>
                            <input className={inputCls} type='tel' {...regProfile('phone')} />
                        </div>
                    </div>

                    <div>
                        <label className={labelCls}>
                            <span className='flex items-center gap-1.5'><Mail size={12} /> Correo electrónico</span>
                        </label>
                        <input
                            className={profileErrors.email ? inputErrCls : inputCls}
                            type='email'
                            {...regProfile('email', {
                                required: 'El correo es obligatorio',
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato inválido' },
                            })}
                        />
                        {profileErrors.email && <span className={errCls}>{profileErrors.email.message}</span>}
                    </div>

                    <div>
                        <label className={labelCls}>Estado de cuenta</label>
                        <div className={readonlyCls}>
                            <span className={userBase?.isActive ? 'text-[#23845a] font-extrabold' : 'text-fw-pink font-extrabold'}>
                                {userBase?.isActive ? 'Activa' : 'Inactiva'}
                            </span>
                        </div>
                    </div>

                    <div className='flex justify-end gap-3 pt-1'>
                        <button
                            type='button'
                            onClick={onClose}
                            disabled={isSavingProfile || loading}
                            className='h-[42px] px-5 border-[1.5px] border-[#e5e7f0] rounded-full bg-white text-sm font-extrabold text-fw-gray cursor-pointer hover:bg-fw-purple-bg transition-colors disabled:opacity-50'
                        >
                            Cancelar
                        </button>
                        <button
                            type='submit'
                            disabled={isSavingProfile || loading}
                            className='h-[42px] px-6 border-none rounded-full bg-fw-purple-light text-white text-[15px] font-black cursor-pointer hover:bg-fw-purple transition-colors disabled:opacity-70'
                        >
                            {isSavingProfile || loading ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>

                <div className='px-7 pb-2'>
                    <button
                        type='button'
                        onClick={() => setShowPasswordSection((v) => !v)}
                        className='w-full flex items-center justify-between px-4 py-3 rounded-[10px] bg-fw-purple-bg/50 hover:bg-fw-purple-bg text-fw-purple text-[13px] font-extrabold transition-colors'
                    >
                        <span className='flex items-center gap-2'><Lock size={14} /> Cambiar contraseña</span>
                        {showPasswordSection ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>

                {showPasswordSection && (
                    <form className='flex flex-col gap-4 px-7 pt-3 pb-6' onSubmit={submitPassword(onSavePassword)}>
                        <div>
                            <label className={labelCls}>Contraseña actual</label>
                            <PasswordInput
                                registration={regPassword('currentPassword', { required: 'Ingresa tu contraseña actual' })}
                                error={passwordErrors.currentPassword}
                                placeholder='••••••••'
                            />
                            {passwordErrors.currentPassword && <span className={errCls}>{passwordErrors.currentPassword.message}</span>}
                        </div>

                        <div className='grid grid-cols-2 gap-3.5'>
                            <div>
                                <label className={labelCls}>Nueva contraseña</label>
                                <PasswordInput
                                    registration={regPassword('newPassword', {
                                        required: 'Ingresa la nueva contraseña',
                                        minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                                    })}
                                    error={passwordErrors.newPassword}
                                    placeholder='••••••••'
                                />
                                {passwordErrors.newPassword && <span className={errCls}>{passwordErrors.newPassword.message}</span>}
                            </div>
                            <div>
                                <label className={labelCls}>Confirmar contraseña</label>
                                <PasswordInput
                                    registration={regPassword('confirmPassword', {
                                        required: 'Confirma la nueva contraseña',
                                        validate: (v) => v === watch('newPassword') || 'Las contraseñas no coinciden',
                                    })}
                                    error={passwordErrors.confirmPassword}
                                    placeholder='••••••••'
                                />
                                {passwordErrors.confirmPassword && <span className={errCls}>{passwordErrors.confirmPassword.message}</span>}
                            </div>
                        </div>

                        <div className='flex justify-end pt-1'>
                            <button
                                type='submit'
                                disabled={isSavingPassword || loading}
                                className='h-[42px] px-6 border-none rounded-full bg-fw-purple-light text-white text-[15px] font-black cursor-pointer hover:bg-fw-purple transition-colors disabled:opacity-70'
                            >
                                {isSavingPassword || loading ? 'Actualizando...' : 'Actualizar contraseña'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};