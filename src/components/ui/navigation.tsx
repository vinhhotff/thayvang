'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Package, LogOut, ShoppingCart, Package as OrdersIcon } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '@/Context/AuthContext'
import { useCart } from '@/hooks/useCart'

const navigationItems = [
  { href: '/products', label: 'Products' },
  { href: '/products/create', label: 'Add Product' },
  { href: '/cart', label: 'Cart', icon: ShoppingCart },
  { href: '/orders', label: 'Orders', icon: OrdersIcon },
]

export default function Navigation({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const { cart } = useCart()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully!')
      router.push('/')
    } catch {
      toast.error('Logout failed')
    }
  }

  // Topbar navigation
  return (
    <nav className="w-full h-16 bg-white shadow flex items-center px-6 fixed top-0 left-0 z-50">
      <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
        <Package className="h-7 w-7" />
        Shopping Clother
      </Link>
      <div className="flex-1 flex items-center justify-center gap-6">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isCart = item.href === '/cart';
          const cartItemCount = cart?.items?.length || 0;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-4 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-2 relative',
                pathname === item.href
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              )}
            >
              {Icon && <Icon className="h-5 w-5" />}
              {item.label}
              {isCart && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow"
        >
          <LogOut className="h-5 w-5 inline-block mr-1" /> Logout
        </button>
      </div>
    </nav>
  )
}
