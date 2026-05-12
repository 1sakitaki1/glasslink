import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-deep-dark">
      {/* Warm ambient glow layers */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[70vw] h-[60vh] rounded-full bg-amber-glow opacity-40 blur-[100px]" />
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vh] rounded-full bg-orange-glow opacity-20 blur-[80px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[35vw] h-[35vh] rounded-full bg-amber-glow opacity-15 blur-[90px]" />
      </div>

      {/* Noise texture overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 noise-overlay" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}

        {/* Footer */}
        <footer className="py-6 text-center">
          <p className="text-xs text-amber-200/30">
            &copy; {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-amber-300/60 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
