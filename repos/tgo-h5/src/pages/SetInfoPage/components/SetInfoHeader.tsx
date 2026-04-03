import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * 设置页顶部导航栏：提供返回按钮与标题。
 */
const SetInfoHeader = () => {
  // 路由 hook：处理返回上一级页面。
  const navigate = useNavigate();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#eadfcb] bg-[#fcf9f0]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-md items-center px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="返回"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#6f5318] transition active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="flex-1 text-center text-xl font-semibold tracking-wide text-[#6f5318]">个人资料</h1>
        <span className="h-9 w-9" />
      </div>
    </header>
  );
};

export default SetInfoHeader;
