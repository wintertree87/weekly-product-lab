import { getPageContent } from "@/lib/content";
import Markdown from "@/components/Markdown";

export default function AboutPage() {
  const page = getPageContent("about");

  if (!page) {
    return <div>페이지를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{page.title}</h1>
      <div className="prose prose-invert max-w-none">
        <Markdown content={page.content} />
      </div>
    </div>
  );
}
