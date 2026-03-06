import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PostCard } from "@/components/posts/post-card";
import { FeaturedPost } from "@/components/posts/featured-post";
import { getPublishedPosts, getFeaturedPost } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const featured = getFeaturedPost();
  const posts = getPublishedPosts();
  const nonFeaturedPosts = featured
    ? posts.filter((p) => p.id !== featured.id)
    : posts;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 pt-24 pb-16">
        {/* Hero */}
        <section className="animate-fade-in py-16 text-center md:py-24">
          <h1 className="font-serif text-4xl font-medium tracking-tight text-void-heading md:text-5xl lg:text-6xl">
            Letters to The Void
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-void-muted md:text-base">
            Thoughts cast into the darkness. Addressed to no one and everyone.
          </p>
          <div className="mx-auto mt-8 h-px w-16 bg-void-border" />
        </section>

        {/* Featured */}
        {featured && (
          <section className="animate-fade-in-up mb-16">
            <FeaturedPost post={featured} />
          </section>
        )}

        {/* Posts grid */}
        {nonFeaturedPosts.length > 0 ? (
          <section>
            <h2 className="mb-8 text-xs font-medium uppercase tracking-widest text-void-muted">
              Latest Letters
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {nonFeaturedPosts.map((post, i) => (
                <div
                  key={post.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </section>
        ) : (
          !featured && (
            <section className="py-24 text-center">
              <p className="font-serif text-lg text-void-muted">
                The void awaits its first letter.
              </p>
            </section>
          )
        )}
      </main>
      <Footer />
    </>
  );
}
