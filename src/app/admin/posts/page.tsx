"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  featured: boolean;
  authorName: string;
  createdAt: string;
  publishedAt: string | null;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const res = await fetch("/api/posts?all=true");
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus,
        publishedAt: newStatus === "published" ? new Date().toISOString() : null,
      }),
    });
    toast(newStatus === "published" ? "Post published" : "Post unpublished", "success");
    fetchPosts();
  }

  async function deletePost() {
    if (!deleteId) return;
    await fetch(`/api/posts/${deleteId}`, { method: "DELETE" });
    toast("Post deleted", "success");
    setDeleteId(null);
    fetchPosts();
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-void-elevated" />
        <div className="h-64 rounded bg-void-elevated" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-void-heading">Posts</h1>
        <Link href="/admin/posts/new">
          <Button size="sm">New Post</Button>
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-void-border text-left">
                <th className="pb-3 pr-4 text-xs font-medium text-void-muted">
                  Title
                </th>
                <th className="hidden pb-3 pr-4 text-xs font-medium text-void-muted sm:table-cell">
                  Author
                </th>
                <th className="pb-3 pr-4 text-xs font-medium text-void-muted">
                  Status
                </th>
                <th className="hidden pb-3 pr-4 text-xs font-medium text-void-muted md:table-cell">
                  Date
                </th>
                <th className="pb-3 text-xs font-medium text-void-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-void-border">
              {posts.map((post) => (
                <tr key={post.id} className="group">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-void-text transition-colors hover:text-void-heading"
                    >
                      {post.title}
                    </Link>
                    {post.featured && (
                      <Badge className="ml-2" variant="warning">
                        featured
                      </Badge>
                    )}
                  </td>
                  <td className="hidden py-3 pr-4 text-void-muted sm:table-cell">
                    {post.authorName}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge
                      variant={
                        post.status === "published" ? "success" : "default"
                      }
                    >
                      {post.status}
                    </Badge>
                  </td>
                  <td className="hidden py-3 pr-4 text-void-muted md:table-cell">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(post.id, post.status)}
                      >
                        {post.status === "published" ? "Unpublish" : "Publish"}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteId(post.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-void-border bg-void-surface p-8 text-center">
          <p className="text-sm text-void-muted">
            No posts yet. Write your first letter.
          </p>
        </div>
      )}

      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Post"
      >
        <p className="text-sm text-void-muted">
          Are you sure? This action cannot be undone.
        </p>
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={deletePost}>
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
