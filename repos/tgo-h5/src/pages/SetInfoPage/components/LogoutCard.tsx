/**
 * 退出卡片属性类型：用于控制按钮状态与退出事件。
 */
interface LogoutCardProps {
  loading: boolean;
  onLogout: () => void;
}

/**
 * 退出卡片组件：展示退出提示并触发退出回调。
 */
const LogoutCard = ({ loading, onLogout }: LogoutCardProps) => {
  return (
    <section className="rounded-3xl border border-[#edd5cf] bg-[#fff7f5] p-4 shadow-[0_8px_24px_rgba(143,61,36,0.06)]">
      <p className="text-sm text-[#7f5a4f]">退出后将清除当前本地登录状态（mock 模拟）</p>
      <button
        type="button"
        onClick={onLogout}
        disabled={loading}
        className="mt-3 w-full rounded-xl bg-[#b24a2e] px-4 py-3 text-sm font-semibold tracking-wide text-[#fff7f2] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? '退出中...' : '退出登录'}
      </button>
    </section>
  );
};

export default LogoutCard;
