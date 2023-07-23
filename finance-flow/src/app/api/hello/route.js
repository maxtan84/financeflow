export async function GET(request) {
  return new Response('Hello there')
}

export async function POST(req) {
  const body = await req.json()
  console.log(body)
  return new Response('OK')
}
