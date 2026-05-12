import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type LinkId = bigint;
export interface Profile {
    bio: string;
    avatarBlob?: ExternalBlob;
    name: string;
}
export interface Link {
    id: LinkId;
    url: string;
    displayText: string;
    icon?: string;
    orderIndex: bigint;
}
export interface backendInterface {
    addLink(url: string, displayText: string, icon: string | null, orderIndex: bigint): Promise<LinkId>;
    deleteLink(id: LinkId): Promise<void>;
    getProfile(): Promise<Profile>;
    listLinks(): Promise<Array<Link>>;
    setProfile(name: string, bio: string, avatarBlob: ExternalBlob | null): Promise<void>;
    updateLink(id: LinkId, url: string, displayText: string, icon: string | null, orderIndex: bigint): Promise<void>;
}
