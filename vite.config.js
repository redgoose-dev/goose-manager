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
    css: {},
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => /^ext-|^goose-/.test(tag),
          },
        },
      }),
      createServiceWorkerPlugin(),
    ],
  }
})

export default config
