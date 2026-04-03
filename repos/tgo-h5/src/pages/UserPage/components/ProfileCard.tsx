const ProfileCard = () => {
  return (
    <section className="rounded-3xl border border-[#eadfcb] bg-[#fffdf8] p-4 shadow-[0_8px_24px_rgba(93,73,35,0.08)]">
      <div className="flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80"
          alt="用户头像"
          className="h-16 w-16 rounded-2xl border border-[#eadfcb] object-cover"
        />
        <div className="flex-1">
          <p className="text-lg font-semibold tracking-wide text-[#6f5318]">李安宁</p>
          <p className="text-sm text-[#8a7b62]">会员编号：YL20260325001</p>
          <div className="mt-2 flex gap-2">
            <span className="rounded-full bg-[#f2e7c9] px-2.5 py-1 text-xs font-medium text-[#7b6321]">体质调理中</span>
            <span className="rounded-full bg-[#e8f1df] px-2.5 py-1 text-xs font-medium text-[#4d7a3c]">问诊权益有效</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;
