import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import type { EmojiTabId } from '@/constants/emojis'
import { emojisForTab } from '@/constants/emojis'

type EmojiPickerPopoverProps = {
  anchorRef: React.RefObject<HTMLElement | null> | React.RefObject<HTMLButtonElement | null>
  onSelect: (emoji: string) => void
  onClose: () => void
}

const PANEL_W = 340
const PANEL_MAX_H = 320
const GAP = 8

function computePosition(anchor: DOMRect): { top: number; left: number } {
  const vw = window.innerWidth
  const vh = window.innerHeight
  let top = anchor.top - PANEL_MAX_H - GAP
  if (top < GAP) {
    top = Math.min(anchor.bottom + GAP, vh - PANEL_MAX_H - GAP)
  }
  const centerX = anchor.left + anchor.width / 2 - PANEL_W / 2
  const left = Math.min(Math.max(GAP, centerX), vw - PANEL_W - GAP)
  return { top, left }
}

export default function EmojiPickerPopover({ anchorRef, onSelect, onClose }: EmojiPickerPopoverProps) {
  const [tab, setTab] = useState<EmojiTabId>('smileys')
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  const list = useMemo(() => [...emojisForTab(tab)], [tab])

  const updatePosition = useCallback(() => {
    const el = anchorRef.current
    if (!el) return
    setPos(computePosition(el.getBoundingClientRect()))
  }, [anchorRef])

  useLayoutEffect(() => {
    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [updatePosition])

  const panelStyle: React.CSSProperties = pos
    ? { top: pos.top, left: pos.left, width: PANEL_W, maxHeight: PANEL_MAX_H }
    : { top: GAP, left: GAP, width: PANEL_W, maxHeight: PANEL_MAX_H }

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-[999]" onClick={onClose} aria-hidden="true" />,
        document.body,
      )}
      {createPortal(
        <div
          className="fixed z-[1000] flex flex-col overflow-hidden rounded-xl border border-[#eadfcb] bg-[#fffdf8] shadow-lg"
          style={panelStyle}
          role="dialog"
          aria-label="表情包"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex gap-1.5 border-b border-[#ece3d3] px-2.5 py-2">
            <button
              type="button"
              className={`rounded-lg px-2 py-1.5 text-base ${tab === 'smileys' ? 'bg-[#efe7d9]' : 'bg-transparent hover:bg-[#f5f1ea]'}`}
              aria-pressed={tab === 'smileys'}
              aria-label="笑脸"
              onClick={() => setTab('smileys')}
            >
              😀
            </button>
            <button
              type="button"
              className={`rounded-lg px-2 py-1.5 text-base ${tab === 'hearts' ? 'bg-[#efe7d9]' : 'bg-transparent hover:bg-[#f5f1ea]'}`}
              aria-pressed={tab === 'hearts'}
              aria-label="爱心"
              onClick={() => setTab('hearts')}
            >
              ❤️
            </button>
            <button
              type="button"
              className={`rounded-lg px-2 py-1.5 text-base ${tab === 'party' ? 'bg-[#efe7d9]' : 'bg-transparent hover:bg-[#f5f1ea]'}`}
              aria-pressed={tab === 'party'}
              aria-label="庆祝"
              onClick={() => setTab('party')}
            >
              🎉
            </button>
          </div>
          <div className="grid max-h-[260px] grid-cols-8 gap-1.5 overflow-auto p-2.5">
            {list.map((ch, i) => (
              <button
                key={`${tab}-${i}-${ch}`}
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border-0 bg-transparent text-[22px] leading-none hover:bg-[#efe7d9]"
                onClick={() => onSelect(ch)}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
