"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { TiptapEditor } from "./tiptap-editor";
import { slugify } from "@/lib/utils";

interface PostFormProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    status: "draft" | "published";
    featured: boolean;
    metaTitle: string | null;
    metaDescription: string | null;
  };
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [contentHtml, setContentHtml] = useState("");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [status, setStatus] = useState<"draft" | "published">(
    post?.status || "draft"
  );
  const [featured, setFeatured] = useState(post?.featured || false);
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    post?.metaDescription || ""
  );
  const [showSeo, setShowSeo] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!post);

  useEffect(() => {
    if (autoSlug) {
      setSlug(slugify(title));
    }
  }, [title, autoSlug]);

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      setCoverImage(data.url);
      toast("Cover image uploaded", "success");
    } else {
      toast("Upload failed", "error");
    }
  }

  async function handleSave(saveStatus?: "draft" | "published") {
    const finalStatus = saveStatus || status;
    setSaving(true);

    const body = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      contentHtml,
      coverImage: coverImage || null,
      status: finalStatus,
      featured,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      publishedAt:
        finalStatus === "published" ? new Date().toISOString() : null,
    };

    const url = post ? `/api/posts/${post.id}` : "/api/posts";
    const method = post ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      toast(
        finalStatus === "published" ? "Post published" : "Post saved",
        "success"
      );
      if (!post) {
        router.push(`/admin/posts/${data.id}/edit`);
      }
      router.refresh();
    } else {
      const err = await res.json();
      toast(err.error || "Failed to save", "error");
    }

    setSaving(false);
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title..."
        className="w-full bg-transparent font-serif text-3xl font-medium text-void-heading placeholder:text-void-muted/40 focus:outline-none"
      />

      {/* Slug */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-void-muted">/posts/</span>
        <input
          type="text"
          value={slug}
          onChange={(e) => {
            setAutoSlug(false);
            setSlug(e.target.value);
          }}
          className="flex-1 bg-transparent text-xs text-void-subtle focus:outline-none"
        />
      </div>

      {/* Excerpt */}
      <textarea
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="Brief excerpt..."
        rows={2}
        className="w-full resize-none rounded-md border border-void-border bg-void-surface px-3 py-2 text-sm text-void-text placeholder:text-void-muted focus:border-void-border-hover focus:outline-none"
      />

      {/* Cover image */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-void-subtle">
          Cover Image
        </label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverUpload}
            />
            <span className="inline-flex h-8 items-center rounded-md border border-void-border px-3 text-xs text-void-muted transition-colors hover:border-void-border-hover hover:text-void-text">
              {coverImage ? "Change" : "Upload"}
            </span>
          </label>
          {coverImage && (
            <>
              <span className="text-xs text-void-muted truncate max-w-xs">
                {coverImage}
              </span>
              <button
                type="button"
                onClick={() => setCoverImage("")}
                className="text-xs text-void-danger hover:underline"
              >
                Remove
              </button>
            </>
          )}
        </div>
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover preview"
            className="mt-2 h-32 w-auto rounded-md object-cover"
          />
        )}
      </div>

      {/* Editor */}
      <TiptapEditor
        content={content}
        onChange={(json, html) => {
          setContent(json);
          setContentHtml(html);
        }}
      />

      {/* Options row */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-void-text">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="rounded border-void-border bg-void-surface"
          />
          Featured post
        </label>

        <button
          type="button"
          onClick={() => setShowSeo(!showSeo)}
          className="text-xs text-void-muted hover:text-void-text"
        >
          {showSeo ? "Hide" : "Show"} SEO settings
        </button>
      </div>

      {/* SEO section */}
      {showSeo && (
        <div className="space-y-3 rounded-lg border border-void-border bg-void-surface p-4">
          <p className="text-xs font-medium text-void-subtle">SEO Overrides</p>
          <Input
            id="metaTitle"
            label="Meta Title"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder={title || "Defaults to post title"}
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-void-subtle">
              Meta Description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder={excerpt || "Defaults to excerpt"}
              rows={2}
              className="w-full resize-none rounded-md border border-void-border bg-void-surface px-3 py-2 text-sm text-void-text placeholder:text-void-muted focus:border-void-border-hover focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3 border-t border-void-border pt-6">
        <Button
          onClick={() => handleSave("published")}
          disabled={saving || !title || !content}
        >
          {saving ? "Saving..." : post?.status === "published" ? "Update" : "Publish"}
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSave("draft")}
          disabled={saving || !title || !content}
        >
          Save Draft
        </Button>
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/posts")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
