// pages/dashboard.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "./Layout";
import PlatformCard from "./PlatformCard";
import GeneratedPostModal from "./GeneratedPostModal";
import { Edit, Sparkles } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { getAuthToken } from "@/lib/cookies";
import { useAuth } from "@/contexts/auth-context";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deletePost, fetchPosts } from "@/store/features/posts/postsSlice";
import { set } from "date-fns";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { posts, isLoading, error } = useAppSelector((state) => state.posts);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

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

  const [step, setStep] = useState(1);
  const [contentType, setContentType] = useState<"trending" | "custom" | null>(
    null
  );
  const [coustomPostTitle, setCoustomPostTitle] = useState("");
  const [coustomPostHashtags, setCoustomPostHashtags] = useState("");
  const [inptTopic, setInputTopic] = useState("");
  const [aiTopicText, setAiTopicText] = useState("");
  const [category, setCategory] = useState("");
  const [contentTone, setContentTone] = useState("");
  const [mediaType, setMediaType] = useState<("image" | "text")[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const handleReset = () => {
    setStep(1);
    setContentType(null);
    setCategory("");
    setContentTone("");
    setAiTopicText("");
    setMediaType([]);
    setInputTopic("");
    setCoustomPostTitle("");
    setCoustomPostHashtags("");
    setImagePreview(null);
    setVideoPreview(null);
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const canProceed = () => {
    if (step === 1) return contentType !== null;
    if (step === 2) {
      const hasTopicOrCategory =
        contentType === "custom" ? inptTopic.trim() !== "" : category !== "";
      const hasMediaType = mediaType.length > 0;
      const hasTone = contentTone !== "";
      const hasAiTopicText = aiTopicText.trim() !== "";
      if (contentType === "custom") {
        return hasTopicOrCategory;
      } else {
        return hasMediaType && hasTone && hasAiTopicText;
      }
    }
    return true;
  };

  const toggleMediaType = (type: "image" | "text") => {
    setMediaType((prev) =>
      prev.includes(type) ? prev.filter((m) => m !== type) : [...prev, type]
    );
  };

  const handleGenerate = async () => {
    try {
      let topicText = "";
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

      if (contentType === "custom") {
        topicText = inptTopic.trim();
        const customoDataPost = [
          {
            title: coustomPostTitle.trim(),
            body: inptTopic.trim(),
            hashtags: coustomPostHashtags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag !== ""),

            imageUrl: imagePreview,
            videoUrl: videoPreview,
            platform: "Facebook",
            caption: null,
            description: null,
          },
          {
            title: coustomPostTitle.trim(),
            body: inptTopic.trim(),
            hashtags: coustomPostHashtags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag !== ""),

            imageUrl: imagePreview,
            videoUrl: videoPreview,
            platform: "Instagram",
            caption: null,
            description: null,
          },
          {
            title: coustomPostTitle.trim(),
            body: inptTopic.trim(),
            hashtags: coustomPostHashtags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag !== ""),

            imageUrl: imagePreview,
            videoUrl: videoPreview,
            platform: "Twitter",
            caption: null,
            description: null,
          },
          {
            title: coustomPostTitle.trim(),
            body: inptTopic.trim(),
            hashtags: coustomPostHashtags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag !== ""),

            imageUrl: imagePreview,
            videoUrl: videoPreview,
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
          dispatch(fetchPosts());
          handleReset();
          setStep(4);

          toast({
            title: "Success",
            description: "Content generated successfully!",
          });
        }

        toast({
          title: "Success",
          description: "Custom Content generated successfully!",
        });
      } else if (contentType === "trending") {
        topicText = `${aiTopicText} in ${category} category. The content should have the following tone: ${contentTone}.`;

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

        let normalizedContent = generatedTextContent.map(
          (item: GeneratedTextContentItem) => {
            const normalizedItem: Required<GeneratedTextContentItem> & {
              [key: string]: any;
            } = { ...requiredKeys, ...item };
            if (!Array.isArray(normalizedItem.hashtags)) {
              normalizedItem.hashtags = [];
            }
            return normalizedItem;
          }
        );

        // generate multiple objects duplicationg the normalizedContent array of one object which is 'Facebook' to other platforms objects like 'Instagram', 'Twitter', 'LinkedIn' etc.
        // Platforms to duplicate for
        const platforms = ["Facebook", "Instagram", "Twitter", "LinkedIn"];

        // Keep a copy of the original content before duplication
        const baseContent = [...normalizedContent];

        // Duplicate the single-object array (Facebook) for all platforms
        normalizedContent = platforms.flatMap((platform) =>
          baseContent.map((item) => ({
            ...item,
            platform,
          }))
        );

        if (includeImage) {
          let generatedImagePrompts: Array<{ prompt: string }> = [];
          generatedImagePrompts = normalizedContent.map((item: any) => ({
            prompt: `Generate an image based on: ${item.imagePrompt}. Generated image will be posted on ${item.platform}.`,
          }));

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

          normalizedContent = normalizedContent.map((obj, index) => ({
            ...obj,
            imageUrl: resImage?.data[index]?.image || null,
          }));
        }

        const resPost = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`,
          { posts: normalizedContent },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log("post created", resPost.data);

        if (resPost.status === 201) {
          dispatch(fetchPosts());
          handleReset();
          setStep(4);

          toast({
            title: "Success",
            description: "Content generated successfully!",
          });
        }
      }
    } catch (error) {
      console.error("Error generating content:", error);
      handleReset();
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

    dispatch(deletePost({ postId: post._id, token }))
      .unwrap()
      .then(() => {
        dispatch(fetchPosts());
      })
      .catch((error) => {
        console.error("Failed to update post:", error);
      });

    toast({
      title: "Success",
      description: "Post deleted successfully!",
    });
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;

      if (type === "image") {
        setImagePreview(base64String); // e.g. data:image/jpeg;base64,...
      } else if (type === "video") {
        setVideoPreview(base64String); // e.g. data:video/mp4;base64,...
      }

      console.log(`Uploaded ${type}:`, base64String);
    };

    reader.readAsDataURL(file); // Converts file → base64
  };

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    if (posts.length > 0) {
      setStep(4);
    }
  }, [posts]);

  return (
    <>
      <section className="mb-8">
        <div className="bg-gradient-to-br from-white/80 via-white/70 to-white/70 w-full h-auto overflow-auto rounded-2xl shadow-sm relative backdrop-blur-sm border border-pink-100/50">
          {/* Header */}
          <div className="border-b border-gray-200 px-8 py-6 rounded-t-3xl">
            <div className="flex items-center space-x-3 mb-6">
              <Edit className="w-7 h-7 text-pink-500" />
              <h3 className="text-2xl font-medium bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Create Post
              </h3>
            </div>

            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3, 4].map((s) => (
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
                  {s < 4 && (
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Let's Create
                  </h3>
                  <p className="text-gray-600">
                    Start from scratch or let AI help you craft your post.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => {
                      setContentType("trending");
                      setCategory("");
                      setContentTone("");
                      setMediaType([]);
                      setInputTopic("");
                    }}
                    className={`group relative overflow-hidden p-8 rounded-2xl border-2 transition-all duration-300 ${
                      contentType === "trending"
                        ? "border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg scale-105"
                        : "border-gray-200 bg-white hover:border-pink-300 hover:shadow-md"
                    }`}
                  >
                    <div className="text-5xl mb-4">🤖</div>
                    <p className="text-gray-600">
                      Generate post content instantly with AI.
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
                      setCategory("");
                      setContentTone("");
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

            {/* Step 2: All Configuration */}
            {step === 2 && (
              <div className="space-y-8 animate-fadeIn">
                {/* Section 1: Category/Topic */}
                <div className="space-y-4">
                  {contentType === "custom" ? (
                    <>
                      <input
                        className="8 w-full px-4 py-3 text-gray-700 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm appearance-none cursor-pointer"
                        type="text"
                        placeholder="Write a catchy title for your post..."
                        value={coustomPostTitle}
                        onChange={(e) => setCoustomPostTitle(e.target.value)}
                      />

                      <textarea
                        rows={5}
                        value={inptTopic}
                        onChange={(e) => setInputTopic(e.target.value)}
                        placeholder="Describe the topic or idea for your post..."
                        className="w-full px-4 py-3 text-gray-700 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm appearance-none cursor-pointer"
                      />

                      <input
                        className=" w-full px-4 py-3 text-gray-700 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm appearance-none cursor-pointer"
                        type="text"
                        placeholder="Type hashtags for your post (comma separated like this #hell, #my)..."
                        value={coustomPostHashtags}
                        onChange={(e) => setCoustomPostHashtags(e.target.value)}
                      />

                      {/* Section 2: Media Type */}
                      <div className="space-y-4 border p-6 rounded-xl bg-white">
                        <div className="text-center">
                          <p className="text-gray-600">
                            Select the type(s) of media for your post
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {/* Upload Image */}
                          <label className="cursor-pointer group relative overflow-hidden p-6 rounded-xl border-2 transition-all duration-300 border-gray-200 border-dashed hover:border-purple-400 hover:shadow-md text-center bg-white">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, "image")}
                            />
                            <div className="text-4xl mb-2">🖼️</div>
                            <p className="text-sm text-gray-700">
                              Upload Image
                            </p>
                          </label>

                          {/* Upload Video */}
                          <label className="cursor-pointer group relative overflow-hidden p-6 rounded-xl border-2 transition-all duration-300 border-gray-200 border-dashed hover:border-pink-400 hover:shadow-md text-center bg-white">
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, "video")}
                            />
                            <div className="text-4xl mb-2">🎬</div>
                            <p className="text-sm text-gray-700">
                              Upload Video
                            </p>
                          </label>
                        </div>

                        {/* Preview Section */}
                        <div className="mt-6 space-y-4">
                          {imagePreview && (
                            <div className="border p-3 rounded-lg max-h-[200px] max-w-[200px]">
                              <h4 className="font-medium text-gray-700 mb-2">
                                🖼️ Image Preview
                              </h4>
                              <img
                                src={imagePreview}
                                alt="Uploaded Preview"
                                className="rounded-lg w-full object-cover"
                              />
                            </div>
                          )}

                          {videoPreview && (
                            <div className="border p-3 rounded-lg max-h-[200px] max-w-[200px]">
                              <h4 className="font-medium text-gray-700 mb-2">
                                🎬 Video Preview
                              </h4>
                              <video
                                src={videoPreview}
                                controls
                                className="rounded-lg w-full"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-full grid grid-cols-12 gap-3">
                        <input
                          className="col-span-8 w-full px-4 py-3 text-gray-700 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm appearance-none cursor-pointer"
                          type="text"
                          placeholder="Type a topic or idea for AI to generate content..."
                          value={aiTopicText}
                          onChange={(e) => setAiTopicText(e.target.value)}
                        />
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="col-span-4 w-full px-4 py-3 text-gray-700 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: "right 0.5rem center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "1.5em 1.5em",
                            paddingRight: "2.5rem",
                          }}
                        >
                          <option value="" disabled>
                            Select a category...
                          </option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.icon} {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Divider */}
                      <div className="border-t border-gray-200"></div>

                      <div className="grid grid-cols-2 gap-4 ">
                        {/* Section 2: Media Type */}
                        <div className="space-y-4 border p-6">
                          <div className="text-center">
                            <p className="text-gray-600">
                              Select the type(s) of media for your post
                            </p>
                          </div>
                          <div className="flex justify-center items-center gap-4">
                            <button
                              onClick={() => toggleMediaType("image")}
                              className={`group relative overflow-hidden p-6 rounded-xl border-2 transition-all duration-300 ${
                                mediaType.includes("image")
                                  ? "border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 shadow-md scale-105"
                                  : "border-gray-200 bg-white hover:border-pink-300 hover:shadow-sm"
                              }`}
                            >
                              <div className="text-4xl mb-2">🖼️</div>
                              <p className="text-sm text-gray-600">
                                Generate image
                              </p>
                              {mediaType.includes("image") && (
                                <div className="absolute top-3 right-3 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
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
                              onClick={() => toggleMediaType("text")}
                              className={`group relative overflow-hidden p-6 rounded-xl border-2 transition-all duration-300 ${
                                mediaType.includes("text")
                                  ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md scale-105"
                                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
                              }`}
                            >
                              <div className="text-4xl mb-2">📝</div>

                              <p className="text-sm text-gray-600">
                                Generate Texts
                              </p>
                              {mediaType.includes("text") && (
                                <div className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
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

                        {/* Section 3: Content Tone */}
                        <div className="space-y-4 border p-6">
                          <div className="text-center">
                            <p className="text-gray-600">
                              Choose a tone for your content
                            </p>
                          </div>
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
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Generate Post */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-center items-center h-[300px]">
                  <div className="relative group">
                    <button className="relative p-8">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Sparkles className="w-10 h-10 text-pink-400 animate-spin animation-delay-200" />
                        <div className="text-center">
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            Generating Post Content
                          </h3>
                          <p className="text-sm font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            Powered by AI
                          </p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-5 group-hover:animate-pulse rounded-2xl"></div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-2 animate-in fade-in">
                <div className="grid md:grid-cols-3 gap-6">
                  {posts.map((post) => {
                    const platform = post.platform?.toLowerCase() || "unknown";

                    const platformStyles: Record<string, string> = {
                      facebook: "border-blue-200 hover:border-blue-400",
                      instagram: "border-pink-200 hover:border-pink-400",
                      linkedin: "border-sky-200 hover:border-sky-400",
                      twitter: "border-cyan-200 hover:border-cyan-400",
                      unknown: "border-gray-200",
                    };

                    const platformAccent: Record<string, string> = {
                      facebook: "text-blue-600",
                      instagram: "text-pink-500",
                      linkedin: "text-sky-600",
                      twitter: "text-cyan-500",
                      unknown: "text-gray-600",
                    };

                    const iconMap: Record<string, string> = {
                      facebook: "F",
                      instagram: "I",
                      linkedin: "L",
                      twitter: "X",
                      unknown: "🌐",
                    };

                    const borderStyle = platformStyles[platform];
                    const accent = platformAccent[platform];
                    const icon = iconMap[platform];

                    return (
                      <div key={post._id} className="max-w-[448px] mx-auto">
                        <div
                          className={` relative bg-white border ${borderStyle} rounded-xl shadow-sm hover:shadow-md transition-all duration-300`}
                        >
                          {/* Header */}
                          <div className="flex items-center gap-3 px-4 py-3 border-b bg-gray-50 rounded-t-xl">
                            <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm">
                              <span className={`text-xl ${accent}`}>
                                {icon}
                              </span>
                            </div>
                            <div className="flex flex-col text-left">
                              <p className="font-semibold capitalize text-gray-800">
                                {post.platform}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(post.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* Body */}
                          <div className="p-4 space-y-3">
                            {post.title && (
                              <h1 className="text-lg font-semibold text-gray-900 text-left whitespace-pre-wrap">
                                {post.title}
                              </h1>
                            )}
                            {post.body && (
                              <p className="text-gray-800 text-sm text-left whitespace-pre-wrap">
                                {post.body && post.body.length > 30
                                  ? post.body.slice(0, 100) + "..."
                                  : post.body}
                              </p>
                            )}

                            {post.hashtags && post.hashtags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {post.hashtags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full"
                                  >
                                    #{tag.replace("#", "")}
                                  </span>
                                ))}
                              </div>
                            )}

                            {post.imageUrl && (
                              <div className="mt-2 overflow-hidden rounded-lg max-h-64">
                                <img
                                  src={post.imageUrl}
                                  alt="Post content"
                                  className="w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                                />
                              </div>
                            )}
                          </div>

                          {/* Footer Actions */}
                          <div className="flex justify-end px-4 py-2 border-t text-sm text-gray-500 bg-gray-50 rounded-b-xl">
                            <div className="flex gap-3">
                              <button className="px-4 py-1.5 text-sm font-medium hover:bg-pink-200 border border-pink-400  rounded-full text-pink-400 hover:scale-105 transition-all">
                                Published
                              </button>

                              <button
                                onClick={() => handleView(post)}
                                className="px-4 py-1.5 text-sm font-medium hover:bg-pink-200 border border-pink-400  rounded-full text-pink-400 hover:scale-105 transition-all"
                              >
                                Edit
                              </button>

                              <button
                                className="px-4 py-1.5 text-sm font-medium hover:bg-pink-200 border border-pink-400  rounded-full text-pink-400 hover:scale-105 transition-all"
                                onClick={() => handleDelete(post)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                    <p className="text-gray-500 font-medium">
                      No posts generated yet
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Create your first post to get started
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {step !== 3 && (
            <div
              className={`sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-gray-200 px-8 py-6 rounded-b-3xl flex  ${
                step === 4 ? "justify-end" : "justify-between items-center"
              }`}
            >
              {step > 1 && step < 4 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  ← Back
                </button>
              )}
              {step === 1 && <div />}

              <div className={`flex gap-3`}>
                {step < 2 ? (
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
                ) : step === 2 ? (
                  <button
                    onClick={() => {
                      handleNext();
                      handleGenerate();
                    }}
                    disabled={!canProceed()}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                      canProceed()
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:scale-105"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Generate
                  </button>
                ) : (
                  step === 4 && (
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:scale-105"
                    >
                      Create New
                    </button>
                  )
                )}
              </div>
            </div>
          )}
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

      {/* <section className="backdrop-blur-xl bg-white/70 shadow-lg rounded-2xl p-8 border border-pink-100/50">
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
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-purple-600 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="flex justify-between items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
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
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-md hover:scale-105 transition-all duration-200 whitespace-nowrap"
                  onClick={() => handleDelete(post)}
                >
                  Delete
                </button>
                <button className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-md hover:scale-105 transition-all duration-200 whitespace-nowrap">
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
      </section> */}

      <GeneratedPostModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        post={selectedPost}
      />
    </>
  );
}
