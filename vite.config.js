import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const usdaApiKey = env.VITE_USDA_API_KEY

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/usda": {
          target: "https://api.nal.usda.gov",
          changeOrigin: true,
          secure: true,
          rewrite: (path) => {
            const rewritten = path.replace(/^\/api\/usda/, "/fdc/v1")
            if (!usdaApiKey || rewritten.includes("api_key=")) return rewritten

            const separator = rewritten.includes("?") ? "&" : "?"
            return `${rewritten}${separator}api_key=${encodeURIComponent(usdaApiKey)}`
          },
        },
      },
    },
  }
})
