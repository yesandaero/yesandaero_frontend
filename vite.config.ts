import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8080'

  return {
    plugins: [react()],
    server: {
      port: Number(env.PORT) || 5173,
      strictPort: !!env.PORT,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // 브라우저의 localhost Origin을 백엔드까지 전달하면 Spring CORS가
              // 서버 간 프록시 요청을 교차 출처 요청으로 오인해 403을 반환한다.
              proxyReq.removeHeader('origin')
              proxyReq.removeHeader('referer')
            })
          },
          // 브라우저의 /api/auth/signup 요청을 명세의 /auth/signup으로 전달한다.
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
