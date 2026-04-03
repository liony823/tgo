import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountSecuritySection from './components/AccountSecuritySection';
import LogoutCard from './components/LogoutCard';
import ProfileInfoSection from './components/ProfileInfoSection';
import SetInfoHeader from './components/SetInfoHeader';
import { mockLogout } from './mock';

/**
 * 个人资料设置页：展示资料信息、安全设置与退出登录入口。
 */
const SetInfoPage = () => {
  // 路由跳转：退出后重定向到登录页。
  const navigate = useNavigate();
  // 退出流程状态：防止重复点击触发并发退出。
  const [loggingOut, setLoggingOut] = useState(false);

  // 退出登录方法：模拟请求后清理本地登录态并跳转登录页。
  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    try {
      await mockLogout();
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      sessionStorage.removeItem('token');
      navigate('/login', { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea]">
      <SetInfoHeader />

      <main className="mx-auto w-full max-w-md space-y-4 px-4 pb-10 pt-20">
        <ProfileInfoSection />
        <AccountSecuritySection />
        <LogoutCard loading={loggingOut} onLogout={handleLogout} />
      </main>
    </div>
  );
};

export default SetInfoPage;
