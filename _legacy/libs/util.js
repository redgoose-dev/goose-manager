/**
 * sleep
 *
 * @param {Number} delay
 * @param params
 * @param {Number} timer
 * @return {Promise}
 */
export function sleep(delay=1000, params=null, timer=null)
{
  return new Promise(function(resolve){
    if (timer)
    {
      clearTimeout(timer);
      timer = setTimeout(() => { resolve(params, timer); }, delay);
    }
    else
    {
      setTimeout(() => { resolve(params, this); }, delay);
    }
  });
}

/**
 * get browser name
 *
 * @return string
 */
export function browser()
{
  if (!navigator) return '';

  if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor))
  {
    return 'chrome';
  }
  else if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
  {
    return 'firefox';
  }
  else if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/))
  {
    return 'safari';
  }
  else if (navigator.userAgent.toLowerCase().indexOf('op') > -1)
  {
    return 'opera';
  }
  else
  {
    return 'unknown';
  }
}

/**
 * get thumbnail size
 *
 * @param {object} options
 * @param {String} src
 * @return {Promise}
 */
export function getThumbnailSize(options, src)
{
  /**
   * get size
   *
   * @param {String} type
   * @param {Number} set_w
   * @param {Number} set_h
   * @param {Number} img_w
   * @param {Number} img_h
   * @return {Number}
   */
  function getSize(type, set_w, set_h, img_w, img_h)
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

  return new Promise(function(resolve, reject){
    const image = new Image();
    image.onload = function(e)
    {
      const size = getSize(
        options.type,
        Number(options.width),
        Number(options.height),
        Number(image.width),
        Number(image.height)
      );
      resolve(size);
    };
    image.onerror = function(e)
    {
      reject(e);
    };
    image.src = src;
  });
}

/**
 * initial custom event
 * 중복되는 `dom`에다 여러 이벤트를 넣고 싶을때(특히 window) 유니크한 이름으로 이벤트를 만들 수 있도록 커스텀 이벤트를 만들어서 사용할때 사용한다.
 * https://gist.github.com/yairEO/cb60592476a4204b27e83048949dbb45
 */
export function initCustomEvent()
{
  if (!window) return;
  const events = {
    on(event, cb, opts)
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
