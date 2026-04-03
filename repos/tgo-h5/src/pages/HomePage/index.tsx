import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, PullRefresh } from 'react-vant';
import CategoryTabs from './components/CategoryTabs';
import DoctorList from './components/DoctorList';
import FooterCTA from './components/FooterCTA';
import Header from './components/Header';
import TabBar from './components/TabBar';
import { bizApi } from '@/services/biz';

import type { Doctor } from '@/types/doctor';
const categories = [];
const PAGE_SIZE = 10;

const DoctorListPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('全部');
  const [doctorList, setDoctorList] = useState<Doctor[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const loadDoctors = async (reset = false) => {
    if (loading) return;
    if (!reset && finished) return;

    setLoading(true);
    if (reset) {
      setFinished(false);
    }

    const targetPage = reset ? 1 : page;
    try {
      const result = await bizApi.getDoctorList({ page: targetPage, pageSize: PAGE_SIZE });
      setDoctorList(prev => (reset ? result.list : [...prev, ...result.list]));
      setPage(targetPage + 1);
      setFinished(!result.hasMore || result.list.length === 0);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载医生列表失败';
      setError(message);
      if (reset) {
        setDoctorList([]);
      }
      throw err;
    } finally {
      setLoading(false);
      if (reset) {
        setInitialLoading(false);
      }
    }
  };

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    void loadDoctors(true);
  }, []);

  const handleRefresh = async () => {
    setError(null);
    await loadDoctors(true);
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f5f1ea]">
      <Header
        onMenuClick={() => console.log('open menu')}
        onAvatarClick={() => navigate('/login')}
      />

      <main className="mx-auto h-full w-full max-w-md overflow-y-auto pb-20 pt-16">
        <section className="px-4 pt-6">
          <p className="text-lg font-semibold tracking-wide text-[#4b4233]">传世医术 妙手回春</p>
          <h2 className="mt-1 text-6xl leading-none font-bold text-[#7b6321]">名医馆</h2>
        </section>

        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />

        <div className="space-y-4 p-4">
          {error && (
            <p className="rounded-xl bg-[#f8e8d8] px-3 py-2 text-sm text-[#7a4a2a]">{error}</p>
          )}
          <PullRefresh
            onRefresh={handleRefresh}
            pullingText="下拉即可刷新..."
            loosingText="释放即可刷新..."
            loadingText="刷新中..."
            successText="刷新成功"
          >
            <List
              finished={finished}
              finishedText="没有更多了"
              errorText="加载失败，点击重试"
              onLoad={() => loadDoctors(false)}
            >
              <DoctorList doctorList={doctorList} loading={initialLoading} />
            </List>
          </PullRefresh>
          <FooterCTA />
        </div>
      </main>

      <TabBar activeTab="doctor" />
    </div>
  );
};

export default DoctorListPage;
