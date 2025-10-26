// pages/dashboard.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "./Layout";
import PlatformCard from "./PlatformCard";
import GeneratedPostModal from "./GeneratedPostModal";
import { Sparkles } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { getAuthToken } from "@/lib/cookies";
import { useAuth } from "@/contexts/auth-context";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deletePost, fetchPosts } from "@/store/features/posts/postsSlice";

export default function Dashboard() {
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

  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleView = (post: any) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  const categories = [
    { id: "entertainment", label: "Entertainment", icon: "🎬" },
    { id: "art", label: "Art", icon: "🎨" },
    { id: "sports", label: "Sports", icon: "⚽" },
    { id: "literature", label: "Literature", icon: "📚" },
    { id: "technology", label: "Technology", icon: "💻" },
    { id: "food", label: "Food", icon: "🍔" },
    { id: "travel", label: "Travel", icon: "✈️" },
    { id: "fashion", label: "Fashion", icon: "👗" },
  ];

  const ContentTone = [
    // 🎯 Core Tones
    { id: "casual", label: "Casual", icon: "💬" },
    { id: "professional", label: "Professional", icon: "💼" },
    { id: "marketing", label: "Marketing", icon: "📢" },
    { id: "inspirational", label: "Inspirational", icon: "🌟" },
    { id: "informative", label: "Informative", icon: "📚" },
    { id: "creative", label: "Creative", icon: "🎨" },

    // 💬 Social Media Friendly
    { id: "funny", label: "Funny", icon: "😂" },
    { id: "trendy", label: "Trendy", icon: "🔥" },
    { id: "storytelling", label: "Storytelling", icon: "📖" },
    { id: "conversational", label: "Conversational", icon: "🗣️" },
    { id: "emotional", label: "Emotional", icon: "❤️" },

    // 💼 Business & Brand-Oriented
    { id: "corporate", label: "Corporate", icon: "🏢" },
    { id: "authoritative", label: "Authoritative", icon: "🧠" },
    { id: "persuasive", label: "Persuasive", icon: "🎯" },
    { id: "analytical", label: "Analytical", icon: "📊" },
    { id: "thought_leadership", label: "Thought Leadership", icon: "💡" },

    // 🌈 Creative & Niche Styles
    { id: "minimalist", label: "Minimalist", icon: "⚪" },
    { id: "luxury", label: "Luxury", icon: "💎" },
    { id: "friendly", label: "Friendly", icon: "🤝" },
    { id: "bold", label: "Bold", icon: "🔥" },
    {
      id: "inspirational_storyteller",
      label: "Inspirational Storyteller",
      icon: "📜",
    },
  ];

  const [step, setStep] = useState(1);
  const [contentType, setContentType] = useState<"trending" | "custom" | null>(
    null
  );
  const [inptTopic, setInputTopic] = useState("");
  const [category, setCategory] = useState("");
  // Update the state to allow multiple selections
  const [mediaType, setMediaType] = useState<("image" | "text")[]>([]);

  const handleReset = () => {
    setStep(1);
    setContentType(null);
    setCategory("");
    setMediaType([]);
    setInputTopic("");
  };

  // Update the handleNext function
  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3 && mediaType.length > 0) {
      setStep(4);
    } else {
      setStep(5);
    }
  };

  // Update the canProceed function
  const canProceed = () => {
    if (step === 1) return contentType !== null;
    if (step === 2)
      return (
        category !== "" || (contentType === "custom" && inptTopic.trim() !== "")
      );
    if (step === 3) return mediaType.length > 0;
    return true;
  };

  // Update the media type toggle handler
  const toggleMediaType = (type: "image" | "text") => {
    setMediaType((prev) =>
      prev.includes(type) ? prev.filter((m) => m !== type) : [...prev, type]
    );
  };

  const handleGenerate = async () => {
    try {
      let topicText = "";

      if (contentType === "custom") {
        topicText = inptTopic.trim();
      } else if (contentType === "trending") {
        // Placeholder for trending topic based on category
        topicText = `Trending topic in ${category} category`;
      }

      const includeImage = mediaType.includes("image");

      const token = getAuthToken();
      if (!user || !token) {
        toast({
          title: "Error",
          description: "You must be signed in to generate content.",
          variant: "destructive",
        });
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content/generator`,
        {
          topicText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      type GeneratedTextContentItem = {
        platform?: string | null;
        title?: string | null;
        caption?: string | null;
        description?: string | null;
        body?: string | null;
        hashtags?: string[] | null;
        imagePrompt: string | null;
        imageUrl?: string | null;
        [key: string]: any;
      };

      const generatedTextContent: GeneratedTextContentItem[] = response.data;
      const requiredKeys: Required<GeneratedTextContentItem> = {
        platform: null,
        title: null,
        caption: null,
        description: null,
        body: null,
        hashtags: [],
        imagePrompt: null,
        imageUrl: null,
      };

      // Normalize every object in the array
      let normalizedContent = generatedTextContent.map(
        (item: GeneratedTextContentItem) => {
          const normalizedItem: Required<GeneratedTextContentItem> & {
            [key: string]: any;
          } = { ...requiredKeys, ...item }; // fills missing keys
          // Optional: ensure hashtags is always an array
          if (!Array.isArray(normalizedItem.hashtags)) {
            normalizedItem.hashtags = [];
          }
          return normalizedItem;
        }
      );

      // console.log("Normalized Content:", normalizedContent);

      if (includeImage) {
        // If user selected "image", generate image prompts separately
        let generatedImagePrompts: Array<{
          prompt: string;
        }> = [];
        if (includeImage) {
          generatedImagePrompts = generatedTextContent.map((item: any) => ({
            prompt: `Generate an image based on: ${item.imagePrompt}. Generated image will be posted on ${item.platform}.`, // simple placeholder
          }));
        }

        // console.log(generatedImagePrompts);

        const resImage = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/image/generator`,
          generatedImagePrompts,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("images", resImage.data);

        // ✅ Assign the result to normalizedContent
        normalizedContent = normalizedContent.map((obj, index) => ({
          ...obj,
          imageUrl: resImage?.data[index]?.image || null,
        }));
      }

      // create posts with normalizedContent array objects
      const resPost = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`,
        { posts: normalizedContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("post created", resPost.data);

      if (resPost.status === 201) {
        dispatch(fetchPosts());
        setStep(1);
        setContentType(null);
        setCategory("");
        setMediaType([]);
        setInputTopic("");

        toast({
          title: "Success",
          description: "Content generated successfully!",
        });
      }

      // setGeneratedContent(finalContent);
    } catch (error) {
      console.error("Error generating content:", error);
      setStep(1);
      setContentType(null);
      setCategory("");
      setMediaType([]);
      setInputTopic("");
      toast({
        title: "Error",
        description: "Failed to generate content.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (post: any) => {
    if (!post?._id) {
      console.error("Post ID is missing for update.");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      console.error("Authentication token not found.");
      return;
    }

    const updatedPostData = {
      _id: post._id,
    };

    dispatch(deletePost({ postId: post._id, token }))
      .unwrap()
      .then(() => {
        // onClose();
        dispatch(fetchPosts());
      })
      .catch((error) => {
        console.error("Failed to update post:", error);
      });

    toast({
      title: "Success",
      description: "Post deleted successfuly!",
    });
  };

  // Publish post in facebook page. i have page accesstoken
  const handlePublished = async (
    value: any,
    postValues: any,
    connectedPlatforms: Array<{
      platform: string;
      accountId: string;
      accessToken: string;
    }>
  ) => {
    const platformInfo = connectedPlatforms.find(
      (account) => account.platform === value.toLowerCase()
    );
    if (!platformInfo) {
      console.error("No connected platform info found for Facebook");
      // show toast / error
      return;
    }

    const pageId = platformInfo.accountId;
    const accessToken = platformInfo.accessToken;

    if (!pageId || !accessToken) {
      console.error("Missing pageId or accessToken");
      // show toast / error
      return;
    }

    const message = postValues.title || "";
    const imageUrl = postValues.imageUrl; // optional

    if (value === "Facebook") {
      try {
        let response;

        if (imageUrl) {
          // Post with image
          // Upload a photo to the Page; message included
          response = await axios.post(
            `https://graph.facebook.com/${pageId}/photos`,
            {
              message: message,
              url: imageUrl,
              access_token: accessToken,
            }
          );
        } else {
          // Post with just text
          response = await axios.post(
            `https://graph.facebook.com/${pageId}/feed`,
            {
              message: message,
              access_token: accessToken,
            }
          );
        }

        const data = response.data;
        if (data && (data.id || data.post_id)) {
          toast({
            title: "Success",
            description: "Post published to Facebook successfully!",
          });
          // Optionally: dispatch update to your backend
        } else {
          console.warn("Facebook API returned no post ID", data);
          toast({
            title: "Error",
            description: "Failed to publish post to Facebook (no id returned).",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error publishing to Facebook:", error);
        const errMsg =
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          error.message ||
          "Failed to publish post to Facebook.";
        toast({
          title: "Error",
          description: errMsg,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Layout>
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

      <section className="mb-8 ">
        <div className="bg-gradient-to-br from-white via-pink-50 to-pink-50 w-full h-auto overflow-auto rounded-2xl shadow-sm relative  backdrop-blur-sm  border border-pink-100/50">
          {/* Header */}
          <div className=" border-b border-pink-200 px-8 py-6 rounded-t-3xl ">
            <div className="flex items-center space-x-3 mb-6">
              <Sparkles className="w-8 h-8 text-pink-500" />
              <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Generate Post Content
              </h3>
            </div>

            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      s < step
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                        : s === step
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white ring-4 ring-pink-200"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {s < step ? "✓" : s}
                  </div>
                  {s < 5 && (
                    <div
                      className={`w-12 h-1 mx-1 rounded ${
                        s < step
                          ? "bg-gradient-to-r from-pink-500 to-purple-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Step 1: Choose Type */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    Choose Content Type
                  </h3>
                  <p className="text-gray-600">
                    Select how you want to create your post
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => {
                      setContentType("trending");
                      setStep(1);
                      setCategory("");
                      setMediaType([]);
                      setInputTopic("");
                    }}
                    className={`group relative overflow-hidden p-8 rounded-2xl border-2 transition-all duration-300 ${
                      contentType === "trending"
                        ? "border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg scale-105"
                        : "border-gray-200 bg-white hover:border-pink-300 hover:shadow-md"
                    }`}
                  >
                    <div className="text-5xl mb-4">🔥</div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Trending
                    </h4>
                    <p className="text-gray-600">
                      Generate content based on trending topics and categories
                    </p>
                    {contentType === "trending" && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setContentType("custom");
                      setStep(1);
                      setCategory("");
                      setMediaType([]);
                      setInputTopic("");
                    }}
                    className={`group relative overflow-hidden p-8 rounded-2xl border-2 transition-all duration-300 ${
                      contentType === "custom"
                        ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105"
                        : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                    }`}
                  >
                    <div className="text-5xl mb-4">✨</div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Custom
                    </h4>
                    <p className="text-gray-600">
                      Create your own unique content from scratch
                    </p>
                    {contentType === "custom" && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Category Selection (only for Custom) */}
            {step === 2 && contentType === "custom" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    Describe Your Content
                  </h3>
                  <p className="text-gray-600">
                    Tell us what you'd like to create content about
                  </p>
                </div>
                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Write your idea or post content here
                    <span className=" text-gray-500 font-normal ml-1">
                      -- Be as specific as possible for better content
                      generation
                    </span>
                  </label>
                  <textarea
                    rows={6}
                    value={inptTopic}
                    onChange={(e) => setInputTopic(e.target.value)}
                    placeholder="e.g. Latest AI trends in 2025, sustainable fashion tips, upcoming tech gadgets, healthy recipes for beginners..."
                    className="w-full dark:text-gray-700 border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none bg-white/70 backdrop-blur-sm"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Category Selection (only for trending) */}
            {step === 2 && contentType === "trending" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    Select Category
                  </h3>
                  <p className="text-gray-600">
                    Choose a category for trending content
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        category === cat.id
                          ? "border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg scale-105"
                          : "border-gray-200 bg-white hover:border-pink-300 hover:shadow-md"
                      }`}
                    >
                      <div className="text-4xl mb-2">{cat.icon}</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {cat.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Media Type Selection */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    Choose Media Type
                  </h3>
                  <p className="text-gray-600">
                    Select the type(s) of media for your post
                  </p>
                </div>
                <div className="flex justify-center items-center gap-6">
                  <button
                    onClick={() => toggleMediaType("image")}
                    className={`group relative overflow-hidden p-8 rounded-2xl border-2 transition-all duration-300 ${
                      mediaType.includes("image")
                        ? "border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg scale-105"
                        : "border-gray-200 bg-white hover:border-pink-300 hover:shadow-md"
                    }`}
                  >
                    <div className="text-5xl mb-4">🖼️</div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Generate Image
                    </h4>
                    <p className="text-gray-600">
                      Create stunning AI-generated images
                    </p>
                    {mediaType.includes("image") && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>

                  {/*<button
                    onClick={() => toggleMediaType("video")}
                    className={`group relative overflow-hidden p-8 rounded-2xl border-2 transition-all duration-300 ${
                      mediaType.includes("video")
                        ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105"
                        : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                    }`}
                  >
                    <div className="text-5xl mb-4">🎥</div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Generate Video
                    </h4>
                    <p className="text-gray-600">
                      Create engaging AI-generated videos
                    </p>
                    {mediaType.includes("video") && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>*/}

                  <button
                    onClick={() => toggleMediaType("text")}
                    className={`group relative overflow-hidden p-8 rounded-2xl border-2 transition-all duration-300 ${
                      mediaType.includes("text")
                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-105"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <div className="text-5xl mb-4">📝</div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Generate Text
                    </h4>
                    <p className="text-gray-600">
                      Create engaging AI-generated text content
                    </p>
                    {mediaType.includes("text") && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Category Selection (only for trending) */}
            {step === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    Select Content Tone
                  </h3>
                  <p className="text-gray-600">
                    Choose a content tone
                  </p>
                </div>
                <div className="grid grid-cols-8 md:grid-cols-9 gap-4">
                  {ContentTone.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                        category === cat.id
                          ? "border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg scale-105"
                          : "border-gray-200 bg-white hover:border-pink-300 hover:shadow-md"
                      }`}
                    >
                      <div className="text-4xl mb-2">{cat.icon}</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {cat.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Generate Post */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-center items-center h-[300px]">
                  {/* Animated border wrapper */}
                  <div className="relative group">
                    {/* Main button */}
                    <button className="relative p-8 ">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Sparkles className=" w-10 h-10 text-pink-400 animate-spin animation-delay-200" />

                        <div className="text-center">
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            Generate Post Content
                          </h3>
                          <p className="text-sm font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            Powered by AI
                          </p>
                        </div>
                      </div>

                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-5 group-hover:animate-pulse rounded-2xl"></div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-pink-200 px-8 py-6 rounded-b-3xl flex justify-between items-center">
            {step > 1 && step <= 4 && (
              <button
                onClick={() => {
                  if (step === 3 && contentType === "custom") {
                    setStep(1);
                  } else {
                    setStep(step - 1);
                  }
                }}
                className="px-6 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                ← Back
              </button>
            )}
            {step === 1 && <div />}

            <div className="flex gap-3">
              {step < 4 ? (
                // Step 1-2: Continue button
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                    canProceed()
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:scale-105"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Continue →
                </button>
              ) : step === 4 ? (
                // Step 3: Generate button
                <button
                  onClick={() => {
                    handleNext();
                    handleGenerate();
                  }}
                  disabled={!canProceed()}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                    canProceed()
                      ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg hover:scale-105"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Generate
                </button>
              ) : (
                // Step 4+: Cancel button
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
      </section>

      <section className="backdrop-blur-xl bg-white/70 shadow-lg rounded-2xl p-8 border border-pink-100/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Generated Posts
          </h3>
          <div className="px-4 py-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-full text-sm font-semibold text-purple-700">
            {posts.length} Posts
          </div>
        </div>

        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post._id}
              className="group relative backdrop-blur-sm bg-white/80 border border-pink-100 rounded-xl p-5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:border-pink-300"
            >
              {/* Gradient accent bar */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-purple-600 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="flex justify-between items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Platform badge */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border border-pink-200">
                      {post?.platform}
                    </span>
                  </div>

                  <div className="font-semibold text-gray-800 text-lg mb-1 truncate group-hover:text-pink-600 transition-colors">
                    {post.title || post.caption || post.body}
                  </div>

                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{new Date(post.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-md hover:scale-105 transition-all duration-200 whitespace-nowrap"
                  onClick={() => handleView(post)}
                >
                  View
                </button>
                <button
                  className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-md hover:scale-105 transition-all duration-200 whitespace-nowrap"
                  onClick={() => handleDelete(post)}
                >
                  Delete
                </button>
                <button
                  className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-md hover:scale-105 transition-all duration-200 whitespace-nowrap"
                  onClick={() =>
                    handlePublished(post.platform, post, connectedPlatforms)
                  }
                >
                  Published
                </button>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No posts generated yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Create your first post to get started
            </p>
          </div>
        )}
      </section>

      <GeneratedPostModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        post={selectedPost}
      />
    </Layout>
  );
}
