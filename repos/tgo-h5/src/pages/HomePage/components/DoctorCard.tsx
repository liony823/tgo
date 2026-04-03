import { ChevronRight } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import type { Doctor } from '@/types/doctor';

interface DoctorCardProps {
  doctor: Doctor;
}

function formatDoctorIntro(content: string): string {
  if (!content) return '';

  try {
    const htmlDoc = new DOMParser().parseFromString(content, 'text/html');
    const plainText = htmlDoc.body.textContent ?? '';
    return plainText.replace(/\s+/g, ' ').trim();
  } catch {
    return content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const navigate = useNavigate();
  const isOnline = doctor.tgo_staff_status === 'online';
  const parsedContent = formatDoctorIntro(doctor.content);
  const introText = parsedContent || doctor.goodat || '';

  return (
    <article
      className="flex gap-4 rounded-xl bg-white p-4 shadow-sm transition-all active:scale-[0.99]"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/doctor/${doctor.ID}`)}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          navigate(`/doctor/${doctor.ID}`);
        }
      }}
    >
      <img
        src={doctor.avatar_url}
        alt={doctor.name}
        className={[
          'h-24 w-24 rounded-lg object-cover transition-all',
          isOnline ? 'grayscale-0' : 'grayscale',
        ].join(' ')}
      />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-2xl font-semibold text-[#2d2b28]">
                {doctor.name}
                <span className="ml-1 text-xl">医师</span>
              </p>
              <p className="mt-1 text-sm text-[#6d6457]">{doctor.title}</p>
            </div>
            <span
              className={[
                'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                doctor.tgo_staff_status !== 'offline' ? 'bg-[#e8f5e6] text-[#2f7c2b]' : 'bg-[#efefec] text-[#78756e]'
              ].join(' ')}
            >
              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current" />
              { doctor.tgo_staff_status !== 'offline' ? '在线' : '离线'}
            </span>
          </div>

        <p className="mt-2 line-clamp-3 text-base leading-7 text-[#4f493f]">{introText}</p>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {/* {doctor.tags.map(tag => (
              <span key={tag} className="rounded-full bg-[#eef4e5] px-2 py-1 text-xs text-[#5e6d3a]">
                {tag}
              </span>
            ))} */}
            </div>
            <ChevronRight className="shrink-0 text-yellow-700" size={24} />
          </div>
        </div>
      </article>
  );
};

export default DoctorCard;
