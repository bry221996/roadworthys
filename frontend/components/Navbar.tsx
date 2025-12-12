'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Roadworthys
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-md" />
            ) : user ? (
              <>
                <span className="text-sm font-medium text-gray-700">
                  Welcome, {user.name}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}