import { ArrowLeft, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeaderOverlay = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#e8dcc4]/70 bg-[#fcf9f0]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="返回"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#6f5318] transition active:scale-95"
        >
          <ArrowLeft size={22} />
        </button>

        <h1 className="text-xl font-semibold tracking-wide text-[#6f5318]">医生详情</h1>

        <button
          type="button"
          aria-label="分享"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#6f5318] transition active:scale-95"
        >
          <Share2 size={20} />
        </button>
      </div>
    </header>
  );
};

export default HeaderOverlay;
