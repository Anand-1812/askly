import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import getOrCreateDb from './modles/server/dbSetup'
import getOrCreateStorage from './modles/server/storage.collection'

export async function proxy(request: NextRequest) {
  await Promise.all([
    getOrCreateDb(),
    getOrCreateStorage(),
  ])

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/"
  ]
}
