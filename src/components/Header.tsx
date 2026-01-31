import Link from "next/link";

export default function Header() {
  return (
    <header className="py-8 border-b border-white/10">
      <nav className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white hover:opacity-100">
          Weekly Product Lab
        </Link>
        <div className="flex gap-6 text-sm">
          <Link href="/posts" className="text-[var(--foreground-muted)] hover:text-white transition-colors">
            Posts
          </Link>
          <Link href="/about" className="text-[var(--foreground-muted)] hover:text-white transition-colors">
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
