import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import Markdown from "@/components/Markdown";
import Comments from "@/components/Comments";

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <Link
          href="/posts"
          className="text-sm text-[var(--foreground-muted)] hover:text-white transition-colors"
        >
          ← 목록으로
        </Link>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <div className="flex gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[var(--accent-green)]">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="prose prose-invert prose-green max-w-none">
        <Markdown content={post.content} />
      </div>

      <Comments postSlug={slug} />
    </article>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
