const FooterCTA = () => {
  return (
    <section className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#3b352c]">寻找您的身心平衡之道</h2>
      <p className="mt-2 text-sm leading-6 text-[#6f6759]">
        通过体质测评了解当前状态，获取更适合您的调理建议与诊疗方向。
      </p>
      <button
        type="button"
        onClick={() => console.log('start test')}
        className="mt-4 w-full rounded-lg bg-yellow-700 px-4 py-3 text-sm font-medium text-white transition-all active:scale-[0.99]"
      >
        参与体质测评
      </button>
    </section>
  );
};

export default FooterCTA;
