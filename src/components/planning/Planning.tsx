"use client";
import React, { useState } from "react";
import {
  Sparkles,
  Image,
  Type,
  Wand2,
  Copy,
  Download,
  RefreshCw,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/store/hooks";
import { getAuthToken } from "@/lib/cookies";
import { useAuth } from "@/contexts/auth-context";
import axios from "axios";
import { fetchPosts } from "@/store/features/posts/postsSlice";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

export default function Planning() {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("twitter");
  const [tone, setTone] = useState("professional");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [contentTone, setContentTone] = useState<string>("");
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const router = useRouter();

  const platforms = [
    { id: "twitter", name: "Twitter/X", limit: 280 },
    { id: "instagram", name: "Instagram", limit: 2200 },
    { id: "linkedin", name: "LinkedIn", limit: 3000 },
    { id: "facebook", name: "Facebook", limit: 5000 },
  ];

  const ContentTone = [
    { id: "casual", label: "Casual", icon: "💬" },
    { id: "professional", label: "Professional", icon: "💼" },
    { id: "marketing", label: "Marketing", icon: "📢" },
    { id: "inspirational", label: "Inspirational", icon: "🌟" },
    { id: "informative", label: "Informative", icon: "📚" },
    { id: "creative", label: "Creative", icon: "🎨" },
    { id: "funny", label: "Funny", icon: "😂" },
    { id: "trendy", label: "Trendy", icon: "🔥" },
    { id: "storytelling", label: "Storytelling", icon: "📖" },
    { id: "conversational", label: "Conversational", icon: "🗣️" },
    { id: "emotional", label: "Emotional", icon: "❤️" },
    { id: "corporate", label: "Corporate", icon: "🏢" },
    { id: "authoritative", label: "Authoritative", icon: "🧠" },
    { id: "persuasive", label: "Persuasive", icon: "🎯" },
    { id: "analytical", label: "Analytical", icon: "📊" },
    { id: "thought_leadership", label: "Thought Leadership", icon: "💡" },
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAISuggestions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const suggestions = [
        `🚀 ${tone} tip: Share your journey and inspire others to take action today!`,
        `💡 Did you know? Engaging content gets 3x more shares. Let's make an impact!`,
        `✨ Transform your ideas into reality. Your audience is waiting to hear from you.`,
      ];
      setSuggestions(suggestions);
      setIsGenerating(false);
    }, 1000);
  };

  const enhanceWithAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const enhanced =
        content +
        "\n\n✨ Enhanced with AI: Add relevant hashtags and emojis to boost engagement!";
      setContent(enhanced);
      setIsGenerating(false);
    }, 800);
  };

  const currentPlatform = platforms.find((p) => p.id === platform);
  const charCount = content.length;
  const percentage = (charCount / (currentPlatform?.limit ?? 280)) * 100;

  const handleGenerate = async () => {
    try {
      let topicText = "";
      ;
      const token = getAuthToken();
      if (!user || !token || !content) {
        toast({
          title: "Error",
          description: "You must be signed in to generate content.",
          variant: "destructive",
        });
        return;
      }


      topicText = '';
      const customoDataPost = [
        {
          title: '',
          body: content,
          hashtags: '',
          imageUrl: '',
          videoUrl: '',
          platform: "Facebook",
          caption: null,
          description: null,
        },
        {
          title: '',
          body: content,
          imageUrl: imagePreview,
          videoUrl: '',
          platform: "Instagram",
          caption: null,
          description: null,
        },
        {
          title: '',
          body: content,
          imageUrl: imagePreview,
          videoUrl: '',
          platform: "Twitter",
          caption: null,
          description: null,
        },
        {
          title: '',
          body: content,
          imageUrl: imagePreview,
          videoUrl: '',
          platform: "LinkedIn",
          caption: null,
          description: null,
        },
      ];

      const resPost = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`,
        { posts: customoDataPost },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("post created", resPost.data);

      if (resPost.status === 201) {
        dispatch(fetchPosts({ forceRefetch: true }));
        router.push('/dashboard');
        toast({
          title: "Success",
          description: "Content generated successfully!",
        });
      }




    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate content.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-pink-100 p-4">
      <div className="">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className="w-8 h-8 text-pink-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              AI Content Studio
            </h1>
          </div>
          <p className="text-gray-600">
            Create engaging social media posts with AI-powered assistance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Platform Selector */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-100">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Platform
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${platform === p.id
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-100">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Your Content
                </label>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={`font-medium ${percentage > 90 ? "text-red-500" : "text-gray-600"
                      }`}
                  >
                    {charCount} / {currentPlatform?.limit ?? 280}
                  </span>
                </div>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start typing your post here... or use AI to generate ideas!"
                className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
              />

              {/* Progress Bar */}
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${percentage > 90
                    ? "bg-red-500"
                    : percentage > 70
                      ? "bg-yellow-500"
                      : "bg-gradient-to-r from-pink-500 to-rose-500"
                    }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleGenerate()}

                  className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:shadow-lg`}
                >
                  Generate
                </button>
                <button
                  onClick={enhanceWithAI}
                  disabled={!content || isGenerating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wand2 className="w-4 h-4" />
                  {isGenerating ? "Enhancing..." : "Enhance with AI"}
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(content)}
                  disabled={!content}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-100">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-4">
                <Image className="w-4 h-4" />
                Media Attachment
              </label>

              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50/50 transition-all">
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium mb-1">
                      Click to upload an image
                    </p>
                    <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* AI Sidebar */}
          <div className="space-y-6">
            {/* Tone Selector */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-100">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tone
              </label>
              <div className="w-full max-w-md mx-auto">
                <select
                  value={contentTone}
                  onChange={(e) => setContentTone(e.target.value)}
                  className="w-full px-4 py-3 text-gray-700 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="" disabled>
                    Select a tone...
                  </option>
                  {ContentTone.map((tone) => (
                    <option key={tone.id} value={tone.id}>
                      {tone.icon} {tone.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  AI Suggestions
                </h3>
                <button
                  onClick={generateAISuggestions}
                  disabled={isGenerating}
                  className="p-2 hover:bg-pink-50 rounded-lg transition-all"
                >
                  <RefreshCw
                    className={`w-4 h-4 text-gray-600 ${isGenerating ? "animate-spin" : ""
                      }`}
                  />
                </button>
              </div>

              {suggestions.length === 0 ? (
                <button
                  onClick={generateAISuggestions}
                  className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-pink-400 hover:bg-pink-50/50 transition-all"
                >
                  Generate Ideas
                </button>
              ) : (
                <div className="space-y-3">
                  {suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      onClick={() => setContent(suggestion)}
                      className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl cursor-pointer hover:shadow-md transition-all border border-pink-100"
                    >
                      <p className="text-sm text-gray-700">{suggestion}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-100">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Content Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Words</span>
                  <span className="font-semibold text-gray-800">
                    {content.split(/\s+/).filter(Boolean).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Characters</span>
                  <span className="font-semibold text-gray-800">
                    {charCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Hashtags</span>
                  <span className="font-semibold text-gray-800">
                    {(content.match(/#/g) || []).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Mentions</span>
                  <span className="font-semibold text-gray-800">
                    {(content.match(/@/g) || []).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
