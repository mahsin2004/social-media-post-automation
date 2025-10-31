import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Image,
  Calendar,
  Send,
  Save,
  X,
  Link2,
  Smile,
  Bold,
  Italic,
  Underline,
  Sparkles,
} from "lucide-react";

const PLATFORM_LIMITS: Record<string, number> = {
  x: 280,
  linkedin: 1300,
  facebook: 63206,
};

type Attachment = {
  id: string;
  file: File;
  url: string;
};

interface SocialPostPayload {
  platformKeys: string[];
  htmlContent: string;
  textContent: string;
  attachments: Attachment[];
  scheduledAt?: string | null;
}

interface SocialPostEditorProps {
  initialText?: string;
  initialPlatforms?: string[];
  onSubmit?: (payload: SocialPostPayload) => void;
  className?: string;
}

const EMOJIS = [
  "😀",
  "😊",
  "🔥",
  "🎯",
  "💡",
  "✨",
  "🙌",
  "👍",
  "😅",
  "❤️",
  "🚀",
  "💪",
  "🌟",
  "💖",
  "🎉",
  "👀",
];

const PLATFORM_COLORS = {
  twitter: "from-black to-gray-800",
  linkedin: "from-blue-600 to-blue-700",
  facebook: "from-blue-500 to-blue-600",
};

const PLATFORM_ICONS = {
  twitter: "𝕏",
  linkedin: "in",
  facebook: "f",
};

export default function TextEditor({
  initialText = "",
  initialPlatforms = ["x"],
  onSubmit = () => {},
  className = "",
}: SocialPostEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [usePlain, setUsePlain] = useState(false);
  const [textValue, setTextValue] = useState(initialText);
  const [platformKeys, setPlatformKeys] = useState<string[]>(initialPlatforms);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [scheduled, setScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!usePlain && editorRef.current) {
      editorRef.current.innerHTML = initialText;
    }
  }, [initialText, usePlain]);

  const getPlainText = () => {
    if (usePlain) return textValue;
    return editorRef.current ? editorRef.current.innerText : textValue;
  };

  const getHtml = () => {
    if (usePlain) return textValue.replace(/\n/g, "<br/>");
    return editorRef.current ? editorRef.current.innerHTML : textValue;
  };

  const activeLimit = () => {
    if (platformKeys.length === 0)
      return Math.max(...Object.values(PLATFORM_LIMITS));
    return Math.min(...platformKeys.map((k) => PLATFORM_LIMITS[k] ?? 10000));
  };

  const charCount = getPlainText().length;
  const limit = activeLimit();
  const percentage = (charCount / limit) * 100;

  const execFormat = (command: string, value?: string) => {
    if (usePlain) return;
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value ?? "");
  };

  const handlePlatformToggle = (key: string) => {
    setPlatformKeys((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleFile = (files?: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 4);
    const newAttachments: Attachment[] = arr.map((f) => ({
      id: `${Date.now()}-${f.name}`,
      file: f,
      url: URL.createObjectURL(f),
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const keep = prev.filter((p) => p.id !== id);
      prev.forEach((p) => p.id === id && URL.revokeObjectURL(p.url));
      return keep;
    });
  };

  const insertEmoji = (emoji: string) => {
    if (usePlain) {
      setTextValue((v) => v + emoji);
      return;
    }
    if (!editorRef.current) return;
    editorRef.current.focus();
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) {
      editorRef.current.innerHTML += emoji;
      return;
    }
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(emoji));
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const clearAll = () => {
    setTextValue("");
    if (editorRef.current) editorRef.current.innerHTML = "";
    setAttachments((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
    setScheduled(false);
    setScheduledAt(null);
  };

  const handleSubmit = (action: "post" | "draft") => {
    const text = getPlainText();
    if (!text.trim() && attachments.length === 0) {
      alert("Please write something or add an attachment.");
      return;
    }
    if (charCount > limit) {
      if (
        !confirm(
          `Your content exceeds the character limit (${limit}). Post anyway?`
        )
      )
        return;
    }

    const payload: SocialPostPayload = {
      platformKeys,
      htmlContent: getHtml(),
      textContent: text,
      attachments,
      scheduledAt: scheduled ? scheduledAt : null,
    };

    onSubmit(payload);
    if (action === "post") {
      clearAll();
    } else {
      alert("Saved to drafts!");
    }
  };

  return (
    <div className={`relative ${className} mb-4`}>
      {/* Main Card with Glassmorphism */}

      <div className=" space-y-6">
        {/* Platform Selector */}
        <div className="space-y-3">
          <div className="flex gap-3">
            {["twitter", "linkedin", "facebook"].map((key) => (
              <button
                key={key}
                onClick={() => handlePlatformToggle(key)}
                type="button"
                className={`group relative flex-1 px-4 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  platformKeys.includes(key)
                    ? `bg-gradient-to-r ${
                        PLATFORM_COLORS[key as keyof typeof PLATFORM_COLORS]
                      } text-white shadow-lg`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg font-bold">
                    {PLATFORM_ICONS[key as keyof typeof PLATFORM_ICONS]}
                  </span>
                  <span className="text-sm">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </div>
                {platformKeys.includes(key) && (
                  <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-200/50">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => execFormat("bold")}
              className="p-2 rounded-xl hover:bg-white transition-all duration-200 text-gray-700 hover:text-pink-600"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => execFormat("italic")}
              className="p-2 rounded-xl hover:bg-white transition-all duration-200 text-gray-700 hover:text-pink-600"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => execFormat("underline")}
              className="p-2 rounded-xl hover:bg-white transition-all duration-200 text-gray-700 hover:text-pink-600"
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const url = prompt("Enter URL");
                if (url) execFormat("createLink", url);
              }}
              className="p-2 rounded-xl hover:bg-white transition-all duration-200 text-gray-700 hover:text-pink-600"
              title="Insert link"
            >
              <Link2 className="w-4 h-4" />
            </button>

            <div className="relative ml-2">
              <button
                type="button"
                onClick={() => setShowEmoji((s) => !s)}
                className="p-2 rounded-xl hover:bg-white transition-all duration-200 text-gray-700 hover:text-pink-600"
                title="Emoji"
              >
                <Smile className="w-4 h-4" />
              </button>
              {showEmoji && (
                <div className="absolute top-12 left-0 bg-white rounded-2xl shadow-2xl p-4 grid grid-cols-8 gap-8 z-50 border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      onClick={() => {
                        insertEmoji(e);
                        setShowEmoji(false);
                      }}
                      className="p-2 text-xl rounded-xl transition-all duration-200 hover:scale-125"
                      type="button"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-800 transition-colors">
            <input
              type="checkbox"
              checked={usePlain}
              onChange={(e) => setUsePlain(e.target.checked)}
              className="w-4 h-4 rounded accent-pink-500"
            />
            <span className="font-medium">Plain text</span>
          </label>
        </div>

        {/* Editor */}
        <div className="relative">
          {!usePlain ? (
            <>
              <div
                ref={editorRef}
                contentEditable
                role="textbox"
                aria-multiline
                suppressContentEditableWarning
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onInput={(e) =>
                  setTextValue((e.target as HTMLDivElement).innerText)
                }
                className={`min-h-[180px] p-5 rounded-2xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                  isFocused
                    ? "border-pink-400 shadow-lg shadow-pink-200/50 ring-4 ring-pink-100"
                    : "border-gray-200 hover:border-pink-300"
                }`}
                style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    handleSubmit("post");
                  }
                }}
              />
              {getPlainText().trim().length === 0 && (
                <div className="absolute top-5 left-5 pointer-events-none text-gray-400">
                  What's on your mind?
                </div>
              )}
            </>
          ) : (
            <textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`min-h-[180px] p-5 rounded-2xl border-2 w-full transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none ${
                isFocused
                  ? "border-pink-400 shadow-lg shadow-pink-200/50 ring-4 ring-pink-100"
                  : "border-gray-200 hover:border-pink-300"
              }`}
              placeholder="What's on your mind?"
            />
          )}

          {/* Character Counter */}
          <div className="absolute bottom-4 right-4">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 20 * (1 - percentage / 100)
                  }`}
                  className={`transition-all duration-300 ${
                    percentage > 100
                      ? "text-red-500"
                      : percentage > 80
                      ? "text-yellow-500"
                      : "text-pink-500"
                  }`}
                />
              </svg>
              <span
                className={`absolute text-xs font-bold ${
                  percentage > 100 ? "text-red-600" : "text-gray-700"
                }`}
              >
                {charCount}
              </span>
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div className="space-y-3">
          <label className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-dashed border-pink-300 cursor-pointer hover:from-pink-100 hover:to-purple-100 transition-all duration-300 hover:border-pink-400 group">
            <Image className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-700">Add media</span>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => handleFile(e.target.files)}
              className="hidden"
            />
          </label>

          {attachments.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {attachments.map((a) => (
                <div
                  key={a.id}
                  className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-pink-400 transition-all duration-300"
                >
                  <img
                    src={a.url}
                    alt={a.file.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <button
                    onClick={() => removeAttachment(a.id)}
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Schedule */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200/50">
          <label className="flex items-center justify-center gap-3 cursor-pointer group">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={scheduled}
                onChange={(e) => setScheduled(e.target.checked)}
                className="w-5 h-5 rounded accent-pink-500 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-[22px] h-[22px] text-purple-600" />
              <span className="font-medium text-gray-700">Schedule post</span>
            </div>
          </label>

          {scheduled && (
            <input
              type="datetime-local"
              className="flex-1 border-2 border-purple-300 rounded-xl px-4 py-2 text-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all bg-white"
              value={scheduledAt ?? ""}
              onChange={(e) => setScheduledAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => handleSubmit("post")}
            className="flex-1 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold py-4 px-6 rounded-2xl hover:from-pink-500 hover:to-purple-600 transition-all duration-300  hover:shadow-pink-300/50 transform  flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Post Now
          </button>

          <button
            onClick={() => handleSubmit("draft")}
            className="px-6 py-4 rounded-2xl bg-white border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Draft
          </button>

          <button
            onClick={clearAll}
            className="px-6 py-4 rounded-2xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300 flex items-center justify-center"
            title="Clear all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hint */}
        {/* <div className="text-center text-sm text-gray-500">
            <kbd className="px-2 py-1 bg-white rounded-lg border border-gray-300 text-xs font-mono shadow-sm">Ctrl</kbd>
            {" + "}
            <kbd className="px-2 py-1 bg-white rounded-lg border border-gray-300 text-xs font-mono shadow-sm">Enter</kbd>
            {" to post quickly"}
          </div> */}
      </div>
    </div>
  );
}
