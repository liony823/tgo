import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  onAvatarClick: () => void;
}

const Header = ({ onMenuClick, onAvatarClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fcf9f0]/80   backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-md items-center justify-between px-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#6f5318] transition-all active:scale-95"
          aria-label="打开菜单"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-xl font-semibold tracking-wide text-[#6f5318]">继中堂大健康</h1>
        <button
          type="button"
          onClick={onAvatarClick}
          className="h-10 w-10 overflow-hidden rounded-full border border-[#e8dcc4] shadow-sm transition-all active:scale-95"
          aria-label="个人中心"
        >
          <img
            src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?auto=format&fit=crop&w=120&q=80"
            alt="用户头像"
            className="h-full w-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
