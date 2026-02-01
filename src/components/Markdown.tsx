"use client";

import React from "react";

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  const lines = content.split("\n");
  const elements: React.ReactElement[] = [];
  let i = 0;
  let listItems: string[] = [];
  let tableRows: string[] = [];
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

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const dataRows = tableRows.slice(2); // Skip header and separator row

      const parseTableCells = (row: string) => {
        return row
          .split("|")
          .map((cell) => cell.trim())
          .filter((cell) => cell !== "");
      };

      const headers = parseTableCells(headerRow);
      const rows = dataRows.map((row) => parseTableCells(row));

      elements.push(
        <div key={getKey()} className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="text-left py-2 px-3 text-white font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="border-b border-white/5">
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className="py-2 px-3 text-[var(--foreground-muted)]"
                      dangerouslySetInnerHTML={{ __html: parseInline(cell) }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
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
      flushTable();
      elements.push(
        <h2 key={getKey()} className="text-2xl font-bold mt-12 mb-4 text-white">
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList();
      flushTable();
      elements.push(
        <h3 key={getKey()} className="text-xl font-bold mt-8 mb-3 text-white">
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      listItems.push(line.replace("- ", ""));
    } else if (line.match(/^\d+\. /)) {
      flushList();
      flushTable();
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
      flushTable();
      elements.push(<hr key={getKey()} className="border-white/10 my-8" />);
    } else if (line.startsWith("> ")) {
      flushList();
      flushTable();
      elements.push(
        <blockquote
          key={getKey()}
          className="border-l-2 border-[var(--accent-green)] pl-4 my-4 text-[var(--foreground-muted)] italic"
        >
          {line.replace("> ", "")}
        </blockquote>
      );
    } else if (line.match(/^!\[.*?\]\(.*?\)$/)) {
      // Image: ![alt](src)
      flushList();
      flushTable();
      const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        elements.push(
          <figure key={getKey()} className="my-8">
            <img
              src={imgMatch[2]}
              alt={imgMatch[1]}
              className="rounded-lg max-w-md mx-auto shadow-lg"
            />
          </figure>
        );
      }
    } else if (line.match(/^\|.*\|$/)) {
      // Table row: | col | col |
      flushList();
      tableRows.push(line);
    } else if (line.trim() !== "") {
      flushList();
      flushTable();
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
  flushTable();

  return <div>{elements}</div>;
}
