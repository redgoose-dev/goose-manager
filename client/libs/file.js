/**
 * file uploader
 * @param {string} [options.accept]
 * @param {boolean} [options.multiple]
 * @return {Promise<FileList|array>}
 */
export function fileUploader(options = {})
{
  return new Promise(resolve => {
    const input = document.createElement('input')
    input.type = 'file'
    if (options.accept) input.accept = options.accept
    if (options.multiple === true) input.multiple = true
    input.addEventListener('change', e => {
      const files = Object.assign([], e.target.files)
      if (files.length <= 0) return resolve([])
      input.value = null
      resolve((options.multiple === true) ? files : files[0])
    })
    input.addEventListener('cancel', () => {
      resolve((options.multiple === true) ? [] : null)
    })
    input.click()
  })
}

/**
 * download file
 * @param {string} url
 * @param {string} filename
 */
export function downloadFile(url, filename)
{
  const el = document.createElement('a')
  el.href = url
  el.download = filename
  el.click()
}

/**
 * blob to file
 * @param {Blob} blob
 * @param {string} name
 * @param {object} options
 * @return {File}
 */
export function blobToFile(blob, name, options = {})
{
  return new File([blob], name, options)
}

/**
 * load image
 * @param {string} src
 * @return {Promise<Image>}
 */
export function loadImage(src)
{
  return new Promise((resolve => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.src = src
  }))
}
