import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AdviceCard from './components/AdviceCard'
import ChatFooter from './components/ChatFooter'
import ChatHeader from './components/ChatHeader'
import MessageList from './components/MessageList'
import { useChatStore, usePlatformStore } from '@/store'
import { resolveApiKey } from '@/utils/url'
import type { ChatMessage as WidgetChatMessage } from '@/types/chat'
import { Doctor } from '@/types/doctor'
import { ApiResponse, type VisitorRegisterResponse } from '@/types/api'
import { imListApi } from '@/services/imList'
import { staffApi } from '@/services/staffApi';

const DEFAULT_DOCTOR_AVATAR =
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80'

type SessionHint = {
  doctorName?: string
  doctorAvatar?: string
}

function subtitleKeyForState(state: { online: boolean; initializing: boolean; error?: string | null }): string {
  if (state.error) return 'userIm.header.subtitle.error'
  if (state.initializing) return 'userIm.header.subtitle.connecting'
  if (state.online) return 'userIm.header.subtitle.connected'
  return 'userIm.header.subtitle.disconnected'
}

function messageToDisplay(item: WidgetChatMessage): { id: string; from: 'doctor' | 'me' | 'system'; content: string; time: string } {
  const payload = item.payload
  if (payload.type >= 1000 && payload.type <= 2000) {
    const text = 'content' in payload && typeof payload.content === 'string' ? payload.content : '[系统消息]'
    return { id: item.id, from: 'system', content: text, time: item.time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }
  }
  let content = ''
  if (payload.type === 1 && 'content' in payload && typeof payload.content === 'string') {
    content = item.streamData || payload.content
  } else if (payload.type === 2) {
    content = '[图片]'
  } else if (payload.type === 3 && 'name' in payload && typeof payload.name === 'string') {
    content = `[文件] ${payload.name}`
  } else if (payload.type === 12 && 'content' in payload && typeof payload.content === 'string') {
    content = payload.content
  } else if (payload.type === 100) {
    content = '正在处理...'
  } else {
    content = '[消息]'
  }
  return {
    id: item.id,
    from: item.role === 'user' ? 'me' : 'doctor',
    content,
    time: item.time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  }
}

function normalizeApiBase(): string {
  let apiBase = (
    (typeof window !== 'undefined' && (window as any).ENV?.VITE_API_BASE_URL) ||
    (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_BASE_URL ||
    undefined
  ) as string | undefined

  if (apiBase && apiBase.startsWith('/') && !apiBase.startsWith('//')) {
    apiBase = `${window.location.origin}${apiBase}`
  }
  return apiBase || ''
}

const ImPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()

  const { t } = useTranslation()

  const [doctor, setDoctor] = useState<Doctor>({
    ID: Number(id),
    name: searchParams.get('name') || '',
    tgo_staff_id: searchParams.get('tgo_staff_id') || '',
    tgo_staff_status: searchParams.get('tgo_staff_status') || '',
    title: '',
    avatar_url: '',
    tags: [],
    content: '',
    status: 0,
    category: '',
    hospital: '',
    goodat: '',
  });

  const messages = useChatStore(s => s.messages)
  const online = useChatStore(s => s.online)
  const error = useChatStore(s => s.error)
  const initializing = useChatStore(s => s.initializing)
  const sendMessage = useChatStore(s => s.sendMessage)
  const uploadFiles = useChatStore(s => s.uploadFiles)
  const ensureWelcomeMessage = useChatStore(s => s.ensureWelcomeMessage)
  const initIM = useChatStore(s => s.initIM)
  const createConsultation = useChatStore(s => s.createConsultation)
  const loadMoreHistory = useChatStore(s => s.loadMoreHistory)
  const historyLoading = useChatStore(s => s.historyLoading)
  const historyHasMore = useChatStore(s => s.historyHasMore)

  const pConfig = usePlatformStore(s => s.config)
  const markWelcomeInjected = usePlatformStore(s => s.markWelcomeInjected)

  const consultationCreated = useRef(false)

  useEffect(() => {
    void staffApi
      .getDoctorDetail(id)
      .then(data => {
        setDoctor(data.data);
      })
      .catch((err: unknown) => {
        setDoctor(null);
      });
  }, [id]);

  const cfg = useMemo(() => {
    let apiBase = (
      (typeof window !== 'undefined' && (window as any).ENV?.VITE_API_BASE_URL) ||
      (import.meta as any).env?.VITE_API_BASE_URL ||
      undefined
    ) as string | undefined

    if (apiBase && apiBase.startsWith('/') && !apiBase.startsWith('//')) {
      apiBase = window.location.origin + apiBase
    }

    return { apiBase }
  }, [])

  useEffect(() => {
    if (!cfg.apiBase) {
      console.warn('[Widget] Missing env VITE_API_BASE_URL')
      return
    }

    const staffId = searchParams.get('tgo_staff_id')
    if (!staffId) {
      console.warn('[Widget] Missing tgo_staff_id in URL params')
      return
    }

    ;(async () => {
      // 1. Ensure IM is connected (registration + websocket)
      await initIM({ apiBase: cfg.apiBase! })

      // 2. Create (or reuse) a consultation channel with this doctor
      if (!consultationCreated.current) {
        consultationCreated.current = true
        try {
          await createConsultation(staffId)
        } catch (e) {
          console.error('[Widget] Failed to create consultation:', e)
        }
      }

      // 3. Inject welcome message AFTER channel is ready (avoids race with switchConsultation clearing messages)
      const welcome = usePlatformStore.getState().config?.welcome_message
      if (welcome && !usePlatformStore.getState().welcomeInjected) {
        ensureWelcomeMessage(welcome)
        markWelcomeInjected()
      }
    })()
  }, [])

  const subtitleKey = useMemo(() => subtitleKeyForState({ online, initializing, error }), [online, initializing, error])
  const errorText = error || null
  const displayMessages = useMemo(() => messages.map(messageToDisplay), [messages])

  const headerName = useMemo(() => `${doctor.name}${t('userIm.header.doctorSuffix', '医生')}`, [doctor.name, t])
  const headerAvatar = useMemo(() => doctor.avatar_url || pConfig.logo_url || DEFAULT_DOCTOR_AVATAR, [doctor.avatar_url, pConfig.logo_url])

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-[#2f261a]">
      <ChatHeader onBack={() => navigate(-1)} doctorName={headerName} doctorAvatar={headerAvatar} subtitleKey={subtitleKey} />

      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-44 pt-20">


        <p className="my-3 self-center rounded-full bg-[#ece3d3] px-3 py-1 text-xs text-[#84745a]">
          {t('userIm.todayLabel', '今天')} {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </p>

        {initializing && displayMessages.length === 0 && (
          <p className="text-center text-sm text-[#84745a]">{t('userIm.connectingHistory')}</p>
        )}
        <MessageList
          messages={displayMessages}
          onLoadMore={loadMoreHistory}
          isLoading={historyLoading}
          hasMore={historyHasMore}
        />
        {/* <AdviceCard /> */}
      </main>

      <ChatFooter
        onSend={text => void sendMessage(text)}
        sendDisabled={!online || initializing}
        onUploadFiles={files => {
          if (!files || files.length === 0) return
          void uploadFiles(files)
        }}
      />
    </div>
  )
}

export default ImPage
