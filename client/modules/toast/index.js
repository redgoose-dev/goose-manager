import { sleep } from '../../libs/util.js'
import './index.scss'

const defaultOptions = {
  id: 'rg-toast',
  speed: 300,
  delay: 3000,
  color: '', // key,success,error
  max: 5,
}

class Toast {

  constructor(options = {})
  {
    this.options = this.#mergeOptions(defaultOptions, options)
    this.elementClassName = 'rg-toast'
    this.index = new Map()
    this.key = 0
    // check element
    if (document.getElementById(this.options.id))
    {
      throw new Error('exist toast element')
    }
    // create container element
    this.$container = document.createElement('div')
    this.$container.setAttribute('popover', 'manual')
    this.$container.setAttribute('id', this.options.id)
    this.$container.classList.add('rg-toast')
    this.$index = document.createElement('ul')
    // append element
    this.$container.appendChild(this.$index)
    document.body.appendChild(this.$container)
  }

  /**
   * add toast message
   * @param {string} message
   * @param {'key'|'sub'|'success'|'error'|''} color
   * @return {Promise<void>}
   */
  async add(message, color = '')
  {
    if (!message) return
    // open container
    if (this.index.size <= 0) this.$container.showPopover()
    // set values
    color = this.#getColor(color)
    // set element
    let $item = this.#stringToElement(`<li><p><span>${message}</span></p><i/></li>`)
    $item.dataset.key = this.key
    $item.dataset.speed = this.options.speed
    $item.dataset.delay = this.options.delay
    // set color
    if (color) $item.classList.add(`color-${color}`)
    // set event
    $item.addEventListener('click', e => {
      this.remove(Number(e.currentTarget.dataset.key)).then()
    })
    // push item
    this.index.set(this.key, {
      el: $item,
      message,
      color,
    })
    // update key for next toast
    this.key += 1
    // append content
    this.$index.insertBefore($item, this.$index.firstChild)
    // toast 갯수가 특정갯수가 넘어가면 오래된것부터 삭제한다.
    if (this.options.max < this.index.size)
    {
      Array.from(this.index)
        .reverse()
        .slice(this.options.max, this.index.size)
        .forEach(([key]) => this.remove(Number(key)))
    }
    // play animation
    await sleep(20)
    $item.style.transitionDuration = `${this.options.speed}ms`
    $item.classList.add('show')
    // check delay (`delay`값이 20보다 작으면 항상 떠있도록..)
    if (this.options.delay < 20) return
    // transition end
    const openEvent = await this.#transitionEnd($item, '')
    // set progress
    const progress = openEvent.target.querySelector('i')
    progress.style.animationDuration = `${openEvent.target.dataset.delay}ms`
    progress.classList.add('play')
    const progressEvent = await this.#transitionEnd(progress, 'animation')
    this.remove(Number(progressEvent.target.parentNode.dataset.key)).then()
  }

  /**
   * remove toast message
   * @param {number} key
   * @return {Promise<void>}
   */
  async remove(key)
  {
    // check key
    if (!this.index.has(key)) return
    // get item
    const item = this.index.get(key)
    const el = item.el
    // remove item from index
    delete this.index.delete(key)
    // close animation
    el.style.transitionDuration = `${this.options.speed}ms`
    el.classList.remove('show')
    // transition end
    const closeEvent = await this.#transitionEnd(el, '')
    // remove element
    this.$index.removeChild(closeEvent.target)
    // close container
    if (this.index.size <= 0) this.$container.hidePopover()
  }

  #mergeOptions(options, newOptions)
  {
    return {
      ...options,
      ...newOptions,
      speed: newOptions?.speed || options?.speed || 100,
      delay: newOptions?.delay || options?.delay || 0,
    }
  }

  #getColor(name)
  {
    switch (name)
    {
      case 'key':
      case 'sub':
      case 'success':
      case 'error':
        return name
      default:
        return this.options.color
    }
  }

  #stringToElement(html)
  {
    const template = document.createElement('template')
    template.innerHTML = html.trim()
    return template.content.firstChild
  }

  /**
   * transition end event
   * @param {HTMLElement} dom
   * @param {'animation'|''} type
   * @return {Promise<Event>}
   */
  #transitionEnd(dom, type)
  {
    return new Promise(resolve => {
      if (!dom) return
      let event = { base: '', webkit: '' }
      switch (type)
      {
        case 'animation':
          event.base = 'animationend'
          event.webkit = 'webkitAnimationEnd'
          break
        default:
          event.base = 'transitionend'
          event.webkit = 'webkitTransitionEnd'
          break
      }
      function callback(e)
      {
        dom.removeEventListener(event.base, callback)
        dom.removeEventListener(event.webkit, callback)
        resolve(e)
      }
      dom.addEventListener(event.base, callback)
      dom.addEventListener(event.webkit, callback)
    })
  }

}

export default {
  install(app, options)
  {
    const toast = new Toast(options)
    app.config.globalProperties.$toast = toast
    app.provide('toast', toast)
  },
}
