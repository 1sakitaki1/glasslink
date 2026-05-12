import { motion } from "motion/react";
import type { ReactNode } from "react";

interface GlassButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  variant?: "link" | "action" | "primary";
  "data-ocid"?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function GlassButton({
  href,
  onClick,
  children,
  icon,
  className = "",
  variant = "link",
  disabled = false,
  type = "button",
  ...rest
}: GlassButtonProps) {
  const base =
    "relative flex items-center gap-3 w-full px-5 py-4 rounded-2xl " +
    "backdrop-blur-md border transition-smooth font-body font-semibold text-base " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 " +
    "disabled:opacity-50 disabled:cursor-not-allowed ";

  const variants = {
    link:
      "bg-white/10 hover:bg-white/15 border-white/15 hover:border-amber-400/40 " +
      "text-amber-50 hover:text-white shadow-glass hover:shadow-glass-hover ",
    action:
      "bg-amber-500/15 hover:bg-amber-500/25 border-amber-400/30 hover:border-amber-400/60 " +
      "text-amber-200 hover:text-amber-100 shadow-glass hover:shadow-glass-hover ",
    primary:
      "bg-amber-500/30 hover:bg-amber-500/45 border-amber-400/50 hover:border-amber-300/80 " +
      "text-amber-100 hover:text-white shadow-glass-hover ",
  };

  const inner = (
    <>
      {icon && (
        <span className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 border border-white/10 text-amber-400">
          {icon}
        </span>
      )}
      <span className="flex-1 text-left">{children}</span>
      <svg
        className="flex-shrink-0 w-4 h-4 opacity-50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base}${variants[variant]}${className}`}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        {...(rest as Record<string, unknown>)}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base}${variants[variant]}${className}`}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      {...(rest as Record<string, unknown>)}
    >
      {inner}
    </motion.button>
  );
}
