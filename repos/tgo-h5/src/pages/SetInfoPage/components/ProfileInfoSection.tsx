import { ChevronRight } from 'lucide-react';

// 个人资料静态展示项：用于渲染可编辑信息入口。
const infoItems = [
  { key: 'nickname', label: '昵称', value: '李安宁' },
  { key: 'phone', label: '手机号', value: '138****8899' },
  { key: 'gender', label: '性别', value: '女' },
  { key: 'birthday', label: '生日', value: '1995-08-12' },
  { key: 'region', label: '地区', value: '浙江 杭州' }
];

/**
 * 个人资料区块：展示头像与基础资料信息。
 */
const ProfileInfoSection = () => {
  return (
    <section className="rounded-3xl border border-[#eadfcb] bg-[#fffdf8] p-4 shadow-[0_8px_24px_rgba(93,73,35,0.06)]">
      <div className="mb-4 flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80"
          alt="用户头像"
          className="h-16 w-16 rounded-2xl border border-[#eadfcb] object-cover"
        />
        <div>
          <p className="text-lg font-semibold text-[#6f5318]">李安宁</p>
          <p className="text-xs text-[#8b7d65]">中医调理会员</p>
        </div>
      </div>

      <div className="space-y-1">
        {infoItems.map(item => (
          <button
            key={item.key}
            type="button"
            className="flex w-full items-center justify-between rounded-xl px-2 py-2.5 text-left transition hover:bg-[#faf6ee] active:scale-[0.99]"
          >
            <span className="text-sm text-[#6f5f46]">{item.label}</span>
            <span className="flex items-center gap-2 text-sm text-[#8b7d65]">
              {item.value}
              <ChevronRight size={16} />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ProfileInfoSection;
