'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const INITIAL_COUNSELORS = [
  {
    id: 'c1',
    name: '김마음 상담사',
    title: '한국상담심리학회 1급 / 심리학 석사',
    tags: ['#우울/불안', '#자존감', '#따뜻한공감'],
    status: 'ONLINE',
    chat_price: 40000,
    voice_price: 50000,
    video_price: 60000,
    rating: 4.9,
    reviews_count: 52,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'c2',
    name: '이이해 상담사',
    title: '임상심리사 1급 / 경력 10년',
    tags: ['#연애/부부', '#대인관계', '#명확한솔루션'],
    status: 'BUSY',
    chat_price: 45000,
    voice_price: 55000,
    video_price: 70000,
    rating: 5.0,
    reviews_count: 38,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=300'
  }
];

const PSYCH_TESTS = [
  {
    id: 't1',
    title: 'TCI 정식 기질/성격검사 + 1:1 해석',
    description: '검증된 전문가 자격 기반 정식 TCI 검사코드 발급 및 30분 해석 상담 연계',
    price: 35000,
    badge: '전문가 연계',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 't2',
    title: '자존감 & 종합 스트레스 자가 진단',
    description: '공공 표준 척도 기반 5분 설문 작성 후 시스템 즉시 결과 분석 리포트',
    price: 5000,
    badge: '즉시 리포트',
    image: 'https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?auto=format&fit=crop&q=80&w=400'
  }
];

const MOCK_SETTLEMENT = {
  totalSales: 1250000,
  history: [
    { id: 'S-101', date: '2026-09-04', type: '📹 화상상담 50분', user: '이**', amount: 60000, status: '정산대기' },
    { id: 'S-102', date: '2026-09-04', type: '💬 채팅상담 50분', user: '박**', amount: 40000, status: '정산대기' },
    { id: 'S-103', date: '2026-09-03', type: '📑 TCI 해석상담', user: '최**', amount: 35000, status: '정산대기' },
    { id: 'S-104', date: '2026-09-02', type: '📞 음성상담 50분', user: '정**', amount: 50000, status: '정산완료' }
  ]
};

export default function MainPlatform() {
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'USER' | 'COUNSELOR' | 'ADMIN'>('USER');

  const [currentTab, setCurrentTab] = useState<'COUNSELORS' | 'TESTS' | 'MY_PAGE' | 'APPLY' | 'ADMIN'>('COUNSELORS');
  const [counselors, setCounselors] = useState<any[]>(INITIAL_COUNSELORS);
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [myStatus, setMyStatus] = useState<'ONLINE' | 'BUSY' | 'OFFLINE'>('ONLINE');
  const [applyForm, setApplyForm] = useState({ name: '', title: '', category: '우울/불안' });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      const userData = { ...session.user, ...profile };
      setUser(userData);

      if (userData.role === 'COUNSELOR') setCurrentTab('MY_PAGE');
      else if (userData.role === 'ADMIN') setCurrentTab('ADMIN');
      else setCurrentTab('COUNSELORS');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return alert(`회원가입 실패: ${error.message}`);
      if (data.user) {
        await supabase.from('profiles').insert([{ id: data.user.id, email, name, role }]);
        alert('회원가입이 완료되었습니다! 로그인해 주세요.');
        setIsSignUp(false);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return alert(`로그인 실패: ${error.message}`);
      alert('로그인되었습니다.');
      setShowAuthModal(false);
      checkUser();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentTab('COUNSELORS');
    alert('로그아웃되었습니다.');
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newApp = { id: Date.now(), ...applyForm, status: 'PENDING' };
    setPendingApplications((prev) => [...prev, newApp]);
    alert('입점 신청서가 접수되었습니다. 관리자 심사 후 승인 처리됩니다.');
    setApplyForm({ name: '', title: '', category: '우울/불안' });
    setCurrentTab('COUNSELORS');
  };

  const handleApprove = (appId: number) => {
    const target = pendingApplications.find((a) => a.id === appId);
    if (target) {
      const newCounselor = {
        id: `c_${Date.now()}`,
        name: target.name,
        title: target.title,
        tags: [`#${target.category}`, '#검증완료'],
        status: 'ONLINE',
        chat_price: 40000,
        voice_price: 50000,
        video_price: 60000,
        rating: 5.0,
        reviews_count: 0,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
      };
      setCounselors((prev) => [...prev, newCounselor]);
      setPendingApplications((prev) => prev.filter((a) => a.id !== appId));
      alert(`${target.name} 상담사 입점이 승인되었습니다.`);
    }
  };

  const netPayout = MOCK_SETTLEMENT.totalSales * (1 - 0.18);

  return (
    <div style={{ backgroundColor: '#FAF9F6', minHeight: '100vh', fontFamily: 'sans-serif', color: '#1E293B' }}>
      <style>{`
        .counselor-card { display: flex; background-color: #FFF; border-radius: 16px; padding: 20px; border: 1px solid #E2E8F0; gap: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .btn-group { display: flex; gap: 8px; }
        .grid-dashboard { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .grid-tests { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 768px) {
          .counselor-card { flex-direction: column; align-items: center; text-align: center; }
          .btn-group { width: 100%; justify-content: space-between; }
          .btn-group button { flex: 1; padding: 10px 4px !important; text-align: center; }
          .grid-dashboard, .grid-tests { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* 헤더 */}
      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setCurrentTab('COUNSELORS')}>
          <span style={{ fontSize: '24px' }}>🌿</span>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#1B4332' }}>마인드케어</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <>
              {user.role === 'COUNSELOR' && (
                <button onClick={() => setCurrentTab('MY_PAGE')} style={{ backgroundColor: '#E0F2FE', color: '#0369A1', border: 'none', padding: '8px 14px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>💼 내 정산 대시보드</button>
              )}
              {user.role === 'ADMIN' && (
                <button onClick={() => setCurrentTab('ADMIN')} style={{ backgroundColor: '#FEF3C7', color: '#92400E', border: 'none', padding: '8px 14px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>👑 입점 심사 관리자</button>
              )}
              {user.role === 'USER' && (
                <button onClick={() => setCurrentTab('APPLY')} style={{ backgroundColor: '#F1F5F9', color: '#475569', border: 'none', padding: '8px 14px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>상담사 입점 신청</button>
              )}
              <span style={{ fontSize: '14px', color: '#334155' }}>
                <b>{user.name || user.email}</b>님 ({user.role === 'ADMIN' ? '관리자' : user.role === 'COUNSELOR' ? '상담사' : '회원'})
              </span>
              <button onClick={handleLogout} style={{ backgroundColor: '#EF4444', color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>로그아웃</button>
            </>
          ) : (
            <>
              <button onClick={() => setCurrentTab('APPLY')} style={{ backgroundColor: '#F1F5F9', color: '#475569', border: 'none', padding: '8px 14px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>상담사 입점 신청</button>
              <button onClick={() => setShowAuthModal(true)} style={{ backgroundColor: '#1B4332', color: '#FFF', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                로그인 / 회원가입
              </button>
            </>
          )}
        </div>
      </header>

      {/* 메인 비주얼 영역 */}
      <section style={{ backgroundColor: '#1E293B', color: '#FFF', padding: '50px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '26px', margin: '0 0 12px 0', fontWeight: 'bold' }}>지친 당신의 마음에 전하는 따뜻한 전문 상담</h2>
        <p style={{ margin: '0 auto', color: '#94A3B8', fontSize: '15px', maxWidth: '600px', lineHeight: '1.6' }}>
          보건복지부 / 학회 검증 전문가와 100% 비밀보장 1:1 상담.<br />
          앱 설치 없이 채팅 · 음성통화 · 화상 중 편한 방법으로 시작하세요.
        </p>
      </section>

      {/* 메인 컨텐츠 */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '30px 16px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '2px solid #E2E8F0', overflowX: 'auto' }}>
          <button onClick={() => setCurrentTab('COUNSELORS')} style={{ padding: '12px 20px', border: 'none', background: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', borderBottom: currentTab === 'COUNSELORS' ? '3px solid #2D6A4F' : 'none', color: currentTab === 'COUNSELORS' ? '#2D6A4F' : '#94A3B8' }}>
            전문 심리상담사 ({counselors.length})
          </button>
          <button onClick={() => setCurrentTab('TESTS')} style={{ padding: '12px 20px', border: 'none', background: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', borderBottom: currentTab === 'TESTS' ? '3px solid #2D6A4F' : 'none', color: currentTab === 'TESTS' ? '#2D6A4F' : '#94A3B8' }}>
            유료 심리검사 (TCI/자가진단)
          </button>
        </div>

        {currentTab === 'COUNSELORS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {counselors.map((c) => (
              <div key={c.id} className="counselor-card">
                <div style={{ position: 'relative' }}>
                  <img src={c.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'} alt={c.name} style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #D8F3DC' }} />
                  <span style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#1B4332', color: '#FFF', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>🛡️ 검증</span>
                </div>
                
                <div style={{ flex: 1, width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{c.name}</h3>
                    {c.status === 'ONLINE' && <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px' }}>🟢 지금 상담가능</span>}
                    {c.status === 'BUSY' && <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px' }}>🟡 상담 진행 중</span>}
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748B' }}>{c.title}</p>
                  
                  {c.tags && (
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                      {c.tags.map((tag: string, i: number) => (
                        <span key={i} style={{ backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', padding: '2px 8px', borderRadius: '6px', fontSize: '12px' }}>{tag}</span>
                      ))}
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#475569' }}>★ <b style={{ color: '#0F172A' }}>{c.rating || 5.0}</b> ({c.reviews_count || 0}개 후기)</span>
                    <div className="btn-group">
                      <button onClick={() => alert(`💬 채팅상담 (${(c.chat_price/10000)}만원) 결제창으로 이동합니다.`)} style={{ backgroundColor: '#2D6A4F', color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                        💬 채팅 ({c.chat_price / 10000}만)
                      </button>
                      <button onClick={() => alert(`📞 음성상담 (${(c.voice_price/10000)}만원) 결제창으로 이동합니다.`)} style={{ backgroundColor: '#0284C7', color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                        📞 음성 ({c.voice_price / 10000}만)
                      </button>
                      <button onClick={() => alert(`📹 화상상담 (${(c.video_price/10000)}만원) 결제창으로 이동합니다.`)} style={{ backgroundColor: '#1B4332', color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                        📹 화상 ({c.video_price / 10000}만)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentTab === 'TESTS' && (
          <div className="grid-tests">
            {PSYCH_TESTS.map((t) => (
              <div key={t.id} style={{ backgroundColor: '#FFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                  <img src={t.image} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#1E1B4B', color: '#EEF2FF', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>{t.badge}</span>
                </div>
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 'bold' }}>{t.title}</h3>
                    <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748B' }}>{t.description}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2D6A4F' }}>{t.price.toLocaleString()}원</span>
                    <button onClick={() => alert('검사 결제가 진행됩니다.')} style={{ backgroundColor: '#1B4332', color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>검사 결제하기</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 상담사 전용 정산 대시보드 */}
        {currentTab === 'MY_PAGE' && user?.role === 'COUNSELOR' && (
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>💼 상담사 수익 및 정산 대시보드</h3>
                <span style={{ fontSize: '12px', color: '#64748B' }}>실시간 입금 정산 현황</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>상태 설정:</span>
                <select value={myStatus} onChange={(e: any) => setMyStatus(e.target.value)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 'bold' }}>
                  <option value="ONLINE">🟢 상담 가능</option>
                  <option value="BUSY">🟡 상담 중</option>
                  <option value="OFFLINE">🔴 부재 중</option>
                </select>
              </div>
            </div>

            <div className="grid-dashboard">
              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '12px', color: '#64748B' }}>총 발생 매출액</span>
                <h4 style={{ margin: '8px 0 0 0', fontSize: '20px', color: '#0F172A', fontWeight: 'bold' }}>{MOCK_SETTLEMENT.totalSales.toLocaleString()} 원</h4>
              </div>
              <div style={{ backgroundColor: '#FEF2F2', padding: '16px', borderRadius: '12px', border: '1px solid #FECACA' }}>
                <span style={{ fontSize: '12px', color: '#991B1B' }}>수수료 (18%)</span>
                <h4 style={{ margin: '8px 0 0 0', fontSize: '20px', color: '#991B1B', fontWeight: 'bold' }}>-{(MOCK_SETTLEMENT.totalSales * 0.18).toLocaleString()} 원</h4>
              </div>
              <div style={{ backgroundColor: '#F0FDF4', padding: '16px', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                <span style={{ fontSize: '12px', color: '#166534', fontWeight: 'bold' }}>💳 이번 달 입금 예정액</span>
                <h4 style={{ margin: '8px 0 0 0', fontSize: '22px', color: '#15803D', fontWeight: 'bold' }}>{netPayout.toLocaleString()} 원</h4>
              </div>
            </div>
          </div>
        )}

        {/* 입점 신청 */}
        {currentTab === 'APPLY' && (
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', fontWeight: 'bold' }}>📝 심리상담사 입점 신청</h3>
            <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="text" placeholder="성함" required value={applyForm.name} onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }} />
              <input type="text" placeholder="대표 자격 및 학위 (예: 한국상담심리학회 1급 / 석사)" required value={applyForm.title} onChange={(e) => setApplyForm({ ...applyForm, title: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }} />
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 'bold' }}>자격증 사본 / 학위 증명서 파일 첨부:</p>
              <input type="file" required style={{ padding: '4px', fontSize: '13px' }} />
              <button type="submit" style={{ backgroundColor: '#2D6A4F', color: '#FFF', padding: '14px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>입점 신청서 제출하기</button>
            </form>
          </div>
        )}

        {/* 관리자 심사 */}
        {currentTab === 'ADMIN' && user?.role === 'ADMIN' && (
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', fontWeight: 'bold' }}>👑 관리자 입점 심사 대시보드</h3>
            {pendingApplications.length === 0 ? (
              <p style={{ color: '#94A3B8', marginTop: '20px', fontSize: '14px' }}>현재 심사 대기 중인 신청 건이 없습니다.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                {pendingApplications.map((app) => (
                  <div key={app.id} style={{ padding: '16px', border: '1px solid #E2E8F0', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>{app.name}</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>{app.title}</p>
                    </div>
                    <button onClick={() => handleApprove(app.id)} style={{ backgroundColor: '#2D6A4F', color: '#FFF', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>승인하기</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 로그인/회원가입 팝업 모달 */}
      {showAuthModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFF', padding: '32px', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', position: 'relative' }}>
            <button onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' }}>✕</button>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '22px', fontWeight: 'bold', color: '#1B4332' }}>
              {isSignUp ? '회원가입' : '로그인'}
            </h3>
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {isSignUp && (
                <>
                  <input type="text" placeholder="이름" required value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }} />
                  <select value={role} onChange={(e: any) => setRole(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 'bold', fontSize: '14px' }}>
                    <option value="USER">일반 회원 가입</option>
                    <option value="COUNSELOR">심리상담사 가입</option>
                    <option value="ADMIN">관리자 가입</option>
                  </select>
                </>
              )}
              <input type="email" placeholder="이메일 주소" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }} />
              <input type="password" placeholder="비밀번호" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }} />
              <button type="submit" style={{ backgroundColor: '#2D6A4F', color: '#FFF', padding: '14px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', marginTop: '6px' }}>
                {isSignUp ? '가입 완료' : '로그인'}
              </button>
            </form>
            <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: 'none', border: 'none', color: '#0284C7', cursor: 'pointer', marginTop: '16px', fontSize: '13px', width: '100%', textAlign: 'center' }}>
              {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
