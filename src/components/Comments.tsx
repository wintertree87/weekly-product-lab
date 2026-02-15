'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Comment {
  id: string
  author_name: string
  content: string
  created_at: string
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 30) return `${days}일 전`
  return new Date(dateStr).toLocaleDateString('ko-KR')
}

export default function Comments({ postSlug }: { postSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const honeypotRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('blog_comment_name')
    if (saved) setName(saved)
  }, [])

  useEffect(() => {
    fetchComments()
  }, [postSlug])

  async function fetchComments() {
    setLoading(true)
    const { data, error } = await supabase
      .from('blog_comments')
      .select('id, author_name, content, created_at')
      .eq('post_slug', postSlug)
      .order('created_at', { ascending: true })

    if (error) {
      setError('댓글을 불러오지 못했습니다.')
    } else {
      setComments(data || [])
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // 허니팟 스팸 방지
    if (honeypotRef.current?.value) return

    const trimmedName = name.trim()
    const trimmedContent = content.trim()

    if (!trimmedName || !trimmedContent) return
    if (trimmedName.length > 30 || trimmedContent.length > 1000) return

    setSubmitting(true)
    localStorage.setItem('blog_comment_name', trimmedName)

    const { error } = await supabase.from('blog_comments').insert({
      post_slug: postSlug,
      author_name: trimmedName,
      content: trimmedContent,
    })

    if (error) {
      setError('댓글 등록에 실패했습니다. 다시 시도해주세요.')
    } else {
      setContent('')
      await fetchComments()
    }
    setSubmitting(false)
  }

  return (
    <section className="mt-16 pt-8 border-t border-white/10">
      <h2 className="text-xl font-bold text-white mb-6">
        댓글 {!loading && comments.length > 0 && (
          <span className="text-[var(--accent-green)] text-base font-normal ml-1">
            {comments.length}
          </span>
        )}
      </h2>

      {/* 댓글 목록 */}
      {loading ? (
        <p className="text-[var(--foreground-muted)] text-sm">불러오는 중...</p>
      ) : error && comments.length === 0 ? (
        <p className="text-red-400 text-sm">{error}</p>
      ) : comments.length === 0 ? (
        <p className="text-[var(--foreground-muted)] text-sm mb-8">
          아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
        </p>
      ) : (
        <div className="space-y-4 mb-8">
          {comments.map((c) => (
            <div key={c.id} className="p-4 rounded-lg bg-white/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-white">
                  {c.author_name}
                </span>
                <span className="text-xs text-[var(--foreground-muted)]">
                  {timeAgo(c.created_at)}
                </span>
              </div>
              <p className="text-sm text-[var(--foreground-muted)] whitespace-pre-wrap">
                {c.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 댓글 작성 폼 */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          required
          className="w-full max-w-xs px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--accent-green)] transition-colors"
        />
        <textarea
          placeholder="댓글을 남겨주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
          required
          rows={3}
          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--accent-green)] transition-colors resize-none"
        />
        {/* 허니팟 - 봇만 채움 */}
        <input
          ref={honeypotRef}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          style={{ position: 'absolute', left: '-9999px' }}
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded bg-[var(--accent-green)] text-black text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? '등록 중...' : '댓글 등록'}
          </button>
          {error && comments.length > 0 && (
            <span className="text-red-400 text-xs">{error}</span>
          )}
        </div>
      </form>
    </section>
  )
}
