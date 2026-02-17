/**
 * Build server with Bun's built-in bundler
 */

console.log('🪴 Start build BACKEND...')

// run build
await Bun.build({
  root: '.',
  entrypoints: [ './server/main.js' ],
  outdir: './dist',
  target: 'bun',
  format: 'esm',
  splitting: true,
  minify: {
    whitespace: true,
    identifiers: true,
    syntax: true,
  },
  external: [],
  naming: {
    entry: '[name].[ext]',
    chunk: 'service/chunk-[name]-[hash].[ext]',
    asset: 'service/asset-[name]-[hash].[ext]',
  },
  define: {
    'Bun.env.USE_BUILD': JSON.stringify(true),
  },
  plugins: [],
})

console.log('✅ Complete build BACKEND...')
