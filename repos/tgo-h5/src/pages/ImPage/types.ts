export interface ChatMessage {
  id: string;
  /** doctor = 下行医护/坐席；me = 本地用户；system = 提示条（可选） */
  from: 'doctor' | 'me' | 'system';
  content: string;
  time: string;
}
