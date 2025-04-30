
// TODO: 오류처리

function onError(err)
{
  console.error(err?.stack || err)
    return new Response(`Internal Error: ${err.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    })
}

export default onError
