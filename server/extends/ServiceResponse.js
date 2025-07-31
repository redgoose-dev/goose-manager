
class ServerResponse {

  constructor(status = 500, content = null)
  {
    this.status = status
    this.content = content
  }

}

export default ServerResponse
