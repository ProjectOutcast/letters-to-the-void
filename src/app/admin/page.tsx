import Link from "next/link";
import { getPostStats, getAllPosts } from "@/lib/posts";
import { db } from "@/db";
import { media } from "@/db/schema";
import { sql } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const stats = getPostStats();
  const recentPosts = getAllPosts().slice(0, 5);
  const mediaCount =
    db
      .select({ count: sql<number>`count(*)` })
      .from(media)
      .get()?.count || 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-void-heading">Dashboard</h1>
        <Link href="/admin/posts/new">
          <Button size="sm">New Post</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Posts", value: stats.total },
          { label: "Published", value: stats.published },
          { label: "Drafts", value: stats.drafts },
          { label: "Media Files", value: mediaCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-void-border bg-void-surface p-4"
          >
            <p className="text-xs text-void-muted">{stat.label}</p>
            <p className="mt-1 text-2xl font-light text-void-heading">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent posts */}
      <div className="mt-8">
        <h2 className="mb-4 text-sm font-medium text-void-subtle">
          Recent Posts
        </h2>
        {recentPosts.length > 0 ? (
          <div className="divide-y divide-void-border rounded-lg border border-void-border bg-void-surface">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}/edit`}
                className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-void-elevated"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-void-text">
                    {post.title}
                  </p>
                  <p className="mt-0.5 text-xs text-void-muted">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
                <Badge
                  variant={post.status === "published" ? "success" : "default"}
                >
                  {post.status}
                </Badge>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-void-border bg-void-surface p-8 text-center">
            <p className="text-sm text-void-muted">
              No posts yet. Write your first letter to the void.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
