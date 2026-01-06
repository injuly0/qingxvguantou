import React from 'react';

interface Props {
  isActive: boolean;
  onClick: () => void;
}

// TODO: 如果你有自己的图片，请在这里填入 URL
// 1. 摩天轮圆盘的图片（建议透明背景 PNG）
const CUSTOM_WHEEL_IMAGE = ""; 
// 2. 背景图片（如果填入，将覆盖默认的蓝天渐变）
const CUSTOM_BG_IMAGE = "";

const FerrisWheelCard: React.FC<Props> = ({ isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative w-full h-full overflow-hidden transition-all duration-700 cursor-pointer flex flex-col items-center justify-center
      ${isActive ? 'opacity-100 scale-100' : 'opacity-60 scale-95 blur-sm'}`}
    >
      {/* 1. 背景层 */}
      {CUSTOM_BG_IMAGE ? (
        <img src={CUSTOM_BG_IMAGE} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div 
          className="absolute inset-0" 
          style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F7FA 100%)' }}
        >
          {/* 只有在默认背景下才显示这个太阳光效 */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-300 rounded-full blur-xl opacity-80 animate-pulse"></div>
        </div>
      )}

      {/* 2. 摩天轮主体层 */}
      {CUSTOM_WHEEL_IMAGE ? (
        // --- 方案 A: 使用你的图片 ---
        <div className="relative z-10 flex flex-col items-center">
           {/* 图片轮盘：直接应用 animate-spin-slow 类来实现旋转 */}
           <img 
             src={CUSTOM_WHEEL_IMAGE} 
             alt="Ferris Wheel" 
             className="w-80 h-80 object-contain animate-spin-slow drop-shadow-2xl"
           />
           
           {/* 
              注意：如果你使用的是图片，座舱通常是画死在图上的。
              旋转时座舱会跟着倒转。如果需要座舱保持直立，
              你的图片应该只包含“骨架”，座舱需要像下面方案 B 那样单独用代码写在这个容器里。
           */}
           
           {/* 如果背景图里没有画支架，这里可以保留一个简单的底座，或者你也可以上传包含底座的背景图 */}
           {!CUSTOM_BG_IMAGE && (
             <div className="relative -mt-4 w-0 h-0">
                <div className="absolute top-0 left-1/2 -translate-x-6 w-4 h-40 bg-gray-400/50 rotate-12 origin-top"></div>
                <div className="absolute top-0 left-1/2 translate-x-2 w-4 h-40 bg-gray-400/50 -rotate-12 origin-top"></div>
             </div>
           )}
        </div>
      ) : (
        // --- 方案 B: 原有的 CSS 绘制版本 ---
        <div className="relative z-10">
          <div className="relative w-80 h-80 border-8 border-gray-300/50 rounded-full animate-spin-slow shadow-2xl bg-white/5 backdrop-blur-sm">
            {/* 辐条 Spokes */}
            <div className="absolute top-0 left-1/2 w-1 h-full bg-gray-300/50 -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300/50 -translate-y-1/2"></div>
            <div className="absolute top-0 left-1/2 w-1 h-full bg-gray-300/50 -translate-x-1/2 rotate-45"></div>
            <div className="absolute top-0 left-1/2 w-1 h-full bg-gray-300/50 -translate-x-1/2 -rotate-45"></div>
            
            {/* 座舱 Cabins */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <div 
                key={i}
                className="absolute w-8 h-8 bg-pink-400 rounded-lg shadow-lg border border-white/50"
                style={{
                  top: '50%',
                  left: '50%',
                  // 这里的逻辑是：
                  // 1. rotate(deg): 把座舱转到轮子边缘的对应角度
                  // 2. translate(150px): 把它推到轮子边缘
                  // 3. rotate(-deg): 把它“反向转回来”，保证座舱永远垂直向下
                  transform: `rotate(${deg}deg) translate(150px) rotate(-${deg}deg)`, 
                }}
              >
                <div className="w-full h-2/3 bg-white/40 border-b border-white/20"></div>
              </div>
            ))}
          </div>
          
          {/* CSS 版本的支架 */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full flex justify-center -z-10">
             <div className="w-4 h-48 bg-gray-400/50 transform -translate-x-6 rotate-12 origin-bottom rounded-full"></div>
             <div className="w-4 h-48 bg-gray-400/50 transform translate-x-6 -rotate-12 origin-bottom rounded-full"></div>
          </div>
        </div>
      )}

      {/* 底部文字 */}
      <div className="absolute bottom-20 text-center z-10 text-slate-700 drop-shadow-md">
        <h2 className="text-4xl font-light tracking-widest mb-2">升 空</h2>
        <p className="text-sm opacity-70">看见世界在脚下旋转</p>
      </div>
    </div>
  );
};

export default FerrisWheelCard;