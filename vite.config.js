import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

// docs: https://vitejs.dev/config

const config = defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    server: {
      // https://vitejs.dev/config/#server-options
      host: env.VITE_HOST,
      port: Number(env.VITE_PORT),
      open: env.VITE_OPEN_BROWSER === 'true',
    },
    build: {
      // https://vitejs.dev/config/#build-options
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
    },
    plugins: [
      // https://vitejs.dev/guide/api-plugin.html
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => tag.startsWith('ext-'),
          },
        },
      }),
    ],
    css: {},
  };
});

export default config;
