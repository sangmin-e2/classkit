import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        // 🚨 수정된 부분: './src'가 아니라 현재 폴더('.')를 가리키게 했습니다.
        '@': path.resolve(__dirname, '.'),
      },
    },
    // 브라우저 호환성을 위한 설정
    define: {
      'process.env': {},
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''),
      'process.env.VITE_GOOGLE_API_KEY': JSON.stringify(env.VITE_GOOGLE_API_KEY || process.env.VITE_GOOGLE_API_KEY || ''),
    },
    // 배포 경로 설정
    base: '/',
  };
});
