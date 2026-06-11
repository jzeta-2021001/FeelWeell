import { Phone } from 'lucide-react';

export const ChatEmergencyBanner = () => (
    <div className='mx-4 mb-3 p-4 bg-gradient-to-r from-[#fff0f3] to-[#fdf4ff] border border-[#f8c8d0] rounded-[14px] animate-fadeInScale'>
        <div className='flex items-start gap-3'>
            <div className='w-9 h-9 rounded-full bg-[#d14b6d]/10 flex items-center justify-center flex-shrink-0'>
                <Phone size={16} className='text-[#d14b6d]' />
            </div>
            <div>
                <p className='text-[13px] font-black text-[#d14b6d] mb-0.5'>
                    Líneas de apoyo disponibles ahora
                </p>
                <p className='text-[12px] font-bold text-[#505570] leading-relaxed'>
                    🇬🇹 Guatemala: <strong>110</strong> (PGN) · <strong>1546</strong> (MINEDUC) <br />
                    Si estás en otro país, busca la línea de crisis local.
                </p>
            </div>
        </div>
    </div>
);