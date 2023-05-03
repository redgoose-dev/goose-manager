import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import createServiceWorkerPlugin from './plugins/create-service-worker'

const config = defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_BASE_URL,
    server: {
      host: env.VITE_HOST,
      port: Number(env.VITE_PORT),
      open: env.VITE_OPEN_BROWSER === 'true',
    },
    build: {
      outDir: env.VITE_OUT_DIR || 'dist',
      rollupOptions: {},
    },
    define: {
      'TITLE': JSON.stringify(env.VITE_TITLE),
      'DESCRIPTION': JSON.stringify(env.VITE_DESCRIPTION),
      'SHORT_NAME': JSON.stringify(env.VITE_SHORT_NAME),
      'DEBUG': JSON.stringify(env.VITE_DEBUG === 'true'),
      'API_URL': JSON.stringify(env.VITE_API_URL),
      'BASE_URL': JSON.stringify(env.VITE_BASE_URL),
      'STORAGE_PREFIX': JSON.stringify(env.VITE_STORAGE_PREFIX),
      'DEVELOPMENT': JSON.stringify(mode === 'development'),
    },
    css: {},
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => tag.startsWith('ext-'),
          },
        },
      }),
      createServiceWorkerPlugin(),
    ],
  }
})

export default config
