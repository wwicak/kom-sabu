import { NextRequest } from 'next/server'
import { handleCSRFToken } from '@/lib/csrf'

// GET /api/csrf-token - Get CSRF token for forms
export async function GET(request: NextRequest) {
  return handleCSRFToken(request)
}
