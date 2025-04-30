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
    const { status, error } = options
    this.message = message
    this.status = status
    if (error) this.error = error
  }

}

export default ServerError
