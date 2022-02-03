import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

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
      'DEBUG': JSON.stringify(env.VITE_DEBUG === 'true'),
    },
    plugins: [
      // https://vitejs.dev/guide/api-plugin.html
      svelte({
        preprocess: sveltePreprocess(),
      }),
    ],
    css: {},
  };
});

export default config;
