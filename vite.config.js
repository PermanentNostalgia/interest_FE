import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const loginEndpoint = env.VITE_KAKAO_LOGIN_ENDPOINT
  const apiTarget = loginEndpoint
    ? new URL(loginEndpoint).origin
    : env.VITE_API_BASE_URL || undefined

  return {
    plugins: [react()],
    server: {
      // BE CORS 허용 주소: http://localhost:5173
      port: 5173,
      strictPort: true,
      proxy: apiTarget
        ? {
            '/api': {
              target: apiTarget,
              changeOrigin: true,
            },
          }
        : undefined,
    },
  }
})
