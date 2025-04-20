
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Book,
  Menu,
  X,
  User,
  LogIn
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = false; // This will be replaced with actual auth state

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center gap-2">
            <Book className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Học liệu EPU</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Trang chủ
          </Link>
          <Link to="/courses" className="text-sm font-medium transition-colors hover:text-primary">
            Khóa học
          </Link>
          <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
            Giới thiệu
          </Link>
        </nav>

        <div className="hidden md:flex flex-1 items-center justify-end space-x-4">
          {isLoggedIn ? (
            <Link to="/profile">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth/login">
                <Button variant="outline" size="sm">Đăng nhập</Button>
              </Link>
              <Link to="/auth/register">
                <Button size="sm">Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden flex-1 justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b">
          <div className="container py-4 grid gap-4">
            <nav className="grid gap-2">
              <Link 
                to="/" 
                className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link 
                to="/courses" 
                className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Khóa học
              </Link>
              <Link 
                to="/about" 
                className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Giới thiệu
              </Link>
            </nav>
            <div className="flex flex-col gap-2">
              {isLoggedIn ? (
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <LogIn className="h-4 w-4" />
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/auth/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Đăng ký</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
