import { FileText, Image as ImageIcon, SendHorizontal, Smile } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import EmojiPickerPopover from '@/components/chat/EmojiPickerPopover';

interface ChatFooterProps {
  onSend: (text: string) => void;
  sendDisabled: boolean;
  onUploadFiles: (files: FileList | null, kind: 'image' | 'file') => void;
}

const ChatFooter = ({ onSend, sendDisabled, onUploadFiles }: ChatFooterProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const insertEmoji = useCallback(
    (emoji: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart ?? message.length;
      const end = textarea.selectionEnd ?? message.length;
      const nextMessage = message.slice(0, start) + emoji + message.slice(end);
      setMessage(nextMessage);

      requestAnimationFrame(() => {
        textarea.focus();
        const position = start + emoji.length;
        try {
          textarea.selectionStart = position;
          textarea.selectionEnd = position;
        } catch {
          // 部分浏览器在不可聚焦状态下可能抛错，忽略即可
        }
      });
    },
    [message]
  );

  const handleSend = () => {
    if (!message.trim() || sendDisabled) return;
    onSend(message);
    setMessage('');
    setShowEmoji(false);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#eadfcb] bg-[#fcf9f0]/95 px-4 pb-5 pt-3 backdrop-blur-md">
      {showEmoji && (
        <EmojiPickerPopover
          anchorRef={emojiBtnRef}
          onSelect={insertEmoji}
          onClose={() => setShowEmoji(false)}
        />
      )}

      <div className="mx-auto w-full max-w-md space-y-3">
        <div className="flex items-end gap-2">
          <button
            ref={emojiBtnRef}
            type="button"
            onClick={() => setShowEmoji(prev => !prev)}
            className={`inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-[#7b6321] transition active:scale-95 ${
              showEmoji ? 'bg-[#e5dcc8] ring-2 ring-[#c4b08a]/60' : 'bg-[#efe7d9]'
            }`}
            aria-label="emoji 表情包"
            aria-expanded={showEmoji}
            title="emoji 表情包"
          >
            <Smile size={20} />
          </button>

          <label
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-[#efe7d9] text-[#7b6321] transition active:scale-95"
            aria-label="文件上传"
            title="文件上传"
          >
            <FileText size={20} />
            <input
              type="file"
              className="hidden"
              onChange={event => {
                onUploadFiles(event.target.files, 'file');
                event.currentTarget.value = '';
              }}
            />
          </label>

          <label
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-[#efe7d9] text-[#7b6321] transition active:scale-95"
            aria-label="图片上传"
            title="图片上传"
          >
            <ImageIcon size={20} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={event => {
                onUploadFiles(event.target.files, 'image');
                event.currentTarget.value = '';
              }}
            />
          </label>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={event => setMessage(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder="请输入您的问题..."
            className="max-h-28 min-h-10 flex-1 resize-none rounded-xl border border-[#eadfcb] bg-[#fffdf8] px-3 py-2 text-sm text-[#4f4333] placeholder:text-[#9b8d76] focus:outline-none"
          />

          <button
            type="button"
            onClick={handleSend}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#9b7b2f] text-[#fff9ec] transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="发送"
            disabled={!message.trim() || sendDisabled}
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default ChatFooter;
