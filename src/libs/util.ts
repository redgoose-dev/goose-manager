/**
 * sleep (delay tool)
 */
export function sleep(ms: number = 1000): Promise<void>
{
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * initial custom event
 * 중복되는 `dom`에다 여러 이벤트를 넣고 싶을때(특히 window) 유니크한 이름으로 이벤트를 만들 수 있도록 커스텀 이벤트를 만들어서 사용할때 사용한다.
 */
export function initCustomEvent(): void
{
  const events: any = {
    on(event: string, cb: Function, opts: any = undefined)
    {
      if (!this.namespaces) this.namespaces = {}
      this.namespaces[event] = cb
      const options = opts || false
      this.addEventListener(event.split('.')[0], cb, options)
      return this
    },
    off(event: string)
    {
      if (!(this.namespaces && this.namespaces[event])) return
      this.removeEventListener(event.split('.')[0], this.namespaces[event])
      delete this.namespaces[event]
      return this
    },
  }
  ;(window as any).on = (document as any).on = (Element.prototype as any).on = events.on
  ;(window as any).off = (document as any).off = (Element.prototype as any).off = events.off
}

/**
 * load image
 */
export function loadImage(src: string): Promise<HTMLImageElement>
{
  return new Promise((resolve => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.src = src
  }))
}

/**
 * get image size
 */
interface Size {
  width: number
  height: number
}
export function getImageSize(type: string, set_w: number, set_h: number, img_w: number, img_h: number): Size
{
  let size: Size = { width: NaN, height: NaN }
  switch(type)
  {
    case 'resize':
      if (img_w < img_h)
      {
        size.width = Math.floor((img_w / img_h) * set_h)
        size.height = set_h
      }
      else
      {
        size.width = set_w
        size.height = Math.floor((img_h / img_w) * set_w)
      }
      break
    case 'resizeWidth':
      size.width = set_w
      size.height = Math.floor((img_h / img_w) * set_w)
      break
    case 'resizeHeight':
      size.width = Math.floor((img_w / img_h) * set_h)
      size.height = set_h
      break
    default:
      size.width = set_w
      size.height = set_h
      break
  }
  return size
}

export function scrollTo(y: number = 0): void
{
  window.scroll(0, y)
}
