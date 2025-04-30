
// TODO: GOOSE-API 서비스 프록시

async function api()
{
  return Response.json({
    message: '/api',
    timestamp: new Date().toISOString(),
  })
}

export default api
