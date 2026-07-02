import { Flame, HeartCrack, Sprout, Waves, HeartPulse, Video, FileText, Link2 } from 'lucide-react';

export const CONTENT_TYPES = ['VIDEO', 'ARTÍCULO', 'RECURSO'];
export const CONTENT_CATEGORIES = ['ESTRÉS', 'DEPRESIÓN', 'DESARROLLO PERSONAL', 'ANSIEDAD', 'BIENESTAR GENERAL'];

export const CATEGORY_STYLES = {
    'ESTRÉS': { cls: 'bg-[#fff3e0] text-[#e65100]', dot: '#e65100' },
    'DEPRESIÓN': { cls: 'bg-fw-pink/10 text-fw-pink', dot: '#d14b6d' },
    'DESARROLLO PERSONAL': { cls: 'bg-[#e8f5e9] text-[#2e7d52]', dot: '#2e7d52' },
    'ANSIEDAD': { cls: 'bg-fw-purple-bg text-fw-purple', dot: '#6d72d8' },
    'BIENESTAR GENERAL': { cls: 'bg-[#e3f2fd] text-[#1565c0]', dot: '#1565c0' },
};

export const TYPE_STYLES = {
    'VIDEO': { cls: 'bg-[#fce4ec] text-[#c62828]' },
    'ARTÍCULO': { cls: 'bg-fw-purple-bg text-fw-purple' },
    'RECURSO': { cls: 'bg-[#e8f5e9] text-[#2e7d52]' },
};

// Iconos por categoría (usados en la biblioteca de contenido del usuario)
export const CATEGORY_ICONS = {
    'ESTRÉS': Flame,
    'DEPRESIÓN': HeartCrack,
    'DESARROLLO PERSONAL': Sprout,
    'ANSIEDAD': Waves,
    'BIENESTAR GENERAL': HeartPulse,
};

// Iconos por tipo de contenido
export const TYPE_ICONS = {
    'VIDEO': Video,
    'ARTÍCULO': FileText,
    'RECURSO': Link2,
};