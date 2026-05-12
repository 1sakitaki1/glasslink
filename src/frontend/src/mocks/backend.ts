import type { backendInterface } from "../backend";

export const mockBackend = {
  getProfile: async () => ({
    name: "Alex Rivera",
    bio: "Digital Product Designer | Creator | Building things for the web.",
    avatarBlob: [] as unknown as Uint8Array,
  }),
  listLinks: async () => [
    { id: BigInt(1), url: "https://github.com", displayText: "My Portfolio", icon: "💻", orderIndex: BigInt(0) },
    { id: BigInt(2), url: "https://github.com/nebula-ui", displayText: "Latest Project: Nebula UI", icon: "💼", orderIndex: BigInt(1) },
    { id: BigInt(3), url: "https://gumroad.com", displayText: "Design Resources (Gumroad)", icon: "🛒", orderIndex: BigInt(2) },
    { id: BigInt(4), url: "https://linkedin.com", displayText: "Connect on LinkedIn", icon: "💼", orderIndex: BigInt(3) },
    { id: BigInt(5), url: "https://instagram.com", displayText: "Follow on Instagram", icon: "📸", orderIndex: BigInt(4) },
    { id: BigInt(6), url: "https://blog.example.com", displayText: "Latest Blog Post", icon: "📖", orderIndex: BigInt(5) },
  ],
  addLink: async () => BigInt(7),
  deleteLink: async () => undefined,
  setProfile: async () => undefined,
  updateLink: async () => undefined,
} as unknown as backendInterface;
