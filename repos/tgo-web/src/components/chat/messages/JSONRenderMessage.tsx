import React, { useCallback, useMemo } from 'react';
import { type DataPart, useJsonRenderMessage } from '@json-render/react';

import type { Message } from '@/types';
import MarkdownContent from '../MarkdownContent';
import { chatMessagesApiService } from '@/services/chatMessagesApi';
import { JSONRenderSurface } from '../jsonRender/JSONRenderSurface';

/** Strip ```spec fences from text to prevent leaking raw JSON patches in fallback rendering. */
function stripSpecFences(text: string): string {
  return text.replace(/```spec[\s\S]*?```/g, '').replace(/```spec[\s\S]*/g, '').trim();
}

interface JSONRenderMessageProps {
  message: Message;
  isStaff: boolean;
  onSendMessage?: (message: string) => void;
}

// ---------------------------------------------------------------------------
// Grouping helpers — split an ordered DataPart[] into runs of the same kind
// so text and spec UI can be rendered in the original interleaved order.
// ---------------------------------------------------------------------------

type PartGroup =
  | { type: 'text'; text: string }
  | { type: 'spec'; parts: DataPart[] };

function groupParts(parts: DataPart[]): PartGroup[] {
  const groups: PartGroup[] = [];
  for (const part of parts) {
    if (part.type === 'text') {
      const last = groups[groups.length - 1];
      if (last?.type === 'text') {
        last.text += part.text || '';
      } else {
        groups.push({ type: 'text', text: part.text || '' });
      }
    } else {
      const last = groups[groups.length - 1];
      if (last?.type === 'spec') {
        last.parts.push(part);
      } else {
        groups.push({ type: 'spec', parts: [part] });
      }
    }
  }
  return groups;
}

// ---------------------------------------------------------------------------
// Sub-component: render a single group of consecutive spec DataParts
// ---------------------------------------------------------------------------

const JSONRenderGroup: React.FC<{
  parts: DataPart[];
  onAction: (name: string, ctx: Record<string, unknown>) => void;
}> = ({ parts, onAction }) => {
  const { spec } = useJsonRenderMessage(parts);
  if (!spec) return null;
  return <JSONRenderSurface spec={spec} onAction={onAction} />;
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const JSONRenderMessage: React.FC<JSONRenderMessageProps> = ({ message, isStaff, onSendMessage }) => {
  const meta = message.metadata ?? {};
  const uiParts = useMemo(() => {
    return Array.isArray(meta.ui_parts) ? (meta.ui_parts as DataPart[]) : [];
  }, [meta.ui_parts]);

  const groups = useMemo(() => groupParts(uiParts), [uiParts]);

  // Fallback: if no groups produced (e.g. empty ui_parts), show raw content
  const hasContent = groups.length > 0;

  const handleAction = useCallback(
    async (actionName: string, context: Record<string, unknown>) => {
      if (!message.channelId || message.channelType == null) {
        console.warn('UI action: missing channel info, cannot send');
        return;
      }
      try {
        await chatMessagesApiService.sendUIAction({
          channel_id: message.channelId,
          channel_type: message.channelType,
          action_name: actionName,
          context,
        });
      } catch (err) {
        console.error('Failed to send UI user action:', err);
      }
    },
    [message.channelId, message.channelType]
  );

  return (
    <div
      className={`json-render-message inline-block max-w-full p-3 shadow-sm overflow-hidden ${
        isStaff
          ? 'bg-blue-500 dark:bg-blue-600 text-white rounded-lg rounded-tr-none'
          : 'bg-white dark:bg-gray-700 rounded-lg rounded-tl-none border border-gray-100 dark:border-gray-600'
      }`}
    >
      {hasContent ? (
        groups.map((group, i) => {
          if (group.type === 'text') {
            if (!group.text.trim()) return null;
            return (
              <div key={i} className={`text-sm ${isStaff ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                <MarkdownContent
                  content={group.text}
                  className={isStaff ? 'markdown-white' : ''}
                  onSendMessage={onSendMessage}
                />
              </div>
            );
          }
          return <JSONRenderGroup key={i} parts={group.parts} onAction={handleAction} />;
        })
      ) : (
        (() => {
          const fallbackText = stripSpecFences(message.content || '');
          return fallbackText ? (
            <div className={`text-sm ${isStaff ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
              <MarkdownContent
                content={fallbackText}
                className={isStaff ? 'markdown-white' : ''}
                onSendMessage={onSendMessage}
              />
            </div>
          ) : null;
        })()
      )}
    </div>
  );
};

export default JSONRenderMessage;
