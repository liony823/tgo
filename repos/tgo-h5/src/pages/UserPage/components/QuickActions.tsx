import { ClipboardList, MapPinHouse, ReceiptText, Star } from 'lucide-react';

const quickActions = [
  { key: 'records', label: '问诊记录', icon: ClipboardList },
  { key: 'favorites', label: '收藏医生', icon: Star },
  { key: 'coupon', label: '我的优惠券', icon: ReceiptText },
  { key: 'address', label: '地址管理', icon: MapPinHouse }
];

const QuickActions = () => {
  return (
    <section className="grid grid-cols-2 gap-3">
      {quickActions.map(item => {
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-[#eadfcb] bg-[#fffdf8] px-4 py-4 text-left shadow-[0_4px_14px_rgba(93,73,35,0.06)] transition active:scale-[0.99]"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2e7c9] text-[#7b6321]">
              <Icon size={18} />
            </span>
            <span className="text-sm font-medium text-[#4f4333]">{item.label}</span>
          </button>
        );
      })}
    </section>
  );
};

export default QuickActions;
