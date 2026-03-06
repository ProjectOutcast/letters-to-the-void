import { notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";
import { PostForm } from "@/components/editor/post-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = getPostById(id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-medium text-void-heading">
        Edit Letter
      </h1>
      <PostForm
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          status: post.status,
          featured: post.featured,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
        }}
      />
    </div>
  );
}
