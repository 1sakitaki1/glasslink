export type { Link, LinkId, Profile } from "@/backend";

export interface NavLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}
