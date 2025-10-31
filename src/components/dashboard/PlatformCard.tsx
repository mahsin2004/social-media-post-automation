import React, { memo } from "react";
import { Button } from "@/components/ui/button";

/** Simple classNames helper — replace with `clsx` or `classnames` if available */
const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

type IconKey = "facebook" | "twitter" | "instagram" | "linkedin";

/** Minimal SVG map — add or replace with your preferred icons */
const ICONS: Record<IconKey, React.ReactNode> = {
  facebook: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-8 h-8"
    >
      <path d="M22 12c0-5.522-4.478-10-10-10S2 6.478 2 12c0 5 3.657 9.128 8.438 9.878v-6.987H8.078v-2.89h2.36V9.845c0-2.33 1.393-3.616 3.523-3.616 1.02 0 2.086.183 2.086.183v2.296h-1.176c-1.158 0-1.52.719-1.52 1.457v1.748h2.586l-.414 2.89h-2.172v6.987C18.343 21.128 22 17 22 12z" />
    </svg>
  ),
  twitter: (
   <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    className="w-6 h-6"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.648l-5.202-6.817-5.955 6.817H1.714l7.73-8.848L1.25 2.25h6.79l4.713 6.231 5.491-6.231zm-1.161 17.52h1.833L7.084 4.615H5.117l11.966 15.155z" />
  </svg>
  ),
  instagram: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-8 h-8"
    >
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.75-.88a1.13 1.13 0 1 1-2.26 0 1.13 1.13 0 0 1 2.26 0z" />
    </svg>
  ),
  linkedin: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-7 h-7"
    >
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1 4.98 2.12 4.98 3.5zM.24 8.5h4.48v15H.24v-15zM8.52 8.5h4.29v2.04h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.01 5.42 6.92v8.38h-4.48v-7.43c0-1.77-.03-4.06-2.48-4.06-2.48 0-2.86 1.93-2.86 3.93v7.56H8.52v-15z" />
    </svg>
  ),
};

interface PlatformCardProps {
  /** Accept either a ReactNode icon or a string key referring to the ICONS map */
  icon?: string | IconKey;
  platformName: string;
  /** Stable identifier for callbacks — if not provided we'll fallback to platformName */
  platformKey?: string;
  totalPosts?: number;
  importantInfo?: string;
  isConnected?: boolean;
  onConnect?: (platformKey: string) => void;
}

function PlatformCardInner({
  icon,
  platformName,
  platformKey,
  totalPosts = 0,
  importantInfo = "",
  isConnected = false,
  onConnect = () => {},
}: PlatformCardProps) {
  const id = platformKey ?? platformName;

  const resolvedIcon =
    typeof icon === "string" && (ICONS as Record<string, React.ReactNode>)[icon]
      ? (ICONS as Record<string, React.ReactNode>)[icon]
      : icon ?? ICONS["facebook"];

  return (
    <div
      role="group"
      aria-label={`${platformName} card`}
      className="group relative bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 shadow-sm hover:shadow-xl rounded-xl p-3 transition-all duration-500 hover:scale-[1.02] border border-pink-200/40 overflow-hidden"
      title={platformName}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-pink-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[length:200%_100%] group-hover:animate-[shimmer_2s_ease-in-out_infinite]"
        aria-hidden
      />
      <div
        className="absolute -inset-0.5 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300  opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-700"
        aria-hidden
      />

      <div className="relative z-10 flex items-center gap-6 w-full">
        <div className="relative flex-shrink-0">
          <div
            className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-300 rounded-2xl blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500"
            aria-hidden
          />
          <div className="relative w-[50px] h-[50px] rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-3xl shadow-sm group-hover:shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:-rotate-6">
            {resolvedIcon}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:to-purple-400 transition-all duration-500">
              {platformName}
            </h3>
            {isConnected && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                aria-hidden
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-white">Live</span>
              </div>
            )}
          </div>

          {/* {importantInfo && (
            <p className="text-sm text-muted-foreground mb-3 truncate">
              {importantInfo}
            </p>
          )} */}

          <Button
            type="button"
            onClick={() => onConnect(id)}
            className={cx(
              "w-full font-semibold transition-all duration-300 rounded-xl",
              isConnected
                ? "bg-gradient-to-r from-pink-100 to-purple-100 text-pink-500 hover:from-pink-200 hover:to-purple-200 border-2 border-pink-300/50"
                : "bg-gradient-to-r from-pink-300 to-purple-400 hover:from-pink-300 hover:to-purple-400 text-white shadow-sm hover:shadow-xl"
            )}
            disabled={isConnected}
            aria-pressed={isConnected}
            aria-label={
              isConnected
                ? `${platformName} connected`
                : `Connect ${platformName}`
            }
            title={
              isConnected
                ? `${platformName} connected`
                : `Connect ${platformName}`
            }
          >
            {isConnected ? "✓ Connected" : "Connect Now"}
          </Button>
        </div>

        <div
          className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-300/20 via-purple-300/20 to-transparent rounded-bl-full opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-300/20 via-pink-300/20 to-transparent rounded-tr-full opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
          aria-hidden
        />
      </div>
    </div>
  );
}

const PlatformCard = memo(PlatformCardInner);
export default PlatformCard;
