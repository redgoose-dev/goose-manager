import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const { HOST, PORT, PORT_CLIENT } = Bun.env

const config = defineConfig(async ({ mode }) => {
  return {
    root: 'client',
    publicDir: './public',
    base: '/',
    server: {
      host: HOST,
      port: Number(PORT_CLIENT),
      open: false,
      proxy: {
        '/zone': {
          target: `http://0.0.0.0:${PORT}/zone`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/zone\/?/, '/'),
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          assetFileNames: assetInfo => {
            const info = assetInfo.name.split('.')
            let ext = info[info.length - 1]
            if (/png|jpe?g|svg|gif|ico|webp|avif/i.test(ext)) ext = 'images/'
            else if (/css/.test(ext)) ext = 'css/'
            else if (/woff?2|ttf/i.test(ext)) ext = 'fonts/'
            else ext = ''
            return `assets/${ext}[name]-[hash][extname]`
          },
          manualChunks: {
            vue: [
              'vue',
              'vue-router',
              'pinia',
            ],
            vendor: [
              // 'vue-advanced-cropper',
              // 'vue-draggable-plus',
              // 'marked',
              // 'ofetch',
            ],
            redgoose: [
              // '@redgoose/json-editor',
              // 'image-resize',
            ],
          },
        },
      },
      minify: 'terser',
      terserOptions: {
        format: {
          comments: false,
        },
      },
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {},
        },
      }),
    ],
  }
})

export default config
