import { Bell, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#eadfcb] bg-[#fcf9f0]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-md items-center justify-between px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="返回"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#6f5318] transition active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>

        <h1 className="text-xl font-semibold tracking-wide text-[#6f5318]">个人中心</h1>

        <button
          type="button"
          aria-label="消息通知"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#6f5318] transition active:scale-95"
        >
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
};

export default UserHeader;
