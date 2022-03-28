/**
 * sleep (delay tool)
 * @param {number} ms
 * @return {Promise<void>}
 */
export function sleep(ms = 1000)
{
  return new Promise(resolve => setTimeout(resolve, ms));
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
      if (!this.namespaces) this.namespaces = {};
      this.namespaces[event] = cb;
      const options = opts || false;
      this.addEventListener(event.split('.')[0], cb, options);
      return this;
    },
    off(event)
    {
      if (!(this.namespaces && this.namespaces[event])) return;
      this.removeEventListener(event.split('.')[0], this.namespaces[event]);
      delete this.namespaces[event];
      return this;
    },
  };
  window.on = document.on = Element.prototype.on = events.on;
  window.off = document.off = Element.prototype.off = events.off;
}

/**
 * load image
 * @param {string} src
 * @return {Promise<HTMLImageElement>}
 */
export function loadImage(src)
{
  return new Promise((resolve => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = src;
  }));
}

/**
 * get image size
 * @param {string} type
 * @param {number} set_w
 * @param {number} set_h
 * @param {number} img_w
 * @param {number} img_h
 * @return {object}
 */
export function getImageSize(type, set_w, set_h, img_w, img_h)
{
  let size = {};
  switch(type)
  {
    case 'resize':
      if (img_w < img_h)
      {
        size.width = Math.floor((img_w / img_h) * set_h);
        size.height = set_h;
      }
      else
      {
        size.width = set_w;
        size.height = Math.floor((img_h / img_w) * set_w);
      }
      break;
    case 'resizeWidth':
      size.width = set_w;
      size.height = Math.floor((img_h / img_w) * set_w);
      break;
    case 'resizeHeight':
      size.width = Math.floor((img_w / img_h) * set_h);
      size.height = set_h;
      break;
    default:
      size.width = set_w;
      size.height = set_h;
      break;
  }
  return size;
}

/**
 * change theme
 * @param {string} color
 */
export function changeTheme(color)
{
  let theme;
  switch(color)
  {
    case 'light':
    case 'dark':
      theme = color;
      break;
    default:
      theme = 'system';
      break;
  }
  const $html = document.querySelector('html');
  $html.dataset['color'] = theme;
}
