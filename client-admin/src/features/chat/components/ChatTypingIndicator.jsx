import imgTiyu from '../../../assets/img/tiyu.jpeg'

export const ChatTypingIndicator = () => (
    <div className='flex items-end gap-2 px-4 animate-fadeIn'>
        <div>
            <img
                src={imgTiyu}
                alt='Tiyú AI'
                className='rounded-full w-10 h-10'
            />
        </div>

        <div className='bg-white border border-[#edefff] shadow-sm rounded-[18px] rounded-bl-[4px] px-4 py-3 flex items-center gap-1.5'>
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className='w-2 h-2 bg-[#8b91ef] rounded-full inline-block'
                    style={{
                        animation: 'typingBounce 1.2s ease-in-out infinite',
                        animationDelay: `${i * 0.2}s`,
                    }}
                />
            ))}
        </div>
        <style>{`
            @keyframes typingBounce {
                0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
                30% { transform: translateY(-6px); opacity: 1; }
            }
        `}</style>
    </div>
);