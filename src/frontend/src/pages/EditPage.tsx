import { ExternalBlob } from "@/backend";
import { useAuth } from "@/hooks/useAuth";
import {
  useAddLink,
  useDeleteLink,
  useLinks,
  useUpdateLink,
} from "@/hooks/useLinks";
import { useProfile, useSetProfile } from "@/hooks/useProfile";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  GripVertical,
  Link2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface LinkDraft {
  id?: bigint;
  url: string;
  displayText: string;
  icon: string;
  orderIndex: number;
  isNew?: boolean;
  /** stable sort key for dnd-kit */
  draftKey: string;
}

const INPUT_CLASS =
  "w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-amber-50 placeholder-white/40 backdrop-blur-sm focus:outline-none focus:border-amber-400/60 focus:bg-white/15 transition-all text-sm";

const GLASS_CARD =
  "bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm";

// ─── Sortable Link Row ────────────────────────────────────────────────────────

interface SortableLinkRowProps {
  draft: LinkDraft;
  idx: number;
  isSaving: boolean;
  onUpdate: (key: string, field: keyof LinkDraft, value: string) => void;
  onSave: (draft: LinkDraft) => Promise<void>;
  onDelete: (draft: LinkDraft, idx: number) => Promise<void>;
}

function SortableLinkRow({
  draft,
  idx,
  isSaving,
  onUpdate,
  onSave,
  onDelete,
}: SortableLinkRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: draft.draftKey });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      data-ocid={`edit.link_item.${idx + 1}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22 }}
      className={`rounded-xl border ${
        isDragging
          ? "border-amber-400/50 bg-white/15 shadow-lg shadow-amber-900/20"
          : "border-white/10 bg-white/5"
      } p-4 mb-3 last:mb-0`}
    >
      {/* Row header */}
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          aria-label="Drag to reorder"
          className="cursor-grab active:cursor-grabbing text-amber-200/30 hover:text-amber-200/60 transition-all flex-shrink-0 touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>

        <span className="text-xs text-amber-200/35 font-mono flex-1 truncate">
          {draft.isNew ? "new link" : draft.displayText || `link ${idx + 1}`}
        </span>

        <button
          type="button"
          data-ocid={`edit.delete_button.${idx + 1}`}
          onClick={() => onDelete(draft, idx)}
          aria-label="Delete link"
          className="text-red-400/50 hover:text-red-400 p-1 rounded-lg hover:bg-red-400/10 transition-all flex-shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-2">
        <input
          data-ocid={`edit.link_text_input.${idx + 1}`}
          type="text"
          value={draft.displayText}
          onChange={(e) =>
            onUpdate(draft.draftKey, "displayText", e.target.value)
          }
          placeholder="Display text (e.g. My Portfolio)"
          className={INPUT_CLASS}
        />
        <input
          data-ocid={`edit.link_url_input.${idx + 1}`}
          type="url"
          value={draft.url}
          onChange={(e) => onUpdate(draft.draftKey, "url", e.target.value)}
          placeholder="https://…"
          className={INPUT_CLASS}
        />
        <div className="flex items-center gap-2">
          <input
            data-ocid={`edit.link_icon_input.${idx + 1}`}
            type="text"
            value={draft.icon}
            onChange={(e) => onUpdate(draft.draftKey, "icon", e.target.value)}
            placeholder="Icon emoji (e.g. 🔗)"
            className={`${INPUT_CLASS} flex-1`}
          />
          <button
            type="button"
            data-ocid={`edit.save_link_button.${idx + 1}`}
            onClick={() => onSave(draft)}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/25 hover:bg-amber-500/40 border border-amber-400/35 hover:border-amber-300/55 text-amber-200 text-xs font-semibold transition-all disabled:opacity-50 whitespace-nowrap"
          >
            <Save size={12} />
            Save
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EditPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: links, isLoading: linksLoading } = useLinks();

  const setProfile = useSetProfile();
  const addLink = useAddLink();
  const updateLink = useUpdateLink();
  const deleteLink = useDeleteLink();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarBlob, setAvatarBlob] = useState<ExternalBlob | undefined>(
    undefined,
  );
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string>("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [drafts, setDrafts] = useState<LinkDraft[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setBio(profile.bio);
      setAvatarBlob(profile.avatarBlob);
      setAvatarPreviewUrl(profile.avatarBlob?.getDirectURL() ?? "");
    }
  }, [profile]);

  useEffect(() => {
    if (links) {
      setDrafts(
        [...links]
          .sort((a, b) => Number(a.orderIndex) - Number(b.orderIndex))
          .map((l) => ({
            id: l.id,
            url: l.url,
            displayText: l.displayText,
            icon: l.icon ?? "",
            orderIndex: Number(l.orderIndex),
            draftKey: String(l.id),
          })),
      );
    }
  }, [links]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // ── Unauthenticated gate ──────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <main
        className="flex-1 flex flex-col items-center justify-center gap-6 px-4"
        data-ocid="edit.page"
      >
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mx-auto mb-4">
            <Link2 size={24} className="text-amber-300" />
          </div>
          <h2 className="font-display text-2xl font-bold text-amber-100 mb-2">
            Owner Access Required
          </h2>
          <p className="text-amber-200/50 text-sm mb-6">
            Sign in with Internet Identity to edit your profile.
          </p>
          <button
            type="button"
            onClick={login}
            data-ocid="edit.login_button"
            className="px-6 py-3 rounded-xl backdrop-blur-md bg-amber-500/25 hover:bg-amber-500/40 border border-amber-400/40 hover:border-amber-300/60 text-amber-100 font-semibold text-sm transition-all"
          >
            Sign In with Internet Identity
          </button>
        </div>
      </main>
    );
  }

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    setUploadProgress(0);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(Math.round(pct * 100));
      });
      setAvatarBlob(blob);
      setAvatarPreviewUrl(URL.createObjectURL(file));
    } catch {
      toast.error("Failed to prepare image");
    } finally {
      setAvatarUploading(false);
      setUploadProgress(0);
    }
  }

  async function handleSaveProfile() {
    try {
      await setProfile.mutateAsync({ name, bio, avatarBlob });
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
    }
  }

  async function handleSaveLink(draft: LinkDraft) {
    try {
      if (draft.isNew) {
        await addLink.mutateAsync({
          url: draft.url,
          displayText: draft.displayText,
          icon: draft.icon || undefined,
          orderIndex: BigInt(draft.orderIndex),
        });
        toast.success("Link added!");
      } else if (draft.id !== undefined) {
        await updateLink.mutateAsync({
          id: draft.id,
          url: draft.url,
          displayText: draft.displayText,
          icon: draft.icon || undefined,
          orderIndex: BigInt(draft.orderIndex),
        });
        toast.success("Link saved!");
      }
    } catch {
      toast.error("Failed to save link");
    }
  }

  async function handleDeleteLink(draft: LinkDraft, idx: number) {
    if (draft.isNew) {
      setDrafts((prev) => prev.filter((_, i) => i !== idx));
      return;
    }
    if (draft.id === undefined) return;
    try {
      await deleteLink.mutateAsync(draft.id);
      toast.success("Link removed");
    } catch {
      toast.error("Failed to delete link");
    }
  }

  function addNewLink() {
    const key = `new-${Date.now()}`;
    setDrafts((prev) => [
      ...prev,
      {
        url: "",
        displayText: "",
        icon: "",
        orderIndex: prev.length,
        isNew: true,
        draftKey: key,
      },
    ]);
  }

  function updateDraft(key: string, field: keyof LinkDraft, value: string) {
    setDrafts((prev) =>
      prev.map((d) => (d.draftKey === key ? { ...d, [field]: value } : d)),
    );
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = drafts.findIndex((d) => d.draftKey === active.id);
    const newIndex = drafts.findIndex((d) => d.draftKey === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(drafts, oldIndex, newIndex).map((d, i) => ({
      ...d,
      orderIndex: i,
    }));
    setDrafts(reordered);

    // Persist new order for existing links
    const updates = reordered.filter((d) => !d.isNew && d.id !== undefined);
    await Promise.allSettled(
      updates.map((d) =>
        updateLink.mutateAsync({
          id: d.id!,
          url: d.url,
          displayText: d.displayText,
          icon: d.icon || undefined,
          orderIndex: BigInt(d.orderIndex),
        }),
      ),
    );
  }

  const isSavingLink = addLink.isPending || updateLink.isPending;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main
      data-ocid="edit.page"
      className="flex-1 flex flex-col items-center px-4 pt-4 pb-12"
    >
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          type="button"
          data-ocid="edit.back_button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-2 mb-6 text-amber-200/50 hover:text-amber-200 text-sm transition-all"
        >
          <ArrowLeft size={16} />
          Back to profile
        </button>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6"
        >
          <h1 className="font-display text-2xl font-bold text-amber-100">
            Edit Profile
          </h1>

          {/* ── Profile Section ── */}
          <section data-ocid="edit.profile_section" className={GLASS_CARD}>
            <h2 className="font-display font-semibold text-amber-200 mb-5 text-xs uppercase tracking-widest">
              Profile Info
            </h2>

            {profileLoading ? (
              <div className="flex flex-col gap-4">
                <div className="w-24 h-24 rounded-full bg-white/10 animate-pulse mx-auto" />
                <div className="h-10 rounded-xl bg-white/10 animate-pulse" />
                <div className="h-20 rounded-xl bg-white/10 animate-pulse" />
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {/* Circular avatar upload */}
                <div className="flex flex-col items-center gap-3">
                  <button
                    type="button"
                    data-ocid="edit.avatar_input"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Change profile photo"
                    className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 hover:border-amber-400/60 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  >
                    {avatarPreviewUrl ? (
                      <img
                        src={avatarPreviewUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10 flex items-center justify-center">
                        <Camera size={24} className="text-amber-200/40" />
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <Camera size={20} className="text-white" />
                    </div>
                    {/* Upload progress overlay */}
                    {avatarUploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {uploadProgress}%
                        </span>
                      </div>
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />

                  {/* Progress bar */}
                  <AnimatePresence>
                    {avatarUploading && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-1 bg-white/10 rounded-full overflow-hidden"
                      >
                        <motion.div
                          className="h-full bg-amber-400 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="text-amber-200/40 text-xs">
                    Click to change photo
                  </p>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="edit-name"
                    className="text-amber-200/70 text-xs font-medium"
                  >
                    Display Name
                  </label>
                  <input
                    id="edit-name"
                    data-ocid="edit.name_input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className={INPUT_CLASS}
                  />
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="edit-bio"
                    className="text-amber-200/70 text-xs font-medium"
                  >
                    Bio
                  </label>
                  <textarea
                    id="edit-bio"
                    data-ocid="edit.bio_input"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short bio or tagline…"
                    rows={3}
                    className={`${INPUT_CLASS} resize-none`}
                  />
                </div>

                {/* Save profile */}
                <button
                  type="button"
                  data-ocid="edit.save_profile_button"
                  onClick={handleSaveProfile}
                  disabled={setProfile.isPending || avatarUploading}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl backdrop-blur-md bg-amber-500/25 hover:bg-amber-500/40 border border-amber-400/40 hover:border-amber-300/60 text-amber-100 font-semibold text-sm transition-all disabled:opacity-50"
                >
                  <Save size={14} />
                  {setProfile.isPending ? "Saving…" : "Save Profile"}
                </button>
              </div>
            )}
          </section>

          {/* ── Links Section ── */}
          <section data-ocid="edit.links_section" className={GLASS_CARD}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-amber-200 text-xs uppercase tracking-widest">
                Links
              </h2>
              <button
                type="button"
                data-ocid="edit.add_link_button"
                onClick={addNewLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/30 hover:border-amber-300/50 text-amber-200 text-xs font-semibold transition-all"
              >
                <Plus size={12} />
                Add Link
              </button>
            </div>

            {linksLoading ? (
              <div className="flex flex-col gap-3">
                {["sk-1", "sk-2", "sk-3"].map((id) => (
                  <div
                    key={id}
                    className="h-28 rounded-xl bg-white/10 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <>
                {drafts.length === 0 && (
                  <div
                    className="text-center py-8"
                    data-ocid="edit.links_empty_state"
                  >
                    <Link2
                      size={28}
                      className="text-amber-200/20 mx-auto mb-3"
                    />
                    <p className="text-amber-200/35 text-sm">No links yet.</p>
                    <p className="text-amber-200/25 text-xs mt-1">
                      Click "Add Link" to get started.
                    </p>
                  </div>
                )}

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={drafts.map((d) => d.draftKey)}
                    strategy={verticalListSortingStrategy}
                  >
                    <AnimatePresence initial={false}>
                      {drafts.map((draft, idx) => (
                        <SortableLinkRow
                          key={draft.draftKey}
                          draft={draft}
                          idx={idx}
                          isSaving={isSavingLink}
                          onUpdate={updateDraft}
                          onSave={handleSaveLink}
                          onDelete={handleDeleteLink}
                        />
                      ))}
                    </AnimatePresence>
                  </SortableContext>
                </DndContext>
              </>
            )}
          </section>
        </motion.div>
      </div>
    </main>
  );
}
