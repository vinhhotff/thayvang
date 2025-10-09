'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Package, LogOut } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '@/Context/AuthContext'

const navigationItems = [
  { href: '/', label: 'Products' },
  { href: '/products/create', label: 'Add Product' },
]

export default function Navigation({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

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
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'px-4 py-2 rounded-md text-base font-medium transition-colors',
              pathname === item.href
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
            )}
          >
            {item.label}
          </Link>
        ))}
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
