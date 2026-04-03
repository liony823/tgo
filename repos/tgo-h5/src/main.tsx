/**
 * 访客 Widget 入口：挂载 React、注入全局样式与 Emotion 缓存。
 *
 * 双 iframe 场景下（控制器 frame 名 `tgo-controller-frame`），将根节点挂到
 * 父窗口中 `tgo-ui-frame` 的 document，保证样式与 DOM 与可见 UI 一致。
 * 跨域访问失败时回退到当前 document。
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { CacheProvider, Global, css } from '@emotion/react'
import createCache from '@emotion/cache'
import { RouterProvider } from 'react-router-dom'
import hljsThemeCss from 'highlight.js/styles/github.css?inline'
import { router } from './router'
import './i18n'
import './index.css'

function getTargetDocument(): Document {
  try {
    const isController = window.name === 'tgo-controller-frame'
    if (isController && window.parent && 'frames' in window.parent) {
      const uiFrame = (window.parent as any).frames['tgo-ui-frame'] as Window | undefined
      if (uiFrame && uiFrame.document) return uiFrame.document
    }
  } catch {
    // 跨域无法读 parent.frames 时退回当前 document
  }
  return document
}

const targetDoc = getTargetDocument()
const container = targetDoc.getElementById('tgo-root') || targetDoc.getElementById('root')

if (!container) {
  // 宿主未提供 #tgo-root / #root 时自建挂载点
  const el = targetDoc.createElement('div')
  el.id = 'tgo-root'
  targetDoc.body.appendChild(el)
}

// 代码块高亮主题写入目标 document（与消息 Markdown 渲染一致）
if (!targetDoc.getElementById('hljs-theme')) {
  const style = targetDoc.createElement('style')
  style.id = 'hljs-theme'
  style.textContent = hljsThemeCss
  targetDoc.head.appendChild(style)
}

// Emotion 插入点与目标 document 对齐，避免样式跑到错误 iframe
const emotionCache = createCache({ key: 'tgo', container: targetDoc.head })

ReactDOM.createRoot((targetDoc.getElementById('tgo-root') || targetDoc.getElementById('root')) as HTMLElement).render(
    <CacheProvider value={emotionCache}>
      <Global styles={css`
        :root { --primary:#2f80ed; --bg:#ffffff; --text:#1f2937; --muted:#6b7280; }
        html, body, #tgo-root, #root { height: 100%; overscroll-behavior: contain; }
        body { margin:0; background: var(--bg-primary, var(--bg)); color: var(--text-primary, var(--text)); font: 14px/1.4 system-ui,-apple-system, Segoe UI, Roboto, Helvetica, Arial; }
        * { box-sizing: border-box; }
      `} />
      <RouterProvider router={router} />
    </CacheProvider>
)

