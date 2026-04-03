import { Stethoscope, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type TabKey = 'doctor' | 'profile';

interface TabBarProps {
  activeTab: TabKey;
}

const TabBar = ({ activeTab }: TabBarProps) => {
  const navigate = useNavigate();
  const tabs: Array<{ key: TabKey; label: string; icon: typeof Stethoscope }> = [
    { key: 'doctor', label: '名医馆', icon: Stethoscope },
    { key: 'profile', label: '个人中心', icon: User }
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-[#e9e2d4] bg-white">
      <div className="mx-auto flex h-16 w-full max-w-md items-center justify-around px-4">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                if (tab.key === activeTab) return;
                if (tab.key === 'profile') {
                  navigate('/user');
                  return;
                }
                navigate('/');
              }}
              className={[
                'flex flex-col items-center gap-1 text-xs transition-all',
                isActive ? 'text-yellow-700' : 'text-[#8a8479]'
              ].join(' ')}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </footer>
  );
};

export default TabBar;
