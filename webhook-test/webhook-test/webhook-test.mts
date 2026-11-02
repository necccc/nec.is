export default (request: Request) => {
  try {
    const url = new URL(request.url)
    const bx = url.searchParams.get('bx')

    if (bx !== '887235') {
      return new Response('Error', {
        status: 400,
      })
    }

    if (!request.body) {
      return new Response('Error', {
        status: 400,
      })
    }

    console.log('Incoming call', {
      headers: request.headers,
    })
  } catch (error) {
    return new Response('Error', {
      status: 500,
    })
  }
}
