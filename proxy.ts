import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import getOrCreateDb from './models/server/dbSetup'
import getOrCreateStorage from './models/server/storageSetup'

export async function proxy(_request: NextRequest) {
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
