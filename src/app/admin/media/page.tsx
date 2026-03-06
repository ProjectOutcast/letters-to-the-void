"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  width: number | null;
  height: number | null;
  size: number;
  alt: string | null;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    const res = await fetch("/api/media");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        toast(`Failed to upload ${file.name}`, "error");
      }
    }

    toast("Upload complete", "success");
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    fetchMedia();
  }

  async function handleDelete() {
    if (!deleteId) return;
    await fetch(`/api/media/${deleteId}`, { method: "DELETE" });
    toast("Image deleted", "success");
    setDeleteId(null);
    fetchMedia();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast("URL copied", "info");
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-void-elevated" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded bg-void-elevated" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-void-heading">Media</h1>
        <label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </label>
      </div>

      {items.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg border border-void-border bg-void-surface"
            >
              <div className="aspect-square">
                <img
                  src={item.url}
                  alt={item.alt || item.filename}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-2">
                <p className="truncate text-xs text-void-text">
                  {item.filename}
                </p>
                <p className="text-xs text-void-muted">
                  {item.width}&times;{item.height} &middot; {formatSize(item.size)}
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-void/70 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyUrl(item.url)}
                >
                  Copy URL
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setDeleteId(item.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-void-border bg-void-surface p-8 text-center">
          <p className="text-sm text-void-muted">No media uploaded yet.</p>
        </div>
      )}

      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Image"
      >
        <p className="text-sm text-void-muted">
          Are you sure? This will permanently delete the image.
        </p>
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
