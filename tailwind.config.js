/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'road-move': 'roadMove 0.6s linear infinite', 
        'bubble-rise': 'bubbleRise 4s ease-in infinite',
        'pixel-tree-move': 'pixelTreeMove 2s linear infinite',
        'zoom-forward': 'zoomForward 20s ease-out infinite',
        'walk-bob': 'walkBob 0.6s ease-in-out infinite',
        'shadow-pass': 'shadowPass 4s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'core-breathe': 'coreBreathe 6s ease-in-out infinite',
        'orbit': 'orbit linear infinite',
        'converge-top': 'convergeTop 1.5s ease-in forwards',
        'converge-left': 'convergeLeft 1.5s ease-in forwards',
        'converge-right': 'convergeRight 1.5s ease-in forwards',
        'crystal-pulse': 'crystalPulse 3s ease-in-out infinite',
        'swirl': 'swirl 4s linear infinite',
        'dissolve': 'dissolve 1s ease-out forwards',
        'tree-sway': 'treeSway 8s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'float-random': 'floatRandom 10s ease-in-out infinite',
      },
      keyframes: {
        coreBreathe: {
          '0%, 100%': { 
            transform: 'scale(1)', 
            boxShadow: '0 0 60px rgba(251, 191, 36, 0.3), inset 0 0 20px rgba(251, 191, 36, 0.2)' 
          },
          '50%': { 
            transform: 'scale(1.12)', 
            boxShadow: '0 0 120px rgba(251, 191, 36, 0.6), inset 0 0 40px rgba(251, 191, 36, 0.4)' 
          },
        },
        orbit: {
          'from': { transform: 'rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg)' },
          'to': { transform: 'rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }, 
        },
        roadMove: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(24px)' }, 
        },
        pixelTreeMove: {
          '0%': { transform: 'translateY(-20px) scale(0.5)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(200px) scale(2)', opacity: '1' },
        },
        bubbleRise: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(-20%)', opacity: '0' },
        },
        zoomForward: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.25)' },
        },
        walkBob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(3px)' },
        },
        shadowPass: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '0.1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        convergeTop: {
          '0%': { transform: 'translate(-50%, -40vh) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(-50%, -50%) scale(0.1)', opacity: '0' },
        },
        convergeLeft: {
          '0%': { transform: 'translate(-45vw, -50%) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(-50%, -50%) scale(0.1)', opacity: '0' },
        },
        convergeRight: {
          '0%': { transform: 'translate(45vw, -50%) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(-50%, -50%) scale(0.1)', opacity: '0' },
        },
        crystalPulse: {
          '0%, 100%': { filter: 'brightness(1) drop-shadow(0 0 20px rgba(167, 139, 250, 0.4))' },
          '50%': { filter: 'brightness(1.3) drop-shadow(0 0 50px rgba(167, 139, 250, 0.8))' },
        },
        swirl: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        dissolve: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        treeSway: {
          '0%': { transform: 'rotate(-2deg)' },
          '100%': { transform: 'rotate(2deg)' },
        },
        glowPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))' },
          '50%': { filter: 'drop-shadow(0 0 25px rgba(255,255,255,0.8))' },
        },
        floatRandom: {
           '0%, 100%': { transform: 'translate(0, 0)' },
           '25%': { transform: 'translate(5px, -5px)' },
           '50%': { transform: 'translate(-3px, 5px)' },
           '75%': { transform: 'translate(3px, 3px)' },
        }
      }
    },
  },
  plugins: [],
}