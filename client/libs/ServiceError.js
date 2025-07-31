/**
 * ServiceError
 *
 * @example
 * ```js
 * throw new ServiceError('Error message', { error: new Error('message'), status: 500 })
 * ```
 */
class ServiceError extends Error {

  /**
   * @param {string} message
   * @param {object} options
   * @param {Error} [options.error]
   * @param {number} [options.status]
   */
  constructor(message, options = {})
  {
    const { error, status } = options
    super(message)
    this.name = this.constructor.name
    if (error)
    {
      this.error = error
      if (error instanceof Error)
      {
        this.stack = error.stack
      }
    }
    if (status) this.status = status
  }

}

export default ServiceError
