import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl

  // Debug logging
  console.log(`Middleware: ${pathname}, has token: ${!!token}`)

  // Nếu chưa đăng nhập mà vào các route cần auth → chuyển về /
  const protectedRoutes = ['/products', '/dashboard', '/profile']
  if (protectedRoutes.some((path) => pathname.startsWith(path)) && !token) {
    console.log(`Redirecting to login: ${pathname} -> /`)
    const loginUrl = new URL('/', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Nếu đã đăng nhập mà lại vào / hoặc /register → chuyển về /products  
  // Thêm kiểm tra để tránh redirect loop
  if ((pathname === '/' || pathname.startsWith('/register')) && token) {
    console.log(`Authenticated user accessing login page, redirecting: ${pathname} -> /products`)
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
