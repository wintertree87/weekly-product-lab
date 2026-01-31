import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();
  const latestPosts = posts.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="space-y-6">
        <h1 className="text-4xl font-bold">
          주말마다 만들고,
          <br />
          평일엔 발견하고.
        </h1>
        <p className="text-[var(--foreground-muted)] text-lg leading-relaxed">
          40대 PM이 Claude Code와 함께 매주 새로운 프로덕트를 만들고,
          그 과정에서 발견한 것들을 기록합니다.
        </p>
        <div className="flex gap-4">
          <Link
            href="/posts"
            className="inline-block px-6 py-3 bg-[var(--accent-green)] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            글 읽기
          </Link>
          <Link
            href="/about"
            className="inline-block px-6 py-3 border border-white/20 text-white font-medium rounded-lg hover:bg-white/5 transition-colors"
          >
            소개
          </Link>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">최신 글</h2>
        <div className="space-y-6">
          {latestPosts.map((post, index) => (
            <PostPreview
              key={post.slug}
              title={post.title}
              description={post.description}
              date={post.date}
              slug={post.slug}
              isNew={index === 0}
            />
          ))}
        </div>
        {posts.length > 3 && (
          <Link
            href="/posts"
            className="inline-block text-[var(--foreground-muted)] hover:text-white transition-colors"
          >
            모든 글 보기 →
          </Link>
        )}
      </section>

      {/* About Section */}
      <section className="space-y-4 p-6 border border-white/10 rounded-lg">
        <h2 className="text-xl font-bold">Weekly Product Lab이란?</h2>
        <p className="text-[var(--foreground-muted)] leading-relaxed">
          매주 새로운 프로덕트를 만들고, AI와 함께 빌딩하는 과정을 공유합니다.
          시행착오, 배움, 그리고 작은 성공들을 솔직하게 기록합니다.
        </p>
      </section>
    </div>
  );
}

function PostPreview({
  title,
  description,
  date,
  slug,
  isNew = false,
}: {
  title: string;
  description: string;
  date: string;
  slug: string;
  isNew?: boolean;
}) {
  return (
    <Link href={`/posts/${slug}`} className="block group">
      <article className="space-y-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-medium text-white group-hover:text-[var(--accent-green)] transition-colors">
            {title}
          </h3>
          {isNew && (
            <span className="px-2 py-0.5 text-xs bg-[var(--accent-orange)] text-white rounded">
              NEW
            </span>
          )}
        </div>
        <p className="text-[var(--foreground-muted)] text-sm">{description}</p>
        <p className="text-[var(--foreground-muted)] text-xs">{formatDate(date)}</p>
      </article>
    </Link>
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
