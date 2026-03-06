import { PostForm } from "@/components/editor/post-form";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-medium text-void-heading">
        New Letter
      </h1>
      <PostForm />
    </div>
  );
}
