import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    siteKey: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
    secretKey: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ? 'SET' : 'NOT_SET',
    nodeEnv: process.env.NODE_ENV
  })
}
