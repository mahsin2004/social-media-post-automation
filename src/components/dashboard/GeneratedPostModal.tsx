// components/GeneratedPostModal.tsx
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAuthToken } from "../../lib/cookies";
import { updatePost } from "../../store/features/posts/postsSlice";
import { toast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

interface GeneratedPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    _id: string;
    platform: string;
    title: string | null | undefined;
    caption: string | null | undefined;
    description: string | null | undefined;
    body: string | null | undefined;
    hashtags: string[];
    imageUrl: string | null;
  } | null;
}

export default function GeneratedPostModal({
  isOpen,
  onClose,
  post,
}: GeneratedPostModalProps) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(post?.title ?? "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [hashtags, setHashtags] = useState(post?.hashtags.join(" ") ?? "");
  const [imageUrl, setImageUrl] = useState(post?.imageUrl ?? "");
  const [caption, setCaption] = useState(post?.caption ?? "");

  useEffect(() => {
    if (post) {
      setTitle(post.title ?? "");
      setDescription(post.description ?? "");
      setBody(post.body ?? "");
      setHashtags(post.hashtags.join(" ") ?? "");
      setImageUrl(post.imageUrl ?? "");
    }
  }, [post]);

  // ✅ Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !post) return null;

  const handleUpdate = async () => {
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
      title,
      description,
      body,
      hashtags: hashtags.split(" ").filter((tag) => tag.startsWith("#")),
      imageUrl,
      platform: post.platform, // Keep the original platform
    };

    dispatch(updatePost({ postId: post._id, postData: updatedPostData, token }))
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error("Failed to update post:", error);
      });

    toast({
      title: "Success",
      description: "Post update successfuly!",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-white via-pink-50 to-pink-100 w-screen h-screen overflow-hidden shadow-2xl relative animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-pink-200/50 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Edit Post</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border border-pink-200">
                    {post.platform}
                  </span>
                </div>
              </div>
              <div className="group flex items-center justify-center gap-2 ml-8 border border-pink-300 cursor-pointer rounded-full px-4 py-1 hover:bg-pink-300 hover:text-white">
                <h2 className="text-xl text-pink-400 font-bold group-hover:text-white">
                  HUMANIZE AI
                </h2>
                <Sparkles className="w-6 h-6 text-pink-400 animate-spin animation-delay-200 group-hover:text-white" />
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 flex items-center justify-center hover:rotate-90"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-200px)] px-8 py-6">
          {/* Title Field */}
          <div className="space-y-6">
            <div className="group">
              <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full backdrop-blur-sm bg-white/80 border-2 border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 hover:border-pink-300"
                placeholder="Enter post title..."
              />
            </div>

            {/* Description Field */}
            <div className="group">
              <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full backdrop-blur-sm bg-white/80 border-2 border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 hover:border-pink-300 resize-none"
                rows={3}
                placeholder="Add a description..."
              />
            </div>

            {/* Body Field */}
            <div className="group">
              <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-pink-500"
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
                Body
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full backdrop-blur-sm bg-white/80 border-2 border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 hover:border-pink-300 resize-none"
                rows={10}
                placeholder="Write your post content..."
              />
            </div>

            {/* Hashtags Field */}
            <div className="group">
              <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                  />
                </svg>
                Hashtags
              </label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full backdrop-blur-sm bg-white/80 border-2 border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 hover:border-pink-300"
                placeholder="#example #hashtags"
              />
            </div>

            {/* Image Section */}
            <div className="group">
              <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full backdrop-blur-sm bg-white/80 border-2 border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 hover:border-pink-300"
                placeholder="https://example.com/image.jpg"
              />
              {post.imageUrl && (
                <div className="mt-4 backdrop-blur-sm bg-white/60 rounded-xl p-4 border-2 border-pink-100">
                  <img
                    src={imageUrl}
                    alt="post preview"
                    className="max-h-64 mx-auto object-contain rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 backdrop-blur-xl bg-white/80 border-t border-pink-200/50 px-8 py-4">
          <div className="flex justify-end gap-3">
            <button
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
