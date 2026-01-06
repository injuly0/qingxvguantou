import React from 'react';

interface Props {
  isActive: boolean;
  onClick: () => void;
}

const DeepSeaCard: React.FC<Props> = ({ isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative w-full h-full overflow-hidden transition-all duration-700 cursor-pointer flex flex-col items-center justify-center
      ${isActive ? 'opacity-100 scale-100' : 'opacity-60 scale-95 blur-sm'}`}
      style={{
        background: 'linear-gradient(to bottom, #0F2027, #203A43, #2C5364)'
      }}
    >
      {/* Light filtering from top */}
      <div className="absolute top-0 w-full h-40 bg-gradient-to-b from-blue-400/20 to-transparent"></div>

      {/* Bubbles */}
      <div className="absolute inset-0 z-0">
         {[...Array(15)].map((_, i) => (
           <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-bubble-rise"
            style={{
              width: Math.random() * 20 + 5 + 'px',
              height: Math.random() * 20 + 5 + 'px',
              left: Math.random() * 100 + '%',
              animationDuration: Math.random() * 5 + 3 + 's',
              animationDelay: Math.random() * 2 + 's'
            }}
           ></div>
         ))}
      </div>

      {/* Sinking Object / Person Abstract */}
      <div className={`transition-all duration-[3000ms] ease-out ${isActive ? 'translate-y-20' : 'translate-y-0'}`}>
          <div className="w-16 h-16 rounded-full bg-blue-900/40 border border-blue-500/30 backdrop-blur-sm flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-float">
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          </div>
      </div>

      <div className="absolute bottom-32 text-center z-10 text-blue-100/80">
        <h2 className="text-4xl font-light tracking-widest mb-2">下 坠</h2>
        <p className="text-sm opacity-60">在寂静深处屏息</p>
      </div>
    </div>
  );
};

export default DeepSeaCard;