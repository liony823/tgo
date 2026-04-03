import { ChevronRight, KeyRound, Link2, ShieldCheck } from 'lucide-react';

// 安全设置项静态配置：用于渲染账号安全列表。
const securityItems = [
  { key: 'password', label: '登录密码', desc: '建议定期更新密码', icon: KeyRound },
  { key: 'privacy', label: '隐私权限', desc: '管理通知与授权', icon: ShieldCheck },
  { key: 'binding', label: '账号绑定', desc: '微信 / 手机号', icon: Link2 }
];

/**
 * 账号安全区块：展示密码、隐私与绑定等入口。
 */
const AccountSecuritySection = () => {
  return (
    <section className="rounded-3xl border border-[#eadfcb] bg-[#fffdf8] p-2 shadow-[0_8px_24px_rgba(93,73,35,0.06)]">
      {securityItems.map(item => {
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            type="button"
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

export default AccountSecuritySection;
