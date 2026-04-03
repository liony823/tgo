import { Brain, Leaf, Sparkles, Stethoscope } from 'lucide-react';

const skills = [
  { title: '草本医学', desc: '内在平衡', icon: Leaf },
  { title: '脉象诊断', desc: '辨证施治', icon: Stethoscope },
  { title: '神经调理', desc: '整体康复', icon: Brain },
  { title: '养生针灸', desc: '经络平衡', icon: Sparkles }
];

const SkillGrid = () => {
  return (
    <section className="mt-2 grid grid-cols-2 gap-3 px-4 sm:gap-4 sm:px-6">
      {skills.map(skill => {
        const Icon = skill.icon;
        return (
          <article key={skill.title} className="rounded-xl bg-[#f1ece3] p-4 shadow-sm sm:p-5">
            <Icon className="mb-3 text-[#7b6321]" size={22} />
            <h3 className="text-[clamp(0.95rem,3.2vw,1.1rem)] font-bold text-[#3f372b]">
              {skill.title}
            </h3>
            <p className="mt-1 text-[clamp(0.82rem,2.8vw,0.95rem)] text-[#6f6452]">
              {skill.desc}
            </p>
          </article>
        );
      })}
    </section>
  );
};

export default SkillGrid;
