import { toast } from '../modules/toast'

/**
 * sleep (delay tool)
 */
export function sleep(ms = 1000)
{
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * initial custom event
 * 중복되는 `dom`에다 여러 이벤트를 넣고 싶을때(특히 window) 유니크한 이름으로 이벤트를 만들 수 있도록 커스텀 이벤트를 만들어서 사용할때 사용한다.
 */
export function initCustomEvent()
{
  const events = {
    on(event, cb, opts = undefined)
    {
      if (!this.namespaces) this.namespaces = {}
      this.namespaces[event] = cb
      const options = opts || false
      this.addEventListener(event.split('.')[0], cb, options)
      return this
    },
    off(event)
    {
      if (!(this.namespaces && this.namespaces[event])) return
      this.removeEventListener(event.split('.')[0], this.namespaces[event])
      delete this.namespaces[event]
      return this
    },
  }
  window.on = document.on = Element.prototype.on = events.on
  window.off = document.off = Element.prototype.off = events.off
}

/**
 * load image
 */
export function loadImage(src)
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
export function getImageSize(type, set_w, set_h, img_w, img_h)
{
  let size = { width: NaN, height: NaN }
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

export function scrollTo(y = 0)
{
  window.scroll(0, y)
}

export function getFilterKey()
{
  return location.pathname
}

/**
 * copy clipboard
 * @param {string} text
 */
export function copyClipboard(text)
{
  const textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.select()
  try
  {
    document.execCommand('copy')
    toast.add('클립보드로 복사했습니다.', 'success').then()
  }
  catch (e)
  {
    toast.add('클립보드로 복사하지 못했습니다.', 'error').then()
  }
  finally
  {
    textArea.remove()
  }
}
