/**
 * server
 *
 * @param {Express} app
 */
function server(app)
{
  app.use('/foo', (req, res) => res.end('foo'));
}

export default server;
