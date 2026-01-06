import React from 'react';

interface Props {
  isActive: boolean;
  onClick: () => void;
}

// TODO: 在这里填入你的公路图片 URL
const CUSTOM_ROAD_IMAGE = "https://aisearch.cdn.bcebos.com/fileManager/2O2aynxBtWqw8E9_v1aL5w/1767505957490cYpu01.png?authorization=bce-auth-v1%2F7e22d8caf5af46cc9310f1e3021709f3%2F2026-01-04T05%3A52%3A32Z%2F86400%2Fhost%2Fdffc0abfb8fbd44063de537c6d64ffba568e744e73659e3ebf20377dc8ab8892"; 

const RoadCard: React.FC<Props> = ({ isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative w-full h-full overflow-hidden transition-all duration-700 cursor-pointer flex items-center justify-center bg-sky-300
      ${isActive ? 'opacity-100 scale-100' : 'opacity-60 scale-95 blur-sm'}`}
    >
      {CUSTOM_ROAD_IMAGE ? (
        // --- 方案 A: 使用你的照片 (Cinematic Photo Mode) ---
        <div className="relative w-full h-full overflow-hidden">
          
          {/* 1. 缩放层 (Zoom Layer) - 模拟向前移动 */}
          <div className="w-full h-full animate-zoom-forward origin-center">
            <img 
              src={CUSTOM_ROAD_IMAGE} 
              alt="Road" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* 2. 颠簸层 (Bobbing Layer) - 模拟步伐节奏 */}
          {/* 将整个画面轻微上下晃动 */}
          <div className="absolute inset-0 animate-walk-bob pointer-events-none mix-blend-overlay opacity-20 bg-gradient-to-b from-transparent via-white to-transparent"></div>

          {/* 3. 光影层 (Passing Shadows) - 模拟穿过树荫/增加速度感 */}
          {/* 这是一个看不见的渐变层，快速从上往下扫过 */}
          <div className="absolute inset-0 animate-shadow-pass pointer-events-none">
             <div className="w-full h-full bg-gradient-to-b from-transparent via-black to-transparent opacity-20"></div>
          </div>

          {/* 4. 文字层 */}
          <div className="absolute bottom-32 w-full text-center z-20 text-white drop-shadow-xl">
            <h2 className="text-4xl font-light tracking-widest mb-3 drop-shadow-md">在路上</h2>
            <p className="text-sm font-medium opacity-90 tracking-wide">一步，又一步</p>
          </div>
        </div>
      ) : (
        // --- 方案 B: 像素动画 (Pixel Art Mode) ---
        <>
          {/* 
            Pixel Art Container 
            We render at a low resolution (approx 160x280) and scale up using CSS transform.
            This ensures distinct, sharp "pixels".
          */}
          <div 
            className="relative w-[160px] h-[280px] overflow-hidden pixelated shadow-2xl"
            style={{ 
              transform: 'scale(3)', // Scale up 3x to fill mobile screen with big pixels
              transformOrigin: 'center center',
              backgroundColor: '#60a5fa' // Sky Blue
            }}
          >
            {/* Sun */}
            <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-300">
               <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-100"></div> 
            </div>

            {/* Clouds (Blocky) */}
            <div className="absolute top-6 right-2 animate-float" style={{ animationDuration: '8s' }}>
              <div className="w-12 h-4 bg-white"></div>
              <div className="w-8 h-4 bg-white absolute -top-2 left-2"></div>
            </div>
            <div className="absolute top-12 left-6 animate-float" style={{ animationDuration: '10s', animationDelay: '2s' }}>
              <div className="w-10 h-3 bg-white/90"></div>
              <div className="w-4 h-2 bg-white/90 absolute -top-2 left-2"></div>
            </div>

            {/* Horizon Line / Distant Forest */}
            <div className="absolute top-[120px] w-full h-[20px] bg-[#166534]"></div>
            {/* Distant Hills - simple blocks */}
            <div className="absolute top-[110px] left-0 w-10 h-10 bg-[#15803d]"></div>
            <div className="absolute top-[105px] left-8 w-12 h-16 bg-[#166534]"></div>
            <div className="absolute top-[112px] right-0 w-16 h-8 bg-[#15803d]"></div>
            <div className="absolute top-[108px] right-12 w-8 h-12 bg-[#166534]"></div>


            {/* The Road */}
            <div className="absolute top-[120px] left-1/2 -translate-x-1/2 w-full h-full flex justify-center">
                {/* Perspective Road */}
                <div className="relative h-full w-[120px] overflow-hidden">
                    {/* Grass on sides */}
                    <div className="absolute inset-0 bg-[#475569]"></div> {/* Road Asphalt */}
                    
                    {/* Left Grass Wedge */}
                    <div 
                      className="absolute top-0 left-0 w-full h-full bg-[#4ade80] origin-top-left"
                      style={{ clipPath: 'polygon(0 0, 40% 0, 0 100%)' }}
                    ></div>
                    {/* Right Grass Wedge */}
                    <div 
                      className="absolute top-0 right-0 w-full h-full bg-[#4ade80] origin-top-right"
                      style={{ clipPath: 'polygon(100% 0, 60% 0, 100% 100%)' }}
                    ></div>

                    {/* Left Road Line (White) */}
                    <div 
                       className="absolute top-0 left-[42%] w-[2px] h-full bg-white opacity-80"
                       style={{ transform: 'skewX(15deg)', transformOrigin: 'bottom' }}
                    ></div>

                     {/* Right Road Line (White) */}
                     <div 
                       className="absolute top-0 right-[42%] w-[2px] h-full bg-white opacity-80"
                       style={{ transform: 'skewX(-15deg)', transformOrigin: 'bottom' }}
                    ></div>

                    {/* Center Line Animation */}
                    <div className="absolute top-0 left-1/2 -translate-x-[1px] w-[2px] h-full overflow-hidden">
                       <div className="w-full h-[200%] absolute -top-full animate-road-move flex flex-col items-center">
                          {/* Pixel dashes */}
                          {Array.from({length: 10}).map((_,i) => (
                            <div key={i} className="w-[2px] h-3 bg-yellow-400 mb-3 block"></div>
                          ))}
                       </div>
                    </div>
                </div>
            </div>

            {/* Side Trees (Passing by) - Simple Sprites */}
            {/* Left Trees */}
            <div className="absolute top-[120px] left-0 w-20 h-full pointer-events-none">
               <div className="absolute top-10 left-[-10px] w-8 h-12 bg-[#15803d]"></div> {/* Static tree */}
               <div className="absolute top-32 left-[-10px] w-12 h-16 bg-[#ca8a04]"></div> {/* Foreground Autumn Tree */}
               <div className="absolute top-4 left-4 w-4 h-6 bg-[#facc15]"></div> 
            </div>

            {/* Right Trees */}
            <div className="absolute top-[120px] right-0 w-20 h-full pointer-events-none">
               <div className="absolute top-8 right-[-5px] w-8 h-10 bg-[#ca8a04]"></div>
               <div className="absolute top-24 right-[-15px] w-14 h-20 bg-[#166534]"></div> {/* Big Green Tree */}
               <div className="absolute top-2 right-6 w-4 h-6 bg-[#15803d]"></div>
            </div>
          </div>

          {/* Text Overlay - Pixel Font */}
          <div className="absolute top-28 text-center z-10 text-white drop-shadow-md">
            <h2 className="text-3xl font-pixel tracking-widest mb-4 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] text-white">
              像素旅程
            </h2>
            <p className="text-xs font-pixel opacity-90 bg-black/20 p-2 rounded">
              LEVEL 2: SUNNY ROAD
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default RoadCard;