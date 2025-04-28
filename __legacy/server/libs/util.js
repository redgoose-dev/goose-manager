/**
 * convert blob to buffer
 * @param {Blob} blob
 * @return {Promise<Buffer>}
 */
export function blobToBuffer(blob)
{
  return new Promise(resolve => {
    blob.arrayBuffer()
      .then(arrayBuffer => Buffer.from(arrayBuffer, 'binary'))
      .then(res => resolve(res))
  })
}
