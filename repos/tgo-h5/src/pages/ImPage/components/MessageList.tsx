import { useEffect, useRef, useCallback } from 'react'
import type { ChatMessage } from '../types';

interface MessageListProps {
  messages: ChatMessage[];
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

const MessageList = ({ messages, onLoadMore, isLoading, hasMore }: MessageListProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isAtBottomRef = useRef(true)
  const preHeightRef = useRef<number | null>(null)
  const prevCountRef = useRef(messages.length)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => {
      if (!el) return
      isAtBottomRef.current = (el.scrollTop + el.clientHeight) >= (el.scrollHeight - 16)
      if (el.scrollTop <= 16 && !isLoading && hasMore && onLoadMore) {
        preHeightRef.current = el.scrollHeight
        onLoadMore()
      }
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [isLoading, hasMore, onLoadMore])

  const scrollToBottom = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (el) el.scrollTop = el.scrollHeight
      })
    })
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const prev = prevCountRef.current
    const curr = messages.length
    prevCountRef.current = curr

    if (preHeightRef.current != null) {
      const delta = el.scrollHeight - preHeightRef.current
      el.scrollTop = delta
      preHeightRef.current = null
      return
    }
    if (curr > prev) {
      scrollToBottom()
      return
    }
    if (isAtBottomRef.current) {
      scrollToBottom()
    }
  }, [messages, scrollToBottom])

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto min-h-0">
      {isLoading && (
        <p className="text-center text-xs text-[#9b8d76] py-2">加载中...</p>
      )}
      {!isLoading && hasMore === false && messages.length > 0 && (
        <p className="text-center text-xs text-[#9b8d76] py-2">没有更多消息了</p>
      )}
      <section className="space-y-4">
        {messages.map(item => (
          <article
            key={item.id}
            className={`flex ${
              item.from === 'me' ? 'justify-end' : item.from === 'system' ? 'justify-center' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[78%] ${
                item.from === 'me' ? 'items-end' : item.from === 'system' ? 'items-center' : 'items-start'
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-3 text-[15px] leading-7 shadow-[0_4px_14px_rgba(93,73,35,0.08)] ${
                  item.from === 'me'
                    ? 'rounded-tr-md bg-[#9b7b2f] text-[#fff9ec]'
                    : item.from === 'system'
                      ? 'rounded-md bg-[#ece3d3] text-[#5d5345] text-center text-sm'
                      : 'rounded-tl-md bg-[#fffdf8] text-[#4f4333]'
                }`}
              >
                {item.content}
              </div>
              {item.from !== 'system' && (
                <p className={`mt-1 text-xs text-[#9b8d76] ${item.from === 'me' ? 'text-right' : 'text-left'}`}>
                  {item.time}
                </p>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default MessageList;
