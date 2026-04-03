import { BadgeCheck, Circle } from 'lucide-react';
import type { Doctor } from '../doctor';

interface Props {
  doctor: Doctor;
}

const DoctorInfoCard = ({ doctor }: Props) => {
  const isOnline = doctor.status === 'online';

  return (
    <section className="rounded-2xl bg-[#f5f1ea] p-5 shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span
          className={[
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
            isOnline ? 'bg-[#e8f4e0] text-[#4d6633]' : 'bg-[#ece7dd] text-[#7f7562]'
          ].join(' ')}
        >
          <Circle size={8} fill="currentColor" />
          {isOnline ? '在线' : '离线'}
        </span>
        <p className="text-sm text-[#746a5b]">{doctor.title}</p>
      </div>

      <h2 className="text-4xl leading-tight font-bold text-[#6d5517]">
        {doctor.name}
        <span className="ml-2 text-3xl">({doctor.englishName})</span>
      </h2>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#efe8db] px-3 py-1.5 text-sm text-[#5d5243]">
          <BadgeCheck size={16} />
          {doctor.experienceLabel}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#efe8db] px-3 py-1.5 text-sm text-[#5d5243]">
          <BadgeCheck size={16} />
          {doctor.certificationLabel}
        </span>
      </div>
    </section>
  );
};

export default DoctorInfoCard;
