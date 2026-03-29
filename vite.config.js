import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const { HOST, PORT, PORT_CLIENT } = Bun.env

const config = defineConfig(() => {
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
          target: `http://${HOST}:${PORT}/zone`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/zone\/?/, '/'),
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // api: 'modern-compiler',
        },
      },
    },
    build: {
      outDir: '../dist/client',
      emptyOutDir: true,
      rolldownOptions: {
        output: {
          assetFileNames: assetInfo => {
            const info = assetInfo.name?.split('.') || ''
            let ext = info ? info[info.length - 1] : ''
            let subDir = ''
            if (/png|jpe?g|svg|gif|ico|webp|avif/i.test(ext)) subDir = 'images/'
            else if (/css/.test(ext)) subDir = 'css/'
            else if (/woff?2|ttf/i.test(ext)) subDir = 'fonts/'
            return `assets/${subDir}[name]-[hash][extname]`
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
    resolve: {
      alias: {
        '@': new URL('./client', import.meta.url).pathname,
      }
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
