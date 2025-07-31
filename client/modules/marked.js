import { Renderer } from 'marked'
import { authStore } from '../store/auth.js'

const sharp = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`

export const contentCode = {
  space: {
    code: `<p><br/></p>\n`,
    cursor: 13,
  },
  iframe: {
    code: `<div class="iframe"></div>\n`,
    cursor: 20,
  },
  gridGroup: {
    code: `<div class="grid-group">\n\n</div>\n`,
    cursor: 25,
  },
  gridItem: {
    code: `<figure class="grid-item" data-mobile="3" data-ratio="">\n\n</figure>\n`,
    cursor: 57,
  },
  image: {
    code: `<goose-dark-mode-image\n  src-light=""\n  src-dark=""\n  alt=""/>\n`,
    cursor: 36,
  },
}

export const defaultOptions = {
  gfm: true,
  breaks: true,
  silent: true,
}

/**
 * @param {boolean} options.useHeadingLink
 * @return {Renderer}
 */
export function baseRenderer(renderer = null, options = {})
{
  if (!renderer) renderer = new Renderer()
  renderer.heading = (ctx) => {
    const { depth, text } = ctx
    const id = text.replace(/\s+/g, '_')
    let str = `<h${depth} id="${id}">`
    if (options.useHeadingLink)
    {
      str += `<a href="#${id}" class="anchor">${sharp}</a>`
    }
    str += `${text}</h${depth}>`
    return str
  }
  renderer.image = (ctx) => {
    const { href, title, text } = ctx
    return `<img src="${href}" alt="${title || text}" loading="lazy"/>`
  }
  renderer.link = (ctx) => {
    const { href, title, text } = ctx
    const _target = /^http/.test(href) ? ' target="_blank"' : ''
    const _title = title ? ` title="${title}"` : ''
    return `<a href="${href}"${_target}${_title}>${text}</a>`
  }
  return renderer
}

export function checklistRenderer(renderer, disabled = false)
{
  if (!renderer) renderer = new Renderer()
  renderer.listitem = (ctx) => {
    let { text, raw, checked, task } = ctx
    if (task)
    {
      const _checked = checked ? ' checked' : ''
      const _disabled = disabled ? ' disabled' : ''
      const checkbox = `<span class="checkbox"><input type="checkbox"${_checked}${_disabled}/><i></i></span>`
      return `<li class="checkbox-item"><label>${checkbox}${text}</label></li>`
    }
    else
    {
      return `<li>${text}</li>`
    }
  }
  return renderer
}

/**
 * render content
 * @param {string} text
 * @param {boolean} withToken
 * @return {string}
 */
export function renderContent(text, withToken)
{
  const auth = authStore()
  let str = text
  if (withToken)
  {
    str = str.replace(/(\{\{API_HOST\}\}\/file\/[^/]+\/)/g, `$1?_a=${auth.token}`)
  }
  str = str.replaceAll('{{API_HOST}}', auth.apiUrl)
  return str
}
