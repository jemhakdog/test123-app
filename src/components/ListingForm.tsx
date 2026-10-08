"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState, useRef } from "react";
import Link from "next/link";
import { createListingAction, updateListingAction, deleteListingAction } from "@/lib/actions";
import { FormError, SubmitButton } from "./forms";
import type { Category, ListingImage } from "@/lib/types";

interface Props {
  categories: Category[];
  isAdmin: boolean;
  initial?: {
    id: number;
    title: string;
    description: string;
    category_id: number;
    price: number | null;
    tags: string[];
    images?: ListingImage[];
  };
}

export default function ListingForm({ categories, isAdmin, initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial;
  const action = isEdit ? updateListingAction.bind(null, initial!.id) : createListingAction;
  const [state, formAction] = useActionState(action, null);
  const [deleting, setDeleting] = useState(false);

  // Screenshots state
  const [images, setImages] = useState<{ image_url: string; caption?: string }[]>(
    initial?.images?.map((img) => ({ image_url: img.image_url, caption: img.caption || "" })) || []
  );
  const [urlInput, setUrlInput] = useState("");
  const [captionInput, setCaptionInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleDelete() {
    if (!initial || !confirm("Delete this listing permanently?")) return;
    setDeleting(true);
    const res = await deleteListingAction(initial.id);
    if (res.ok) router.push("/dashboard");
    else {
      setDeleting(false);
      alert(res.error);
    }
  }

  function handleAddUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setImages((prev) => [...prev, { image_url: trimmed, caption: captionInput.trim() }]);
    setUrlInput("");
    setCaptionInput("");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setImages((prev) => [
            ...prev,
            { image_url: result, caption: file.name.replace(/\.[^/.]+$/, "") },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function handleRemoveImage(index: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  }

  function handleUpdateCaption(index: number, newCaption: string) {
    setImages((prev) =>
      prev.map((img, idx) => (idx === index ? { ...img, caption: newCaption } : img))
    );
  }

  function handleMoveImage(index: number, direction: "up" | "down") {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  }

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
    >
      <FormError state={state} />
      {state?.ok && (
        <div
          className="flex items-center justify-between rounded-xl border border-[#34D399]/30 bg-[#34D399]/12 p-4 text-[13px] font-semibold text-[#059669]"
          role="status"
        >
          <span>✓ {state.message}</span>
          <Link href="/dashboard" className="text-xs underline hover:text-[#047857]">
            Go to dashboard →
          </Link>
        </div>
      )}

      {/* Hidden JSON for structured image list */}
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <div>
        <label htmlFor="title" className="mb-1.5 block text-[13px] font-medium text-[#111827]">
          Project Title
        </label>
        <input
          id="title"
          name="title"
          required
          minLength={3}
          maxLength={120}
          defaultValue={initial?.title}
          placeholder="e.g. AI-Powered Smart Inventory Management System"
          className="w-full min-h-[48px] rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] transition duration-200 hover:border-[#D1D5DB] focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12"
        />
        {state?.ok === false && state.fieldErrors?.title && (
          <p className="mt-1.5 text-xs font-medium text-[#EF4444]">⚠ {state.fieldErrors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-[13px] font-medium text-[#111827]">
          Project Description & Scope
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={20}
          maxLength={5000}
          rows={5}
          defaultValue={initial?.description}
          placeholder="Explain what the project does, tech stack used, included resources (source code, database schema, documentation, setup guide)..."
          className="w-full min-h-[130px] rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] transition duration-200 hover:border-[#D1D5DB] focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12"
        />
        {state?.ok === false && state.fieldErrors?.description && (
          <p className="mt-1.5 text-xs font-medium text-[#EF4444]">⚠ {state.fieldErrors.description}</p>
        )}
      </div>

      {/* Dedicated System Screenshots Section */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-bold text-[#111827] font-headline flex items-center gap-2">
              <span>🖼️</span> System Screenshots & Previews
            </h3>
            <p className="text-xs text-[#6B7280]">
              Upload sample images and UI screenshots of your running system.
            </p>
          </div>
          <span className="rounded-full bg-[#EFF6FF] px-3 py-0.5 text-xs font-semibold text-[#3B82F6] border border-[#BFDBFE]/50">
            {images.length} {images.length === 1 ? "screenshot" : "screenshots"}
          </span>
        </div>

        {/* Upload Buttons & Drag-and-drop trigger */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* File Upload Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D1D5DB] bg-white p-5 text-center cursor-pointer transition hover:border-[#3B82F6] hover:bg-[#EFF6FF]/20"
          >
            <svg className="h-8 w-8 text-[#3B82F6] mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-[13px] font-bold text-[#111827]">Upload Image Files</p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">Click or drag PNG, JPG, WebP screenshots</p>
            <input
              ref={fileInputRef}
              type="file"
              name="image_files"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Paste URL Box */}
          <div className="flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-4 space-y-2">
            <p className="text-[13px] font-bold text-[#111827]">Or Add Screenshot by URL</p>
            <div className="space-y-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/screenshot.png"
                className="w-full min-h-[40px] rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1.5 text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#3B82F6] focus:bg-white focus:outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value)}
                  placeholder="Caption (e.g. Dashboard view)"
                  className="flex-1 min-h-[40px] rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1.5 text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#3B82F6] focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  disabled={!urlInput.trim()}
                  className="min-h-[40px] rounded-lg bg-[#3B82F6] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2563EB] disabled:opacity-40 transition shrink-0"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Screenshot Previews List */}
        {images.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Uploaded Screenshots ({images.length})
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white p-2.5 shadow-xs"
                >
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.image_url}
                      alt={img.caption || `Screenshot ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={img.caption || ""}
                      onChange={(e) => handleUpdateCaption(idx, e.target.value)}
                      placeholder="Add caption..."
                      className="w-full rounded-md border border-[#E5E7EB] px-2 py-1 text-xs text-[#111827] focus:border-[#3B82F6] focus:outline-none"
                    />
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveImage(idx, "up")}
                        title="Move left"
                        className="rounded p-1 text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-20"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        disabled={idx === images.length - 1}
                        onClick={() => handleMoveImage(idx, "down")}
                        title="Move right"
                        className="rounded p-1 text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-20"
                      >
                        →
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="ml-auto text-xs font-semibold text-[#EF4444] hover:text-[#DC2626]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category_id" className="mb-1.5 block text-[13px] font-medium text-[#111827]">
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            required
            defaultValue={initial?.category_id ?? ""}
            className="w-full min-h-[48px] rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-[15px] text-[#111827] transition duration-200 hover:border-[#D1D5DB] focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12"
          >
            <option value="" disabled>
              Choose a category…
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="price" className="mb-1.5 block text-[13px] font-medium text-[#111827]">
            Price (USD, Optional)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step="0.01"
            defaultValue={initial?.price ?? ""}
            placeholder="Leave blank for 'Price on request'"
            className="w-full min-h-[48px] rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] transition duration-200 hover:border-[#D1D5DB] focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12"
          />
          {state?.ok === false && state.fieldErrors?.price && (
            <p className="mt-1.5 text-xs font-medium text-[#EF4444]">⚠ {state.fieldErrors.price}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="mb-1.5 block text-[13px] font-medium text-[#111827]">
          Tags (Comma-separated, max 8)
        </label>
        <input
          id="tags"
          name="tags"
          defaultValue={initial?.tags.join(", ")}
          placeholder="e.g. react, nodejs, python, ai, sqlite"
          className="w-full min-h-[48px] rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] transition duration-200 hover:border-[#D1D5DB] focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12"
        />
        {state?.ok === false && state.fieldErrors?.tags && (
          <p className="mt-1.5 text-xs font-medium text-[#EF4444]">⚠ {state.fieldErrors.tags}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#F3F4F6] pt-5">
        <div className="flex items-center gap-3">
          <div className="w-48">
            <SubmitButton label={isEdit ? "Save Changes" : "Submit Listing"} />
          </div>
          {isAdmin && (
            <span className="text-xs font-semibold text-purple-600">★ Auto-approved for Admin.</span>
          )}
          {isEdit && !isAdmin && <span className="text-xs text-[#6B7280]">Edits require re-approval.</span>}
        </div>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="min-h-[44px] rounded-xl border border-[#EF4444]/30 bg-[#FEF2F2] px-5 py-2.5 text-xs font-semibold text-[#EF4444] hover:bg-[#FEE2E2] disabled:opacity-40 transition duration-200"
          >
            {deleting ? "Deleting…" : "Delete Project"}
          </button>
        )}
      </div>
    </form>
  );
}


