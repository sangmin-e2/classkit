import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 1. 환경 변수 로드 (Vercel에 설정한 GEMINI_API_KEY를 가져옵니다)
  const env = loadEnv(mode, process.cwd(), '');
  // Vercel 환경과 로컬 환경 어디서든 키를 찾도록 안전장치를 걸었습니다.
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

  return {
    server: { port: 3000, host: '0.0.0.0' },
    plugins: [react()],
    define: {
      // 2. 앱 안에서 process.env.GEMINI_API_KEY로 쓸 수 있게 연결
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
      'process.env.API_KEY': JSON.stringify(apiKey) 
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, '.') }
    },
    // 3. 하얀 화면 해결의 핵심! (경로를 기본값으로 고정)
    base: '/',
  };
});
