import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface PageContent {
  title: string;
  content: string;
}

export function getPageContent(pageName: string): PageContent | null {
  try {
    const fullPath = path.join(contentDirectory, `${pageName}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      title: data.title || "",
      content,
    };
  } catch {
    return null;
  }
}
