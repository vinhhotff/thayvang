import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl

  // Nếu chưa đăng nhập mà vào các route cần auth → chuyển về /login
  const protectedRoutes = ['/products', '/dashboard', '/profile']
  if (protectedRoutes.some((path) => pathname.startsWith(path)) && !token) {
    const loginUrl = new URL('/', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Nếu đã đăng nhập mà lại vào /login hoặc /register → chuyển về /products
  if ((pathname.startsWith('/') || pathname.startsWith('/register')) && token) {
    const productsUrl = new URL('/products', request.url)
    return NextResponse.redirect(productsUrl)
  }

  return NextResponse.next()
}

// Áp dụng middleware cho tất cả route trong app
export const config = {
  matcher: [
    '/',
    '/register',
    '/products/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
  ],
}
