import { type Context } from '@netlify/functions'
import type Stream from 'node:stream'

async function stream2buffer(stream: Stream): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const _buf = Array<any>()

    stream.on('data', (chunk) => _buf.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(_buf)))
    stream.on('error', (err) => reject(`error converting stream - ${err}`))
  })
}

export default (request: Request, context: Context) => {
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
