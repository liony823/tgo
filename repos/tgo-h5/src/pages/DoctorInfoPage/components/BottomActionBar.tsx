import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Doctor } from '@/types/doctor';

/**
 * 进入问诊页时把所选医护的展示信息写入 route state，
 * 实际 IM 仍走访客注册返回的客服频道（与 tgo-widget 一致）。
 */
const BottomActionBar = ({ doctor }: { doctor: Doctor }) => {
  const navigate = useNavigate();
  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full bg-[#f5f1ea] p-4 flex gap-3 shadow-[0_-2px_18px_rgba(94,79,45,0.12)]">
      <button
        type="button"
        aria-label="消息"
        className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#efe7d9] text-[#7b6321] transition active:scale-95"
      >
        <MessageCircle size={24} />
      </button>

      <button
        onClick={() => {
          navigate({
            pathname: `/im/${doctor.ID}`,
            search: `?name=${doctor.name}&tgo_staff_id=${doctor.tgo_staff_id}&tgo_staff_status=${doctor.tgo_staff_status}`,
          });
        }}
        type="button"
        className="h-14 flex-1 rounded-xl bg-[#9b7b2f] px-4 text-xl font-semibold tracking-wide text-[#fff9ec] transition active:scale-[0.99]"
      >
        在线问诊
      </button>
    </footer>
  );
};

export default BottomActionBar;
