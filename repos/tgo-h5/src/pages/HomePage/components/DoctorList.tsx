import type { Doctor } from '@/types/doctor';
import DoctorCard from './DoctorCard';

interface DoctorListProps {
  doctorList: Doctor[];
  loading: boolean;
}

const SkeletonCard = () => {
  return (
    <div className="flex gap-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="h-24 w-24 animate-pulse rounded-lg bg-[#ece6d8]" />
      <div className="flex-1 space-y-3">
        <div className="h-6 w-28 animate-pulse rounded bg-[#ece6d8]" />
        <div className="h-4 w-20 animate-pulse rounded bg-[#ece6d8]" />
        <div className="h-4 w-full animate-pulse rounded bg-[#ece6d8]" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-[#ece6d8]" />
      </div>
    </div>
  );
};

const DoctorList = ({ doctorList, loading }: DoctorListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (!doctorList.length) {
    return (
      <div className="rounded-xl bg-white p-8 text-center text-[#7a7366] shadow-sm">
        暂无医生数据
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {doctorList.map((doctor, index) => (
        <DoctorCard
          key={`${doctor.tgo_staff_id || doctor.ID || 'doctor'}-${index}`}
          doctor={doctor}
        />
      ))}
    </div>
  );
};

export default DoctorList;
