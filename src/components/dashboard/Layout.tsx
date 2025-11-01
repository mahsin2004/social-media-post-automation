'use client';
// components/Layout.tsx
import React, { PropsWithChildren, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth-service";
import {
  TrendingUp,
  Calendar,
  Send,
  BarChart3,
  MessageSquare,
  Plus,
  Settings,
  HelpCircle,
  Menu,
  X,
  Sparkles,
  Bell,
  FileText,
  Home,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Layout({ children }: PropsWithChildren) {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [activeItem, setActiveItem] = useState<number | string>(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      id: "analytics",
      path: "/dashboard/analytics",
      icon: TrendingUp,
      label: "Analytics",
      color: "from-purple-400 to-purple-500",
    },
    {
      id: "calendar",
      path: "/dashboard/calendar",
      icon: Calendar,
      label: "Calendar",
      color: "from-purple-400 to-purple-500",
    },
    {
      id: "dashboard",
      path: "/dashboard",
      icon: Home,
      label: "Dashboard",
      color: "from-purple-400 to-purple-500",
    },
    {
      id: "messages",
      path: "/dashboard/messages",
      icon: MessageSquare,
      label: "Messages",
      color: "from-purple-400 to-purple-500",
    },
  ];

  const bottomItems = [
    {
      id: "settings",
      path: "/dashboard/settings",
      icon: Settings,
      label: "Settings",
      color: "from-purple-400 to-purple-500",
    },
    {
      id: "help",
      path: "/dashboard/help",
      icon: HelpCircle,
      label: "Help",
      color: "from-purple-400 to-purple-500",
    },
  ];

  // update active item when pathname changes
  useEffect(() => {
    if (!pathname) return;
    // find the first menu or bottom item whose path is a prefix of the pathname
    const found = [...menuItems, ...bottomItems].find((it) =>
      it.path === pathname 
    );
    setActiveItem(found?.id ?? "");
  }, [pathname]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-white via-pink-50 to-pink-100">
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex px-2  bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex-col items-center pt-2 pb-6 ">
          {/* Logo */}
          <div className="w-10 h-10 xl:w-10 xl:h-10  bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center  mb-8 transform hover:scale-105 transition-transform cursor-pointer">
            <span className="text-white font-bold text-xl">1C</span>
          </div>

          <div className="flex flex-col items-center space-y-4 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span
                    className={`group relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-br from-pink-100 to-purple-100 shadow"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    title={item.label}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isActive ? "text-purple-600" : "text-gray-600"
                      }`}
                    />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col items-center space-y-4">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <Link key={item.id} href={item.path}>
                  <span
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-br from-pink-100 to-purple-100 shadow"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    title={item.label}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isActive ? "text-purple-600" : "text-gray-600"
                      }`}
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="h-10 lg:h-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm flex items-center justify-between px-4 py-7">
            {/* Left Section */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>

              {/* Logo */}
              {/* <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md lg:hidden">
                  <span className="text-white font-bold text-lg">1C</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  1ClikPost
                </span>
              </div> */}

              {/* Workspace Selector */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-1  rounded-lg border border-gray-200/50 cursor-pointer hover:shadow-md transition-all group">
                <div className="w-8 h-8 text-purple-600 bg-gradient-to-br from-pink-100 to-purple-100 rounded-md flex items-center justify-center text-sm font-semibold shadow-sm">
                  T
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    Time Zone
                  </div>
                  <div className="text-xs text-gray-500">UTC+06:00</div>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              {/* Upgrade Button */}
              <Link  href={'/dashboard/settings'} className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-br from-pink-100 to-purple-100 text-purple-500 font-semibold rounded-md transition-all duration-200 text-sm">
                <Sparkles className="w-4 h-4" />
                <span className="hidden md:inline">Connect Social Media</span>
              </Link>

              {/* Action Buttons */}
              <button className="hidden sm:block p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                <FileText className="w-5 h-5 text-gray-600" />
              </button>

              <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              {/* Profile */}
              <div onClick={() => logout()} className="w-10 h-10  bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-lg transition-all hover:scale-105">
                M
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children || (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 lg:p-12">
                <div className="max-w-3xl">
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Welcome to 1ClikPost
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Your content will appear here. Start creating amazing posts!
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden bg-white/80 backdrop-blur-xl border-t border-gray-200/50 shadow-lg">
        <div className="flex items-center justify-around px-2 py-3">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <Link key={item.id} href={item.path}>
                <span className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all ${isActive ? "bg-gradient-to-br from-pink-100 to-purple-100" : ""}`}>
                  <Icon className={`w-6 h-6 ${isActive ? "text-purple-600" : "text-gray-500"}`} />
                  <span className={`text-xs font-medium ${isActive ? "text-purple-600" : "text-gray-500"}`}>{item.label}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">1C</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    1ClikPost
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveItem(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-pink-100 to-purple-100"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          isActive ? "text-purple-600" : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          isActive ? "text-purple-600" : "text-gray-700"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 space-y-2">
                {bottomItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveItem(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-all"
                    >
                      <Icon className="w-6 h-6 text-gray-600" />
                      <span className="font-medium text-gray-700">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
