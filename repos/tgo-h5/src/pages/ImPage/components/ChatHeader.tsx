import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChatHeaderProps {
  onBack: () => void;
  doctorName: string;
  doctorAvatar: string;
  subtitleKey: string;
}

const ChatHeader = ({ onBack, doctorName, doctorAvatar, subtitleKey }: ChatHeaderProps) => {
  const { t } = useTranslation();
  const displayName = doctorName.trim() || t('userIm.header.defaultDoctor', '在线医护');
  const subtitle = t(subtitleKey, subtitleKey);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#eadfcb] bg-[#fcf9f0]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-md items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="返回"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#6f5318] transition active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-wide text-[#6f5318]">{displayName}</span>
            <span className="text-xs text-[#7d735f]">{subtitle}</span>
          </div>
        </div>

        <img
          src={doctorAvatar}
          alt=""
          className="h-10 w-10 rounded-full border border-[#e8dcc4] object-cover shadow-sm"
        />
      </div>
    </header>
  );
};

export default ChatHeader;
