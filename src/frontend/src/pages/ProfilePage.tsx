import type { Link } from "@/backend";
import { GlassButton } from "@/components/GlassButton";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useLinks } from "@/hooks/useLinks";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "@tanstack/react-router";
import { ExternalLink, LogIn, LogOut, Pencil } from "lucide-react";
import { motion } from "motion/react";

const ICON_MAP: Record<string, string> = {
  portfolio: "🌐",
  project: "🚀",
  design: "🎨",
  gumroad: "🛒",
  linkedin: "💼",
  instagram: "📸",
  twitter: "🐦",
  youtube: "▶️",
  github: "🐙",
  blog: "📝",
  default: "🔗",
};

function getIcon(icon?: string, displayText?: string): string {
  if (icon) return icon;
  const key = Object.keys(ICON_MAP).find(
    (k) =>
      displayText?.toLowerCase().includes(k) || icon?.toLowerCase().includes(k),
  );
  return ICON_MAP[key ?? "default"];
}

const FALLBACK_LINKS: Link[] = [
  { id: 1n, url: "#", displayText: "My Portfolio", icon: "🌐", orderIndex: 0n },
  {
    id: 2n,
    url: "#",
    displayText: "Latest Project: Nebula UI",
    icon: "🚀",
    orderIndex: 1n,
  },
  {
    id: 3n,
    url: "#",
    displayText: "Design Resources (Gumroad)",
    icon: "🛒",
    orderIndex: 2n,
  },
  {
    id: 4n,
    url: "#",
    displayText: "Connect on LinkedIn",
    icon: "💼",
    orderIndex: 3n,
  },
  {
    id: 5n,
    url: "#",
    displayText: "Follow on Instagram",
    icon: "📸",
    orderIndex: 4n,
  },
  {
    id: 6n,
    url: "#",
    displayText: "Latest Blog Post",
    icon: "📝",
    orderIndex: 5n,
  },
];

const FALLBACK_PROFILE = {
  name: "Alex Rivera",
  bio: "Digital Product Designer | Creator | Building things for the web.",
};

function AvatarDisplay({
  name,
  avatarBlob,
}: { name: string; avatarBlob?: import("@/backend").ExternalBlob }) {
  const avatarUrl = avatarBlob?.getDirectURL();
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative mb-5">
      <div className="w-28 h-28 rounded-full overflow-hidden avatar-glow border-2 border-amber-400/50">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-amber-500/20 backdrop-blur-sm">
            <span className="text-amber-100 font-display font-bold text-3xl select-none">
              {initials}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, login, logout } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: links, isLoading: linksLoading } = useLinks();

  const displayProfile = {
    name: profile?.name || FALLBACK_PROFILE.name,
    bio: profile?.bio || FALLBACK_PROFILE.bio,
    avatarBlob: profile?.avatarBlob,
  };
  const displayLinks = (
    links && links.length > 0 ? links : FALLBACK_LINKS
  ).sort((a, b) => Number(a.orderIndex) - Number(b.orderIndex));

  return (
    <main
      data-ocid="profile.page"
      className="flex-1 flex flex-col items-center justify-start px-4 pt-6 pb-4"
    >
      {/* Auth controls — top right corner */}
      <div className="w-full max-w-md flex justify-end mb-6">
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="profile.edit_button"
              onClick={() => navigate({ to: "/edit" })}
              className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/40 hover:border-amber-300/60 text-amber-200 hover:text-amber-100 text-sm font-semibold transition-smooth shadow-glass"
            >
              <Pencil size={14} />
              Edit Profile
            </button>
            <button
              type="button"
              data-ocid="profile.logout_button"
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-amber-200/60 hover:text-amber-200 text-sm transition-smooth"
              aria-label="Log out"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            data-ocid="profile.login_button"
            onClick={login}
            disabled={authLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-amber-200/60 hover:text-amber-200 text-sm font-medium transition-smooth disabled:opacity-40"
          >
            <LogIn size={14} />
            {authLoading ? "Signing in…" : "Owner Login"}
          </button>
        )}
      </div>

      {/* Profile card */}
      <motion.div
        data-ocid="profile.card"
        className="w-full max-w-md flex flex-col items-center mb-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Avatar */}
        {profileLoading ? (
          <Skeleton className="w-28 h-28 rounded-full bg-white/10" />
        ) : (
          <AvatarDisplay
            name={displayProfile.name}
            avatarBlob={displayProfile.avatarBlob}
          />
        )}

        {/* Name + bio */}
        {profileLoading ? (
          <div className="flex flex-col items-center gap-2 w-full">
            <Skeleton className="h-8 w-48 rounded-lg bg-white/10" />
            <Skeleton className="h-4 w-64 rounded-lg bg-white/10" />
          </div>
        ) : (
          <>
            <h1 className="font-display font-bold text-3xl text-amber-100 mb-2 text-center tracking-tight">
              {displayProfile.name}
            </h1>
            <p className="text-amber-200/60 text-sm text-center max-w-xs leading-relaxed">
              {displayProfile.bio}
            </p>
          </>
        )}
      </motion.div>

      {/* Links list */}
      <div
        data-ocid="profile.list"
        className="w-full max-w-md flex flex-col gap-3"
      >
        {linksLoading
          ? ["sk-1", "sk-2", "sk-3", "sk-4"].map((id, i) => (
              <Skeleton
                key={id}
                className="h-16 w-full rounded-2xl bg-white/10"
                data-ocid={`profile.loading_state.${i + 1}`}
              />
            ))
          : displayLinks.map((link, i) => (
              <motion.div
                key={String(link.id)}
                data-ocid={`profile.item.${i + 1}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 + i * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <GlassButton
                  href={link.url !== "#" ? link.url : undefined}
                  icon={
                    <span className="text-lg" aria-hidden="true">
                      {getIcon(link.icon, link.displayText)}
                    </span>
                  }
                  variant="link"
                >
                  {link.displayText}
                </GlassButton>
              </motion.div>
            ))}

        {!linksLoading && displayLinks.length === 0 && (
          <div
            data-ocid="profile.empty_state"
            className="flex flex-col items-center justify-center py-16 gap-3"
          >
            <span className="text-4xl">🔗</span>
            <p className="text-amber-200/40 text-sm text-center">
              No links yet. Log in to add your first link.
            </p>
            {!isAuthenticated && (
              <button
                type="button"
                onClick={login}
                className="mt-2 px-4 py-2 rounded-xl backdrop-blur-md bg-amber-500/20 border border-amber-400/30 text-amber-200 text-sm font-semibold transition-smooth hover:bg-amber-500/30"
                data-ocid="profile.empty_state.login_button"
              >
                Login to edit
              </button>
            )}
          </div>
        )}
      </div>

      {/* External link indicator */}
      <div className="mt-8 flex items-center gap-1.5 text-amber-200/20 text-xs">
        <ExternalLink size={10} />
        <span>Links open in a new tab</span>
      </div>
    </main>
  );
}
