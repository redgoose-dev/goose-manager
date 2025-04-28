import fs from 'fs'
import { build } from 'esbuild'

const pathServiceWorker = 'dist/sw.js'
const pathServiceWorkerTarget = 'dist/sw.js'
const cacheName = 'redgoose-manager'
const splitKeyword = '// END OF RESOURCE //'
const cswParams = {
  target: 'dist',
  output: '',
  ignore: {
    files: [
      '.DS_Store',
      'robots.txt',
      'manifest.webmanifest',
      'sw.js',
    ],
    children: {
      assets: { files: [ '.DS_Store' ] },
      images: { files: [ '.DS_Store' ] },
    },
  }
}

function vitePluginCreateServiceWorker(options)
{
  return {
    name: 'create-service-worker',
    apply: 'build',
    closeBundle()
    {
      async function updateServiceWorkerFile(paths)
      {
        let str = ''
        const swText = fs.readFileSync(pathServiceWorker, 'utf-8')
        const resources = paths.map(o => `'${o}'`).join(',')
        str += `const CACHE_NAME = '${cacheName}--${Math.floor(performance.timeOrigin)}'\n`
        str += `const CACHE_RESOURCE = [${resources}]\n`
        str += swText.split(splitKeyword)[1]
        fs.writeFileSync(pathServiceWorkerTarget || '', str)
        await build({
          platform: 'node',
          bundle: true,
          minify: true,
          format: 'esm',
          entryPoints: [ pathServiceWorkerTarget || '' ],
          outfile: pathServiceWorkerTarget || '',
          allowOverwrite: true,
        })
      }
      function createServiceWorker(target, output, ignore)
      {
        /**
         * get files in directory
         * @param {string} path 부모 패스
         * @param {string} output 출력용 패스
         * @param {object} ignore 스킵할때의 파일이름
         * @return {string[]}
         */
        function getFiles(path, output, ignore)
        {
          let result = []
          const files = fs.readdirSync(path, { withFileTypes: true })
          files.forEach(file => {
            if (ignore?.files?.length > 0)
            {
              if (ignore.files.indexOf(file.name) > -1) return
            }
            if (file.isDirectory())
            {
              result = result.concat(
                getFiles(
                  `${path}/${file.name}`,
                  `${output}/${file.name}`,
                  ignore?.children || undefined
                )
              )
            }
            else
            {
              result.push(`${output}/${file.name}`)
            }
          })
          return result
        }
        return getFiles(target, output, ignore)
      }
      const paths = createServiceWorker(cswParams.target, cswParams.output, cswParams.ignore)
      updateServiceWorkerFile(paths).then()
    },
  }
}

export default vitePluginCreateServiceWorker
