const HealthTipCard = () => {
  return (
    <section className="rounded-3xl border border-[#e8dcc4] bg-gradient-to-r from-[#f3e7c8] to-[#e7d6ad] p-4 text-[#5a4516] shadow-[0_8px_22px_rgba(123,99,33,0.2)]">
      <p className="text-sm font-semibold tracking-wide">今日养生提醒</p>
      <p className="mt-2 text-sm leading-6">
        晚间建议 22:30 前休息，睡前可用温水泡脚 15 分钟，帮助舒缓神经与肩颈紧张。
      </p>
    </section>
  );
};

export default HealthTipCard;
