
// TODO: dist 속 에셋을 서빙하기

async function statics()
{
  return Response.json({
    message: 'Hello from the server!',
    timestamp: new Date().toISOString(),
  })
}

export default statics
