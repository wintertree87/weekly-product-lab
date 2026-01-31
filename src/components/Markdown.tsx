"use client";

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let i = 0;
  let listItems: string[] = [];
  let keyCounter = 0;

  const getKey = () => `md-${keyCounter++}`;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={getKey()} className="space-y-2 my-4 ml-4">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-[var(--foreground-muted)] flex gap-2">
              <span className="text-[var(--accent-green)]">•</span>
              <span dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const parseInline = (text: string): string => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-[var(--accent-green)] hover:opacity-80">$1</a>');
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={getKey()} className="text-2xl font-bold mt-12 mb-4 text-white">
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={getKey()} className="text-xl font-bold mt-8 mb-3 text-white">
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      listItems.push(line.replace("- ", ""));
    } else if (line.match(/^\d+\. /)) {
      flushList();
      const match = line.match(/^(\d+)\. (.+)$/);
      if (match) {
        elements.push(
          <div key={getKey()} className="flex gap-3 my-2">
            <span className="text-[var(--accent-green)] font-bold">{match[1]}.</span>
            <span
              className="text-[var(--foreground-muted)]"
              dangerouslySetInnerHTML={{ __html: parseInline(match[2]) }}
            />
          </div>
        );
      }
    } else if (line === "---") {
      flushList();
      elements.push(<hr key={getKey()} className="border-white/10 my-8" />);
    } else if (line.startsWith("> ")) {
      flushList();
      elements.push(
        <blockquote
          key={getKey()}
          className="border-l-2 border-[var(--accent-green)] pl-4 my-4 text-[var(--foreground-muted)] italic"
        >
          {line.replace("> ", "")}
        </blockquote>
      );
    } else if (line.trim() !== "") {
      flushList();
      elements.push(
        <p
          key={getKey()}
          className="text-[var(--foreground-muted)] leading-relaxed my-4"
          dangerouslySetInnerHTML={{ __html: parseInline(line) }}
        />
      );
    }

    i++;
  }

  flushList();

  return <div>{elements}</div>;
}
