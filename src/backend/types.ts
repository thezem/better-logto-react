export interface AuthPayload {
  sub: string // user ID
  scope: string
  [key: string]: any
}

export interface AuthContext {
  userId: string
  isAuthenticated: boolean
  payload: AuthPayload
}

export interface VerifyAuthOptions {
  logtoUrl: string
  audience: string
  cookieName?: string
  requiredScope?: string
}

// Express middleware types
export interface ExpressRequest {
  cookies?: { [key: string]: string }
  headers: { [key: string]: string | string[] | undefined }
  auth?: AuthContext
}

export interface ExpressResponse {
  status: (code: number) => ExpressResponse
  json: (obj: any) => ExpressResponse
}

export type ExpressNext = () => void

// Next.js types
export interface NextRequest {
  cookies: {
    get: (name: string) => { value: string } | undefined
  }
  headers: {
    get: (name: string) => string | null
  }
}

export interface NextResponse {
  json: (body: any, init?: { status?: number }) => NextResponse
}
