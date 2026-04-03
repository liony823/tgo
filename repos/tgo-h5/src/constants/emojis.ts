/** 与 `MessageInput` 表情包面板保持一致，供 Im 页等复用 */

export type EmojiTabId = 'smileys' | 'hearts' | 'party'

export const SMILEYS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🫠', '🤗', '🥲', '🫡', '🤔',
] as const

export const HEARTS = [
  '❤️', '🩵', '💛', '💚', '💙', '💜', '🧡', '🖤', '🤍', '🤎', '💘', '💖', '💗', '💓', '💕', '💞',
] as const

export const PARTY = [
  '🎉', '🎊', '✨', '⭐️', '🌟', '💫', '🔥', '⚡️', '🎈', '🎁', '🥳', '👏', '👍', '🙌', '🤝',
] as const

export function emojisForTab(tab: EmojiTabId): readonly string[] {
  if (tab === 'smileys') return SMILEYS
  if (tab === 'hearts') return HEARTS
  return PARTY
}
