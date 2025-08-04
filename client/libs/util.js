/**
 * sleep (delay tool)
 */
export function sleep(ms = 1000)
{
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * @param {number} y
 */
export function scrollTo(y = 0)
{
  window.scroll(0, y)
}

/**
 * 커스텀 이벤트 트리거
 * @param {EventTarget} target
 * @param {string} name
 * @param {any} value
 */
export function triggerEvent(target, name, value = undefined)
{
  if (!(target && name)) return
  target.dispatchEvent(new CustomEvent(name, { detail: value }))
}

/**
 * Copy to clipboard
 * @param {string} text
 */
export async function copyToClipboard(text)
{
  if (!navigator.clipboard) throw new Error('클립보드 기능을 지원하지 않는 환경입니다.')
  await navigator.clipboard.writeText(text)
}
