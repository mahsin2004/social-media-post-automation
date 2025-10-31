// pages/dashboard.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { getAuthToken } from "@/lib/cookies";
import { useAuth } from "@/contexts/auth-context";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPosts } from "@/store/features/posts/postsSlice";
import PlatformCard from "../dashboard/PlatformCard";

export default function Settings() {
  const dispatch = useAppDispatch();
  const { posts, isLoading, error } = useAppSelector((state) => state.posts);
  // console.log("Post list:", posts);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [onlyPlatforms, setOnlyPlatforms] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchPosts());
    const fetchConnectedPlatforms = async () => {
      const token = getAuthToken();
      // console.log('base url--->', process.env.NEXT_PUBLIC_BACKEND_URL)
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/connect/connected-platforms`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setConnectedPlatforms(response.data);
        setOnlyPlatforms(
          response.data.map((acc: { platform: string }) => acc.platform)
        );
      } catch (error) {
        console.error("Error fetching connected platforms:", error);
        toast({
          title: "Error",
          description: "Failed to fetch connected platforms.",
          variant: "destructive",
        });
      }
    };

    fetchConnectedPlatforms();

    // Check for connection status in URL
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const platform = params.get("platform");

    if (status === "success" && platform) {
      toast({
        title: "Success",
        description: `${platform} connected successfully!`,
      });
      // Optionally, refresh connected platforms to show the newly connected one
      fetchConnectedPlatforms();
      // Clear query parameters
      router.replace({
        pathname: router.pathname,
        query: {},
      });
    }
  }, []);

  const handleConnectPlatform = async (platform: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/connect/${platform}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { authUrl } = response.data;
      window.location.href = authUrl;
    } catch (error) {
      console.error(`Error connecting ${platform}:`, error);
      toast({
        title: "Error",
        description: `Failed to connect ${platform}. Please try again.`,
        variant: "destructive",
      });
    }
  };
  const platformStats = [
    { name: "Facebook", icon: "📘", total: 120, info: "Active this week" },
    { name: "Twitter", icon: "🐦", total: 80, info: "Scheduled posts: 5" },
    { name: "Instagram", icon: "📸", total: 60, info: "Image heavy posts" },
    { name: "LinkedIn", icon: "👔", total: 45, info: "Professional reach" },
    // { name: "Youtube", icon: "▶️", total: 30, info: "Video content" },
    // { name: "Pinterest", icon: "📌", total: 25, info: "Visual discovery" },
    // { name: "TikTok", icon: "🎵", total: 50, info: "Short videos" },
    // add as needed
  ];

  





 





 

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {platformStats.map((p) => (
        <PlatformCard
          key={p.name}
          icon={p.icon}
          platformName={p.name}
          totalPosts={p.total}
          importantInfo={p.info}
          isConnected={onlyPlatforms.includes(p.name.toLowerCase())}
          onConnect={handleConnectPlatform}
        />
      ))}
    </section>
  );
}
