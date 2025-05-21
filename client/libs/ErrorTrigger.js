import { inject } from 'vue'
const { DEV } = import.meta.env

class ErrorTrigger {

  #toast

  constructor()
  {
    this.#toast = inject('toast')
  }

  /**
   * 콘솔로그로 출력
   * @param {array} [path]
   * @param {string} [message]
   * @param {Error} [error]
   */
  catch({ path, message, error })
  {
    if (!message || !path) return
    let _tree = []
    if (DEV)
    {
      if (error)
      {
        console.group(path.join('/'))
        console.error('🚨', message)
        console.error('📦', error)
        console.groupEnd()
      }
      else
      {
        _tree.push(`🗄️ ${path.join('/')}`)
        _tree.push(`🚨 ${message}`)
        console.error(_tree.join('\n'))
      }
    }
    this.#toast.add(message, 'error').then()
  }

}

export default ErrorTrigger
