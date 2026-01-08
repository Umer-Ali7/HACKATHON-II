'use client';

import Link from 'next/link';
import { CheckSquare, Github, Twitter } from 'lucide-react';
import { Container } from './Container';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  links?: FooterLink[];
}

function Footer({ links }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const defaultLinks: FooterLink[] = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'Login', href: '/login' },
    { label: 'Sign Up', href: '/signup' },
  ];

  const allLinks = links || defaultLinks;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <Container size="xl" padding="lg">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                  <CheckSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">TaskFlow</span>
              </Link>
              <p className="text-gray-400 max-w-sm">
                Streamline your productivity with our modern task management
                application. Stay organized, focused, and achieve more.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {allLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <div className="flex gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} TaskFlow. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Built with Next.js, Tailwind CSS & FastAPI
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export { Footer };
export type { FooterProps, FooterLink };
