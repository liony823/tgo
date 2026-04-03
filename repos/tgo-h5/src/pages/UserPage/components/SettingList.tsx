import { ChevronRight, FileText, Globe, Lock, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const settings = [
  { key: 'profile', label: '个人资料', desc: '姓名、手机号、紧急联系人', icon: FileText },
  { key: 'privacy', label: '隐私与安全', desc: '密码、授权与设备管理', icon: Lock },
  { key: 'language', label: '语言偏好', desc: '中文（简体）', icon: Globe },
  { key: 'general', label: '通用设置', desc: '消息提醒、缓存与清理', icon: Settings }
];

const SettingList = () => {
  const navigate = useNavigate();

  return (
    <section className="rounded-3xl border border-[#eadfcb] bg-[#fffdf8] p-2 shadow-[0_8px_24px_rgba(93,73,35,0.06)]">
      {settings.map(item => {
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              if (item.key === 'profile') {
                navigate('/set-info');
              }
            }}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-[#faf6ee] active:scale-[0.99]"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2e7c9] text-[#7b6321]">
              <Icon size={18} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-medium text-[#3e3426]">{item.label}</span>
              <span className="block text-xs text-[#8b7d65]">{item.desc}</span>
            </span>
            <ChevronRight size={18} className="text-[#b2a083]" />
          </button>
        );
      })}
    </section>
  );
};

export default SettingList;
