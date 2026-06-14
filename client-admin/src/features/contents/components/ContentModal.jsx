import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImagePlus, BookOpen } from 'lucide-react';
import { CONTENT_TYPES, CONTENT_CATEGORIES } from '../constants/constants.js';

const inputCls = 'w-full h-11 border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 text-sm text-[#2f3348] font-semibold outline-none focus:border-fw-purple-light transition-colors';
const textareaCls = 'w-full border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 py-2.5 text-sm text-[#2f3348] font-semibold outline-none focus:border-fw-purple-light transition-colors resize-none';
const labelCls = 'block text-[13px] font-extrabold text-[#505570] mb-1.5';
const errCls = 'text-fw-pink text-[12px] font-bold mt-1 block';

export const ContentModal = ({ isOpen, onClose, onSave, content, loading }) => {
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        if (content) {
            reset({
                title: content.title || '',
                description: content.description || '',
                type: content.type || '',
                category: content.category || '',
                url: content.url || '',
                body: content.body || '',
            });
            setPreview(content.photoUrl || null);
        } else {
            reset({ title: '', description: '', type: '', category: '', url: '', body: '' });
            setPreview(null);
        }
    }, [isOpen, content, reset]);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'photo' && value.photo?.length > 0) {
                setPreview(URL.createObjectURL(value.photo[0]));
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    if (!isOpen) return null;

    const onSubmit = async (data) => {
        const result = await onSave(data);
        if (result?.success) onClose();
    };

    return (
        <div className='fixed inset-0 bg-[rgba(40,40,80,0.35)] flex items-center justify-center z-[999] p-5 overflow-y-auto'>
            <div className='w-full max-w-[620px] bg-white rounded-[24px] shadow-[0_24px_80px_rgba(90,85,140,0.18)] overflow-hidden my-auto animate-fadeInScale'>

                <div className='flex justify-between items-start px-7 pt-6 pb-4 border-b border-[#f0f1f8]'>
                    <div>
                        <h2 className='m-0 text-lg font-black text-[#2f3348]'>
                            {content ? 'Editar contenido' : 'Nuevo contenido'}
                        </h2>
                        <p className='mt-0.5 text-[13px] text-fw-gray font-bold'>
                            Completa la información del contenido educativo
                        </p>
                    </div>
                    <button
                        type='button'
                        onClick={onClose}
                        className='border-none bg-[#f0f1f8] rounded-lg w-8 h-8 cursor-pointer text-sm text-fw-gray hover:bg-fw-purple-bg hover:text-fw-purple transition-colors'
                    >
                        X
                    </button>
                </div>

                <form className='flex flex-col gap-4 px-7 py-5 max-h-[70vh] overflow-y-auto' onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col items-center gap-3'>
                        <div className='w-24 h-24 rounded-2xl bg-fw-purple-bg/40 border border-[#e5e7f0] flex items-center justify-center overflow-hidden'>
                            {preview ? (
                                <img src={preview} alt='preview' className='w-full h-full object-cover' />
                            ) : (
                                <BookOpen size={28} className='text-fw-purple-light' />
                            )}
                        </div>
                        <label className='flex items-center gap-2 text-[13px] font-extrabold text-fw-purple cursor-pointer hover:text-fw-purple-light transition-colors'>
                            <ImagePlus size={15} />
                            {content?.photoUrl || preview ? 'Cambiar imagen' : 'Subir imagen'}
                            <input type='file' accept='image/*' className='hidden' {...register('photo')} />
                        </label>
                    </div>

                    <div>
                        <label className={labelCls}>Título</label>
                        <input
                            className={inputCls}
                            {...register('title', {
                                required: 'El título es obligatorio',
                                maxLength: { value: 150, message: 'Máximo 150 caracteres' },
                            })}
                        />
                        {errors.title && <span className={errCls}>{errors.title.message}</span>}
                    </div>

                    <div className='grid grid-cols-2 gap-3.5'>
                        <div>
                            <label className={labelCls}>Tipo</label>
                            <select className={inputCls} {...register('type', { required: 'Selecciona un tipo' })}>
                                <option value=''>Selecciona...</option>
                                {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                            {errors.type && <span className={errCls}>{errors.type.message}</span>}
                        </div>
                        <div>
                            <label className={labelCls}>Categoría</label>
                            <select className={inputCls} {...register('category', { required: 'Selecciona una categoría' })}>
                                <option value=''>Selecciona...</option>
                                {CONTENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors.category && <span className={errCls}>{errors.category.message}</span>}
                        </div>
                    </div>

                    <div>
                        <label className={labelCls}>
                            URL
                        </label>
                        <input
                            className={inputCls}
                            type='url'
                            placeholder='https://...'
                            {...register('url', {
                                validate: (val) => {
                                    if (!val) return true;
                                    return val.startsWith('http://') || val.startsWith('https://')
                                    ? true
                                    : 'La URL debe de comenzar con https://'
                                }
                            })}
                        />
                    </div>

                    <div>
                        <label className={labelCls}>Descripción</label>
                        <textarea
                            rows={3}
                            className={textareaCls}
                            {...register('description', {
                                required: 'La descripción es obligatoria',
                                maxLength: { value: 600, message: 'Máximo 600 caracteres' },
                            })}
                        />
                        {errors.description && <span className={errCls}>{errors.description.message}</span>}
                    </div>

                    <div>
                        <label className={labelCls}>
                            Cuerpo del contenido <span className='normal-case text-[#9b9fb8] font-bold'>(opcional)</span>
                        </label>
                        <textarea rows={4} className={textareaCls} {...register('body')} />
                    </div>

                    <div className='flex justify-end gap-3 pt-2'>
                        <button
                            type='button'
                            onClick={onClose}
                            disabled={loading}
                            className='h-[42px] px-5 border-[1.5px] border-[#e5e7f0] rounded-full bg-white text-sm font-extrabold text-fw-gray cursor-pointer hover:bg-fw-purple-bg transition-colors disabled:opacity-50'
                        >
                            Cancelar
                        </button>
                        <button
                            type='submit'
                            disabled={loading}
                            className='h-[42px] px-6 border-none rounded-full bg-fw-purple-light text-white text-[15px] font-black cursor-pointer hover:bg-fw-purple transition-colors disabled:opacity-70'
                        >
                            {loading ? 'Guardando...' : content ? 'Guardar cambios' : 'Crear contenido'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};