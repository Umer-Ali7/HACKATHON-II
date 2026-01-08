'use client';

import Link from 'next/link';
import { LogOut, CheckSquare } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Container } from './Container';
import { cn } from '@/lib/utils';

interface HeaderProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
  hasScrolled?: boolean;
}

function Header({ user, onLogout, hasScrolled = false }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-200',
        hasScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-md'
          : 'bg-white'
      )}
    >
      <Container size="xl" padding="md">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/tasks" className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TaskFlow</span>
          </Link>

          {/* User Section */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <Avatar name={user.name || user.email} size="sm" />
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}

export { Header };
export type { HeaderProps };
