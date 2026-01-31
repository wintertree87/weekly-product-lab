import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Posts</h1>
        <p className="text-[var(--foreground-muted)]">
          매주 새로운 프로덕트를 만들며 배운 것들
        </p>
      </div>

      <div className="space-y-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="block group"
          >
            <article className="space-y-3 py-6 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
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
              <h2 className="text-xl font-medium text-white group-hover:text-[var(--accent-green)] transition-colors">
                {post.title}
              </h2>
              <p className="text-[var(--foreground-muted)]">{post.description}</p>
            </article>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-[var(--foreground-muted)]">아직 작성된 글이 없습니다.</p>
      )}
    </div>
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
