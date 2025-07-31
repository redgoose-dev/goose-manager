/**
 * ServerError class
 *
 * @example
 * ```
 * throw new ServerError('오류 메시지', { status, url, error })
 * ```
 */
class ServerError {

  /**
   * Constructor
   * @param {string} message
   * @param {object} options
   */
  constructor(message, options = {})
  {
    const { status, statusText, error, response } = options
    this.message = message
    this.status = status
    this.statusText = statusText || message
    if (error) this.error = error
    if (response) this.response = response
  }

}

export default ServerError
