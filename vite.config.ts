import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use (process as any) to avoid TS errors in some environments if @types/node isn't perfect
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // 1. Inject API Key safely
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY),
      // 2. Polyfill process.env to prevent "process is not defined" crashes
      'process.env': {},
    }
  }
})