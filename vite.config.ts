import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // 🟢 [핵심 1] 깃허브 배포 주소 경로를 명확하게 지정합니다.
    base: '/graceenglsihclass2026-graceclass/',
    
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    // 🟢 [핵심 2] 빌드된 결과물이 섞이지 않고 정확히 dist/client로 들어가게 쐐기를 박습니다.
    build: {
      outDir: 'dist/client',
      assetsDir: 'assets',
      emptyOutDir: true,
    }
  };
});
