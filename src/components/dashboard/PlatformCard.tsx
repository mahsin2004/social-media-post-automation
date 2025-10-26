import React from "react";

import { Button } from "@/components/ui/button";

interface PlatformCardProps {
  icon: React.ReactNode;
  platformName: string;
  totalPosts: number;
  importantInfo: string;
  isConnected: boolean;
  onConnect: (platform: string) => void;
}

export default function PlatformCard({
  icon,
  platformName,
  totalPosts,
  importantInfo,
  isConnected,
  onConnect,
}: PlatformCardProps) {
  return (
    <div className="group relative bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 shadow-sm hover:shadow-xl rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] border border-pink-200/40 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[length:200%_100%] group-hover:animate-[shimmer_2s_ease-in-out_infinite]"></div>

      {/* Outer glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 rounded-3xl opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-700"></div>

      <div className="relative z-10 flex items-center gap-6 w-full">
        {/* Modern icon container */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-purple-400 rounded-2xl blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-3xl shadow-sm group-hover:shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:-rotate-6">
            {icon}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-500">
              {platformName}
            </h3>
            {isConnected && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-white">Live</span>
              </div>
            )}
          </div>

          <Button
            onClick={() => onConnect(platformName.toLowerCase())}
            className={`w-full font-semibold transition-all duration-300 ${
              isConnected
                ? "bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 hover:from-pink-200 hover:to-purple-200 border-2 border-pink-300/50"
                : "bg-gradient-to-r from-pink-300 to-purple-400 hover:from-pink-400 hover:to-purple-500 text-white shadow-sm hover:shadow-xl"
            }`}
            disabled={isConnected}
          >
            {isConnected ? "✓ Connected" : "Connect Now"}
          </Button>
        </div>

        {/* Animated corner decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-300/20 via-purple-300/20 to-transparent rounded-bl-full opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-300/20 via-pink-300/20 to-transparent rounded-tr-full opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></div>
      </div>
    </div>
  );
}
