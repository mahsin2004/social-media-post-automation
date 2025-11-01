// components/GeneratedPostModal.tsx
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
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
    title?: string | null;
    caption?: string | null;
    description?: string | null;
    body?: string | null;
    hashtags?: string[];
    imageUrl?: string | null;
    videoUrl?: string | null;
  } | null;
}

/** Helpers **/
function looksLikeBase64(str?: string | null) {
  if (!str) return false;
  // crude heuristics: no spaces, reasonably long, and not a url
  return (
    !str.startsWith("http") &&
    !str.startsWith("data:") &&
    /^[A-Za-z0-9+/=\r\n]+$/.test(str.replace(/\s+/g, "")) &&
    str.length > 100
  );
}

function inferMimeFromBase64(base64: string, preferImage = true): string {
  const s = base64.trim();
  if (s.startsWith("/9j/")) return "image/jpeg";
  if (s.startsWith("iVBORw0KGgo")) return "image/png";
  if (s.startsWith("R0lGOD")) return "image/gif";
  if (s.startsWith("UklGR")) return "image/webp";
  // mp4/quickbox heuristic: many mp4 base64 contain 'AAAA' + 'ftyp' near start
  if (s.includes("ftyp") || s.startsWith("AAAA")) return "video/mp4";
  // webm signature
  if (s.startsWith("GkXf")) return "video/webm";
  // fallback
  return preferImage ? "image/jpeg" : "video/mp4";
}

function toDataUriFromBase64(base64: string, mime?: string, preferImage = true) {
  const m = mime ?? inferMimeFromBase64(base64, preferImage);
  return `data:${m};base64,${base64}`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result is like "data:xxx;base64,AAAA..."
      // strip prefix to return only base64 payload
      const idx = result.indexOf("base64,");
      if (idx >= 0) {
        resolve(result.slice(idx + 7));
      } else {
        resolve(result);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
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
  const [hashtags, setHashtags] = useState(post?.hashtags?.join(" ") ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(post?.imageUrl ?? null);
  const [videoUrl, setVideoUrl] = useState<string | null>(post?.videoUrl ?? null);
  const [caption, setCaption] = useState(post?.caption ?? "");

  // For local file selection & preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  // Normalize incoming base64 strings -> data: URIs
  useEffect(() => {
    if (!post) return;
    setTitle(post.title ?? "");
    setDescription(post.description ?? "");
    setBody(post.body ?? "");
    setHashtags(post.hashtags?.join(" ") ?? "");
    setCaption(post.caption ?? "");
    setSelectedFile(null);
    setLocalPreviewUrl(null);

    // handle imageUrl normalization
    if (post.imageUrl) {
      if (post.imageUrl.startsWith("data:")) {
        setImageUrl(post.imageUrl);
      } else if (looksLikeBase64(post.imageUrl)) {
        const dataUri = toDataUriFromBase64(post.imageUrl, undefined, true);
        setImageUrl(dataUri);
      } else {
        // assume it's an http(s) url
        setImageUrl(post.imageUrl);
      }
      // clear video if incoming post has image
      setVideoUrl(null);
    } else if (post.videoUrl) {
      if (post.videoUrl.startsWith("data:")) {
        setVideoUrl(post.videoUrl);
      } else if (looksLikeBase64(post.videoUrl)) {
        const dataUri = toDataUriFromBase64(post.videoUrl, undefined, false);
        setVideoUrl(dataUri);
      } else {
        setVideoUrl(post.videoUrl);
      }
      setImageUrl(null);
    } else {
      setImageUrl(null);
      setVideoUrl(null);
    }
  }, [post]);

  // Prevent background scrolling when modal open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Clean up created object URL on unmount / file change
  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  if (!isOpen || !post) return null;

  // Try to upload file to an upload endpoint. If it fails, return null
  async function uploadFile(file: File, token?: string) {
    try {
      const form = new FormData();
      form.append("file", file);

      // Adjust endpoint as needed. Many apps use /api/upload or /upload.
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`);
      }

      // Expecting JSON with { url: "https://..." }
      const data = await res.json();
      return data.url as string | null;
    } catch (err) {
      console.warn("Upload failed (falling back to local base64):", err);
      return null;
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    // Revoke old object URL if any
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setLocalPreviewUrl(objectUrl);

    // Clear remote urls when user selects a new local file
    setImageUrl(null);
    setVideoUrl(null);
  };

  const handleRemoveMedia = () => {
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    setSelectedFile(null);
    setLocalPreviewUrl(null);
    setImageUrl(null);
    setVideoUrl(null);
  };

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

    let finalImageUrl = imageUrl;
    let finalVideoUrl = videoUrl;

    // If user selected a local file, try uploading it first.
    if (selectedFile) {
      const uploadedUrl = await uploadFile(selectedFile, token);
      if (uploadedUrl) {
        // Determine type by file mime
        if (selectedFile.type.startsWith("video/")) {
          finalVideoUrl = uploadedUrl;
          finalImageUrl = null;
        } else {
          finalImageUrl = uploadedUrl;
          finalVideoUrl = null;
        }
      } else {
        // fallback: convert file to base64 data URI and use that
        try {
          const base64Payload = await fileToBase64(selectedFile); // returns base64 payload
          const mime = selectedFile.type || inferMimeFromBase64(base64Payload, !selectedFile.type.startsWith("video/"));
          const dataUri = `data:${mime};base64,${base64Payload}`;
          if (selectedFile.type.startsWith("video/")) {
            finalVideoUrl = dataUri;
            finalImageUrl = null;
          } else {
            finalImageUrl = dataUri;
            finalVideoUrl = null;
          }
        } catch (err) {
          console.error("Could not convert file to base64:", err);
        }
      }
    }

    // If user manually pasted a base64 payload into imageUrl/videoUrl input,
    // ensure we prepend a data: prefix if necessary before saving.
    if (finalImageUrl && !finalImageUrl.startsWith("data:") && looksLikeBase64(finalImageUrl)) {
      finalImageUrl = toDataUriFromBase64(finalImageUrl, undefined, true);
    }
    if (finalVideoUrl && !finalVideoUrl.startsWith("data:") && looksLikeBase64(finalVideoUrl)) {
      finalVideoUrl = toDataUriFromBase64(finalVideoUrl, undefined, false);
    }

    const updatedPostData = {
      _id: post._id,
      title,
      description,
      body,
      hashtags: hashtags
        .split(" ")
        .map((s) => s.trim())
        .filter((tag) => tag.length > 0 && tag.startsWith("#")),
      imageUrl: finalImageUrl,
      videoUrl: finalVideoUrl,
      platform: post.platform,
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
      description: "Post updated successfully!",
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-200px)] px-8 py-6">
          <div className="space-y-6">
            {/* Title */}
            <div className="group">
              <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
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

            {/* Body */}
            <div className="group">
              <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

            {/* Hashtags */}
            <div className="group">
              <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
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

            {/* Media Section */}
            <div className="group">
              <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Media (Image or Video)
              </label>

              {/* Preview area: priority -> selected local file preview -> videoUrl -> imageUrl -> placeholder */}
              <div className="mt-3">
                {localPreviewUrl ? (
                  // If local preview is a video file
                  selectedFile?.type.startsWith("video/") ? (
                    <video
                      src={localPreviewUrl}
                      controls
                      className="w-[350px] border bg-white p-2 max-h-64 rounded-lg object-contain  "
                    />
                  ) : (
                    <img
                      src={localPreviewUrl}
                      alt="local preview"
                      className="w-[350px] border bg-white p-2 max-h-64 rounded-lg object-contain  "
                    />
                  )
                ) : videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    className="w-[350px] border bg-white p-2 max-h-64 rounded-lg object-contain  "
                  />
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="post preview"
                    className="w-[350px] border bg-white p-2 max-h-64 rounded-lg object-contain "
                  />
                ) : (
                  <div className="w-full h-40 rounded-lg border-2 border-dashed border-pink-200 flex items-center justify-center text-gray-500">
                    No media — upload an image or video
                  </div>
                )}
              </div>

              {/* File input + preview / remove */}
              <div className="mt-4 flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-pink-200 rounded-xl hover:bg-pink-50">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <svg
                    className="w-5 h-5 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M16 3l-4 4-4-4" />
                  </svg>
                  Upload file
                </label>

                <button
                  type="button"
                  onClick={handleRemoveMedia}
                  className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Remove media
                </button>

                {/* Also allow manual URL/base64 inputs if user prefers */}
                <input
                  type="text"
                  value={imageUrl ?? ""}
                  onChange={(e) => {
                    setImageUrl(e.target.value || null);
                    if (e.target.value) setVideoUrl(null);
                  }}
                  placeholder="Or paste image URL / base64..."
                  className="ml-auto w-1/3 backdrop-blur-sm bg-white/80 border-2 border-pink-200 rounded-xl px-3 py-2"
                />
                <input
                  type="text"
                  value={videoUrl ?? ""}
                  onChange={(e) => {
                    setVideoUrl(e.target.value || null);
                    if (e.target.value) setImageUrl(null);
                  }}
                  placeholder="Or paste video URL / base64..."
                  className="ml-2 w-1/3 backdrop-blur-sm bg-white/80 border-2 border-pink-200 rounded-xl px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
