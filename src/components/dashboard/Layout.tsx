// components/Layout.tsx
import React, {PropsWithChildren} from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/auth-service';

export default function Layout({ children }: PropsWithChildren) {
  const { logout } = useAuth();
  const { toast } = useToast();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-pink-50 to-pink-100">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-pink-100/50 shadow-sm">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">1C</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                1ClikPost
              </span>
            </div>
            
            {/* Navigation Links */}
            <ul className="hidden md:flex items-center space-x-8">
              <li>
                <a href="/" className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200 relative group">
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-200"></span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200 relative group">
                  Generate Post
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-200"></span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200 relative group">
                  My Posts
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-200"></span>
                </a>
              </li>
              <li>
                <button 
                  onClick={async () => {
                    try {
                      await authService.logout();
                      logout();
                      toast({
                        title: "Success",
                        description: "You have been signed out successfully",
                        variant: "default",
                      });
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to sign out. Please try again.",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-md border transition-all duration-200 hover:shadow-lg"
                >
                  Sign Out
                </button>
              </li>
            </ul>

            {/* Mobile Menu Button */}
            <div className="md:hidden relative">
              <button className="p-2 rounded-lg hover:bg-pink-100 transition-colors" onClick={() => document.getElementById('mobile-menu')?.classList.toggle('hidden')}>
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Mobile Menu Dropdown */}
              <div id="mobile-menu" className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-pink-50">Dashboard</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-pink-50">Generate Post</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-pink-50">My Posts</a>
                <button 
                  onClick={async () => {
                    try {
                      await authService.logout();
                      logout();
                      toast({
                        title: "Success",
                        description: "You have been signed out successfully",
                        variant: "default",
                      });
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to sign out. Please try again.",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-pink-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8">
        {children}
      </main>

      {/* Optional Footer */}
      <footer className="backdrop-blur-xl bg-white/50 border-t border-pink-100/50 py-6 mt-auto">
        <div className="container mx-auto px-6 text-center text-gray-600 text-sm">
          <p>© 2025 1ClikPost. Crafted with care.</p>
        </div>
      </footer>
    </div>
  );
}