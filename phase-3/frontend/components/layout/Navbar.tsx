"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight">
          TodoAI
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#demo"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Demo
          </Link>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="#features"
              className="text-sm text-muted-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#demo"
              className="text-sm text-muted-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Demo
            </Link>
            <div className="flex items-center gap-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button className="w-full" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
