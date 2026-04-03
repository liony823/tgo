import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BottomActionBar from './components/BottomActionBar';
import DoctorInfoCard from './components/DoctorInfoCard';
import HeaderOverlay from './components/HeaderOverlay';
import SkillGrid from './components/SkillGrid';
import { staffApi } from '@/services/staffApi';
import type { Doctor } from '@/types/doctor';

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80';


const DoctorInfoPage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void staffApi
      .getDoctorDetail(id)
      .then(data => {
        if (!cancelled) {
          setDoctor(data.data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setDoctor(null);
          setError(err instanceof Error ? err.message : '医生详情加载失败');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);
  
  if (!doctor) {
    return (
      <div className="min-h-screen bg-[#f5f1ea] px-4 py-20 text-[#2f261a]">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-[#eadfcb] bg-[#fffdf8] p-4 text-sm text-[#7a4a2a]">
          {error || '医生详情不存在或加载失败。'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f5f1ea] pb-24 pt-16 sm:pb-28">
      {error && (
        <div className="mx-auto mb-3 w-full max-w-md px-4">
          <p className="rounded-xl bg-[#f8e8d8] px-3 py-2 text-xs text-[#7a4a2a]">{error}</p>
        </div>
      )}
      <HeaderOverlay />

      <div className="relative">
        <img
          src={doctor.avatar_url}
          alt={doctor.name}
          className="min-h-64 max-h-88 w-full object-cover sm:h-88 md:h-96"
        />

        <div className="relative z-10 -mt-10 px-4 sm:-mt-12 sm:px-6">
          <DoctorInfoCard doctor={doctor} />
        </div>
      </div>

      <SkillGrid />

      <section className="mt-6 space-y-6 px-4 pb-6 sm:px-6">
        <article>
          <h3 className="mb-3 text-[clamp(1.2rem,4.2vw,1.6rem)] font-bold tracking-wide text-[#2f261a]">
            专业擅长
          </h3>
          <p className="text-[clamp(1rem,3.6vw,1.2rem)] leading-relaxed text-[#5d5345] sm:leading-8">
            {doctor.goodat}
          </p>
        </article>

        <article>
          <h3 className="mb-3 text-[clamp(1.2rem,4.2vw,1.6rem)] font-bold tracking-wide text-[#2f261a]">
            背景与理念
          </h3>
          <p className="text-[clamp(1rem,3.6vw,1.2rem)] leading-relaxed text-[#5d5345] sm:leading-8">
            {doctor.title + doctor.hospital}
          </p>
        </article>

        {/* <div className="flex flex-wrap gap-2">
          {doctor.focusTags.map(tag => (
            <span
              key={tag}
              className="rounded-full bg-[#7da56a] px-4 py-1.5 text-[clamp(0.75rem,2.8vw,0.9rem)] font-medium text-[#1f3a20]"
            >
              {tag}
            </span>
          ))}
        </div> */}
      </section>

      <BottomActionBar doctor={doctor} />
    </div>
  );
};

export default DoctorInfoPage;
