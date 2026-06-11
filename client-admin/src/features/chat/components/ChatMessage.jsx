import { AlertTriangle, ShieldOff, Compass, WifiOff } from 'lucide-react';
import imgTiyu from '../../../assets/img/tiyu.jpeg'

const TYPE_CONFIG = {
    user: {
        wrapper: 'justify-end',
        bubble: 'bg-gradient-to-br from-[#8b91ef] to-[#6d72d8] text-white rounded-[18px] rounded-br-[4px]',
        timeColor: 'text-white/60',
        icon: null,
    },
    RESPUESTA: {
        wrapper: 'justify-start',
        bubble: 'bg-white text-[#2f3348] rounded-[18px] rounded-bl-[4px] border border-[#edefff] shadow-sm',
        timeColor: 'text-[#9b9fb8]',
        icon: null,
    },
    EMERGENCIA: {
        wrapper: 'justify-start',
        bubble: 'bg-[#fff0f3] text-[#2f3348] rounded-[18px] rounded-bl-[4px] border border-[#f8c8d0] shadow-sm',
        timeColor: 'text-[#9b9fb8]',
        icon: AlertTriangle,
        iconColor: 'text-[#d14b6d]',
        label: 'Apoyo de emergencia',
        labelColor: 'text-[#d14b6d]',
    },
    BLOQUEADO: {
        wrapper: 'justify-start',
        bubble: 'bg-[#fffbeb] text-[#2f3348] rounded-[18px] rounded-bl-[4px] border border-[#fde68a] shadow-sm',
        timeColor: 'text-[#9b9fb8]',
        icon: ShieldOff,
        iconColor: 'text-amber-500',
        label: 'Contenido no disponible',
        labelColor: 'text-amber-600',
    },
    FUERA_DE_ALCANCE: {
        wrapper: 'justify-start',
        bubble: 'bg-[#f0f1ff] text-[#2f3348] rounded-[18px] rounded-bl-[4px] border border-[#dde0ff] shadow-sm',
        timeColor: 'text-[#9b9fb8]',
        icon: Compass,
        iconColor: 'text-[#6d72d8]',
        label: 'Fuera de mi especialidad',
        labelColor: 'text-[#6d72d8]',
    },
    error: {
        wrapper: 'justify-start',
        bubble: 'bg-[#f5f6ff] text-[#7b8094] rounded-[18px] rounded-bl-[4px] border border-[#e5e7f0] shadow-sm',
        timeColor: 'text-[#c5c7d8]',
        icon: WifiOff,
        iconColor: 'text-[#9b9fb8]',
        label: 'Sin conexión · Intenta de nuevo',
        labelColor: 'text-[#9b9fb8]',
    },
};

const formatTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString('es-GT', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const ChatMessage = ({ message }) => {
    const { tipo, text, timestamp, role } = message;
    const config = TYPE_CONFIG[tipo] ?? TYPE_CONFIG.RESPUESTA;
    const { wrapper, bubble, timeColor, icon: Icon, iconColor, label, labelColor } = config;

    return (
        <div className={`flex items-end gap-2 px-4 animate-fadeIn ${wrapper}`}>
            {role === 'assistant' && (
                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-[#8b91ef] to-[#6d72d8] flex items-center justify-center text-white text-sm flex-shrink-0 mb-1 shadow-sm'>
                    <img
                        src={imgTiyu}
                        alt='Tiyú AI'
                        className='rounded-full'
                    />
                </div>
            )}

            <div className={`max-w-[75%] flex flex-col ${role === 'user' ? 'items-end' : 'items-start'}`}>
                {label && (
                    <div className={`flex items-center gap-1 mb-1 text-[11px] font-bold ${labelColor}`}>
                        {Icon && <Icon size={11} className={iconColor} />}
                        {label}
                    </div>
                )}

                <div className={`px-4 py-3 text-[14px] font-semibold leading-relaxed ${bubble}`}>
                    {text}
                </div>

                <span className={`text-[10px] font-bold mt-1 px-1 ${timeColor}`}>
                    {formatTime(timestamp)}
                </span>
            </div>
        </div>
    );
};