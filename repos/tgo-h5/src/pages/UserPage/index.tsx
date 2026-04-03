import TabBar from '../HomePage/components/TabBar';
import HealthTipCard from './components/HealthTipCard';
import ProfileCard from './components/ProfileCard';
import QuickActions from './components/QuickActions';
import SettingList from './components/SettingList';
import UserHeader from './components/UserHeader';

/**
 * 个人中心首页：聚合用户卡片、快捷入口与设置列表。
 */
const UserPage = () => {
  return (
    <div className="min-h-screen bg-[#f5f1ea]">
      <UserHeader />

      <main className="mx-auto w-full max-w-md space-y-4 px-4 pb-24 pt-20">
        <ProfileCard />
        <QuickActions />
        <HealthTipCard />
        <SettingList />
      </main>

      <TabBar activeTab="profile" />
    </div>
  );
};

export default UserPage;
