import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const inputCls = 'w-full h-11 border-none outline-none rounded-full bg-white px-5 text-sm text-[#5f5f5f] font-bold placeholder-[#c7c6ee] focus:shadow-[0_0_0_3px_rgba(190,190,255,0.55)]';

const TERMS_TEXT = `Al registrarte en FeelWeell, aceptas los siguientes términos:

1. Uso de Inteligencia Artificial: FeelWeell utiliza inteligencia artificial (IA) para brindarte apoyo emocional personalizado, sugerencias de bienestar y análisis de tu estado de ánimo. Al registrarte, autorizas el uso de tus datos de bienestar para mejorar estas experiencias dentro de la plataforma.

2. Privacidad y datos: Tu información personal y registros emocionales son tratados con estricta confidencialidad. No compartimos tu información con terceros sin tu consentimiento, salvo cuando sea requerido por ley.

3. No reemplaza atención profesional: Las recomendaciones generadas por la IA de FeelWeell son de carácter orientativo y no sustituyen la atención de un profesional de salud mental.

4. Uso responsable: Te comprometes a utilizar la plataforma de forma responsable y veraz en los registros que realizas.

5. Menores de edad: El uso de FeelWeell está destinado a todas las edades, sin embargo, los menores de 18 años deben contar con la supervisión de un adulto responsable al utilizar la plataforma.`;

const TermsModal = ({ onAccept, onReject }) => (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4'>
        <div className='w-full max-w-[440px] bg-white rounded-[18px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]'>
            <div className='px-5 pt-5 pb-3 border-b border-[#e5e7f0]'>
                <h2 className='m-0 text-base font-black text-[#2f3348]'>Términos y Condiciones</h2>
                <p className='mt-1 text-xs text-[#9b9fb8] font-bold'>Léelos antes de crear tu cuenta</p>
            </div>

            <div className='overflow-y-auto px-5 py-4 flex-1'>
                <pre className='whitespace-pre-wrap text-xs text-[#505570] font-semibold leading-relaxed m-0 font-sans'>
                    {TERMS_TEXT}
                </pre>
            </div>

            <div className='px-5 py-4 border-t border-[#e5e7f0] flex flex-col gap-2.5'>
                <button
                    type='button'
                    onClick={onAccept}
                    className='w-full h-10 border-none rounded-full bg-[#bfc3fb] text-white text-sm font-black cursor-pointer hover:bg-[#a0a5f0] transition-colors'
                >
                    Acepto los términos y condiciones
                </button>
                <button
                    type='button'
                    onClick={onReject}
                    className='w-full h-10 border-[2px] border-[#e5e7f0] rounded-full bg-white text-[#9b9fb8] text-sm font-black cursor-pointer hover:bg-[#f5f5f5] transition-colors'
                >
                    No acepto — no puedo registrarme
                </button>
            </div>
        </div>
    </div>
);

export const RegisterForm = ({ onLogin }) => {
    const registerUser = useAuthStore((s) => s.registerUser);
    const loading = useAuthStore((s) => s.loading);
    const error = useAuthStore((s) => s.error);
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();

    const [showTerms, setShowTerms] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [pendingData, setPendingData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = (formData) => {
        if (!acceptedTerms) {
            setPendingData(formData);
            setShowTerms(true);
            return;
        }
        submitRegistration(formData);
    };

    const submitRegistration = async (formData) => {
        const result = await registerUser({ ...formData, acceptTerms: true });
        if (result.success) {
            toast.success(result.message);
            onLogin();
            return;
        }
        toast.error(result.error);
    };

    const handleAcceptTerms = () => {
        setAcceptedTerms(true);
        setShowTerms(false);
        if (pendingData) {
            submitRegistration(pendingData);
            setPendingData(null);
        }
    };

    const handleRejectTerms = () => {
        setShowTerms(false);
        setPendingData(null);
        toast.error('Debes aceptar los términos y condiciones para registrarte.');
    };

    return (
        <>
            {showTerms && (
                <TermsModal onAccept={handleAcceptTerms} onReject={handleRejectTerms} />
            )}

            <section className='w-full max-w-[400px] bg-[#f3f3f3] rounded-[22px] px-6 pt-7 pb-8 shadow-[0_20px_70px_rgba(90,85,140,0.12)] sm:px-9 sm:pt-8'>
                <div className='text-center mb-6 sm:mb-7'>
                    <h1 className='m-0 text-[#c7c6ff] text-[26px] leading-none font-black sm:text-[28px]'>Registrate</h1>
                    <p className='mt-2 text-[#8a8a8a] text-sm font-extrabold'>Ingresa los datos que se te piden</p>
                </div>

                <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                    {[
                        { name: 'firstName', placeholder: 'Nombres', rules: { required: 'El nombre es obligatorio', minLength: { value: 2, message: 'Mínimo 2 caracteres' } } },
                        { name: 'surname', placeholder: 'Apellidos', rules: { required: 'El apellido es obligatorio', minLength: { value: 2, message: 'Mínimo 2 caracteres' } } },
                        { name: 'username', placeholder: 'Usuario', rules: { required: 'El usuario es obligatorio', minLength: { value: 2, message: 'Mínimo 2 caracteres' } } },
                    ].map(({ name, placeholder, rules }) => (
                        <div key={name}>
                            <input className={inputCls} type='text' placeholder={placeholder} {...register(name, { setValueAs: v => v.trim(), ...rules })} />
                            {errors[name] && <span className='text-[#d14b6d] text-xs font-bold'>{errors[name].message}</span>}
                        </div>
                    ))}

                    <div>
                        <input className={inputCls} type='email' placeholder='Correo electrónico'
                            {...register('email', { required: 'El correo es obligatorio', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' } })} />
                        {errors.email && <span className='text-[#d14b6d] text-xs font-bold'>{errors.email.message}</span>}
                    </div>

                    <div>
                        <div className='relative'>
                            <input className='w-full h-11 border-none outline-none rounded-full bg-white pl-5 pr-11 text-sm text-[#5f5f5f] font-bold placeholder-[#c7c6ee] focus:shadow-[0_0_0_3px_rgba(190,190,255,0.55)]'
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Contraseña'
                                {...register('password', { required: 'La contraseña es obligatoria', minLength: { value: 8, message: 'Mínimo 8 caracteres' } })}
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-4 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer text-gray-400 hover:text-gray-600 transition-colors'
                            >
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                        {errors.password && <span className='text-[#d14b6d] text-xs font-bold'>{errors.password.message}</span>}
                    </div>

                    {error && <p className='text-[#d14b6d] text-xs font-bold m-0'>{error}</p>}

                    {acceptedTerms && (
                        <p className='text-[#23845a] text-xs font-bold m-0 text-center'>
                            ✓ Términos y condiciones aceptados
                        </p>
                    )}

                    <button className='w-full h-11 border-none rounded-full bg-[#bfc3fb] text-white text-base font-black cursor-pointer disabled:opacity-70'
                        type='submit' disabled={loading}>
                        {loading ? 'Creando...' : 'Crear cuenta'}
                    </button>
                </form>

                <p className='text-center mt-5 text-[#6f6f6f] text-sm font-black'>
                    ¿Ya tienes cuenta?{' '}
                    <button className='border-none bg-transparent text-[#bdbdff] font-[inherit] cursor-pointer p-0' type='button' onClick={onLogin}>
                        Inicia sesión
                    </button>
                </p>
            </section>
        </>
    );
};