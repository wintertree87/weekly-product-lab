export default function Footer() {
  return (
    <footer className="py-8 border-t border-white/10 mt-auto">
      <div className="flex items-center justify-between text-sm text-[var(--foreground-muted)]">
        <p>© 2025 Weekly Product Lab</p>
        <div className="flex gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
}
