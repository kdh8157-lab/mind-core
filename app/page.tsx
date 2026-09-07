'use client';

import React, { useState } from 'react';

const INITIAL_COUNSELORS = [
  {
    id: 'c1',
    name: '김마음 상담사',
    title: '한국상담심리학회 1급 / 심리학 석사',
    tags: ['#우울/불안', '#자존감', '#따뜻한공감'],
    status: 'ONLINE',
    chatPrice: 40000,
    voicePrice: 50000,
    videoPrice: 60000,
    rating: 4.9,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'c2',
    name: '이이해 상담사',
    title: '임상심리사 1급 / 경력 10년',
    tags: ['#연애/부부', '#대인관계', '#명확한솔루션'],
    status: 'BUSY',
    chatPrice: 45000,
    voicePrice: 55000,
    videoPrice: 70000,
    rating: 5.0,
    reviewsCount: 38,
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

const MOCK_COUNSELOR_SETTLEMENT = {
  counselorName: '김마음 상담사',
  period: '2026년 정산 내역',
  totalSales: 1250000,
  platformFeeRate: 0.15,
  pgFeeRate: 0.03,
  completedCount: 24,
  history: [
    { id: 'S-101', date: '2026-09-04', type: '📹 화상상담 50분', user: '이**', amount: 60000, status: '정산대기' },
    { id: 'S-102', date: '2026-09-04', type: '💬 채팅상담 50분', user: '박**', amount: 40000, status: '정산대기' },
    { id: 'S-103', date: '2026-09-03', type: '📑 TCI 해석상담', user: '최**', amount: 35000, status: '정산대기' },
    { id: 'S-104', date: '2026-09-02', type: '📞 음성상담 50분', user: '정**', amount: 50000, status: '정산완료' }
  ]
};

export default function MainPlatform() {
  const [currentTab, setCurrentTab] = useState<'COUNSELORS' | 'TESTS' | 'MY_PAGE' | 'APPLY' | 'ADMIN'>('COUNSELORS');
  const [counselors, setCounselors] = useState(INITIAL_COUNSELORS);
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [myStatus, setMyStatus] = useState<'ONLINE' | 'BUSY' | 'OFFLINE'>('ONLINE');

  const [activeConsultation, setActiveConsultation] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: '상담사', text: '안녕하세요. 오늘 어떤 고민으로 찾아오셨나요? 편안하게 말씀해 주세요.' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [applyForm, setApplyForm] = useState({ name: '', title: '', category: '우울/불안' });

  const handleStartConsultation = (counselor: any, mode: 'CHAT' | 'VOICE' | 'VIDEO') => {
    const modeName = mode === 'CHAT' ? '채팅' : mode === 'VOICE' ? '음성통화' : '화상';
    alert(`${counselor.name}님과의 [${modeName} 상담] 결제가 완료되었습니다. 비밀 상담실로 이동합니다.`);
    setActiveConsultation({ counselor, mode });
  };

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;
    setChatMessages((prev) => [...prev, { sender: '나', text: inputMsg }]);
    setInputMsg('');
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newApp = { id: Date.now(), ...applyForm, status: 'PENDING' };
    setPendingApplications((prev) => [...prev, newApp]);
    alert('입점 신청서가 정상 접수되었습니다. 사장님 심사 페이지에서 승인하실 수 있습니다.');
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
        chatPrice: 40000,
        voicePrice: 50000,
        videoPrice: 60000,
        rating: 5.0,
        reviewsCount: 0,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
      };
      setCounselors((prev) => [...prev, newCounselor]);
      setPendingApplications((prev) => prev.filter((a) => a.id !== appId));
      alert(`${target.name} 상담사 입점이 승인되었습니다.`);
    }
  };

  const totalSales = MOCK_COUNSELOR_SETTLEMENT.totalSales;
  const platformFee = totalSales * MOCK_COUNSELOR_SETTLEMENT.platformFeeRate;
  const pgFee = totalSales * MOCK_COUNSELOR_SETTLEMENT.pgFeeRate;
  const netPayout = totalSales - platformFee - pgFee;

  if (activeConsultation) {
    const modeLabel = activeConsultation.mode === 'CHAT' ? '💬 채팅' : activeConsultation.mode === 'VOICE' ? '📞 음성통화' : '📹 화상';
    return (
      <div style={{ backgroundColor: '#FAF9F6', minHeight: '100vh', padding: '12px', fontFamily: 'sans-serif' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1B4332', color: '#FFF', padding: '14px 20px', borderRadius: '12px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', margin: 0, fontWeight: 'bold' }}>🔒 비밀 {modeLabel} 상담실 ({activeConsultation.counselor.name})</h2>
          <button onClick={() => setActiveConsultation(null)} style={{ backgroundColor: '#DC2626', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>상담 종료</button>
        </header>

        {activeConsultation.mode === 'VIDEO' && (
          <div className="responsive-video-grid" style={{ height: 'calc(100vh - 120px)' }}>
            <div style={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '16px', padding: '20px' }}>
              <img src={activeConsultation.counselor.image} alt="상담사" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px', border: '3px solid #2D6A4F' }} />
              <p style={{ margin: 0, fontWeight: 'bold' }}>📹 {activeConsultation.counselor.name} 화상 화면</p>
            </div>
            <div style={{ backgroundColor: '#334155', color: '#FFF', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px', padding: '20px' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>📹 내 카메라 화면 (작동 중)</p>
            </div>
          </div>
        )}

        {activeConsultation.mode === 'VOICE' && (
          <div style={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '12px', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px' }}>
            <img src={activeConsultation.counselor.image} alt="상담사" style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', marginBottom: '20px', border: '4px solid #2D6A4F' }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: 'bold' }}>{activeConsultation.counselor.name}님과 음성 통화 중</h3>
            <p style={{ color: '#94A3B8', margin: 0, fontSize: '14px' }}>마이크가 연결되었습니다. 편안한 장소에서 대화하세요.</p>
          </div>
        )}

        {activeConsultation.mode === 'CHAT' && (
          <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E2E8F0', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ textAlign: msg.sender === '나' ? 'right' : 'left', marginBottom: '12px' }}>
                  <span style={{ display: 'inline-block', backgroundColor: msg.sender === '나' ? '#D8F3DC' : '#F1F5F9', color: '#1B4332', padding: '10px 16px', borderRadius: '16px', maxWidth: '80%', fontSize: '14px', lineHeight: '1.5' }}>
                    <b>{msg.sender}:</b> {msg.text}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', padding: '12px', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="고민을 자유롭게 작성해 보세요..."
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', marginRight: '8px', fontSize: '14px' }}
              />
              <button onClick={handleSendMessage} style={{ backgroundColor: '#2D6A4F', color: '#FFF', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>전송</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAF9F6', minHeight: '100vh', fontFamily: 'sans-serif', color: '#1E293B' }}>
      <style>{`
        .header-container { display: flex; justify-content: space-between; align-items: center; padding: 16px 32px; background-color: #FFFFFF; border-bottom: 1px solid #E2E8F0; }
        .hero-banner { 
          position: relative; 
          background-image: linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.55)), url('https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=1200');
          background-size: cover; 
          background-position: center; 
          color: #FFFFFF; 
          padding: 60px 20px; 
          text-align: center; 
          border-radius: 0 0 20px 20px;
        }
        .counselor-card { display: flex; background-color: #FFF; border-radius: 16px; padding: 20px; border: 1px solid #E2E8F0; gap: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .grid-tests { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .grid-dashboard { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .btn-group { display: flex; gap: 8px; }
        .responsive-video-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        @media (max-width: 768px) {
          .header-container { flex-direction: column; gap: 12px; align-items: flex-start; padding: 12px 16px; }
          .hero-banner { padding: 40px 16px; }
          .hero-banner h2 { font-size: 22px !important; }
          .counselor-card { flex-direction: column; align-items: center; text-align: center; }
          .grid-tests { grid-template-columns: 1fr; }
          .grid-dashboard { grid-template-columns: 1fr; }
          .btn-group { width: 100%; justify-content: space-between; }
          .btn-group button { flex: 1; padding: 10px 4px !important; text-align: center; }
          .responsive-video-grid { grid-template-columns: 1fr; height: auto !important; }
        }
      `}</style>

      <header className="header-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setCurrentTab('COUNSELORS')}>
          <span style={{ fontSize: '24px' }}>🌿</span>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#1B4332' }}>마인드케어</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setCurrentTab('MY_PAGE')} style={{ padding: '8px 14px', backgroundColor: '#E0F2FE', color: '#0369A1', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>💼 상담사 수익/정산</button>
          <button onClick={() => setCurrentTab('APPLY')} style={{ padding: '8px 14px', backgroundColor: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>입점 신청</button>
          <button onClick={() => setCurrentTab('ADMIN')} style={{ padding: '8px 14px', backgroundColor: '#1B4332', color: '#FFF', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>👑 심사 관리자</button>
        </div>
      </header>

      <section className="hero-banner">
        <h2 style={{ fontSize: '28px', margin: '0 0 12px 0', fontWeight: 'bold' }}>지친 당신의 마음에 전하는 따뜻한 전문 상담</h2>
        <p style={{ margin: '0 auto', color: '#E2E8F0', fontSize: '15px', maxWidth: '600px', lineHeight: '1.6' }}>
          보건복지부 / 학회 검증 전문가와 100% 비밀보장 1:1 상담.<br />
          앱 설치 없이 채팅 · 음성통화 · 화상 중 편한 방법으로 시작하세요.
        </p>
      </section>

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '2px solid #E2E8F0', overflowX: 'auto' }}>
          <button onClick={() => setCurrentTab('COUNSELORS')} style={{ padding: '12px 18px', border: 'none', background: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', borderBottom: currentTab === 'COUNSELORS' ? '3px solid #2D6A4F' : 'none', color: currentTab === 'COUNSELORS' ? '#2D6A4F' : '#94A3B8', whiteSpace: 'nowrap' }}>
            전문 심리상담사 ({counselors.length})
          </button>
          <button onClick={() => setCurrentTab('TESTS')} style={{ padding: '12px 18px', border: 'none', background: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', borderBottom: currentTab === 'TESTS' ? '3px solid #2D6A4F' : 'none', color: currentTab === 'TESTS' ? '#2D6A4F' : '#94A3B8', whiteSpace: 'nowrap' }}>
            유료 심리검사 (TCI/자가진단)
          </button>
        </div>

        {currentTab === 'COUNSELORS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {counselors.map((c) => (
              <div key={c.id} className="counselor-card">
                <div style={{ position: 'relative' }}>
                  <img src={c.image} alt={c.name} style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #D8F3DC' }} />
                  <span style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#1B4332', color: '#FFF', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>🛡️ 검증</span>
                </div>
                
                <div style={{ flex: 1, width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{c.name}</h3>
                    {c.status === 'ONLINE' && <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px' }}>🟢 지금 상담가능</span>}
                    {c.status === 'BUSY' && <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px' }}>🟡 상담 진행 중</span>}
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748B' }}>{c.title}</p>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    {c.tags.map((tag, i) => (
                      <span key={i} style={{ backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', padding: '2px 8px', borderRadius: '6px', fontSize: '12px' }}>{tag}</span>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#475569' }}>★ <b style={{ color: '#0F172A' }}>{c.rating}</b> ({c.reviewsCount}개 후기)</span>
                    <div className="btn-group">
                      <button onClick={() => handleStartConsultation(c, 'CHAT')} style={{ backgroundColor: '#2D6A4F', color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>💬 채팅 ({c.chatPrice / 10000}만)</button>
                      <button onClick={() => handleStartConsultation(c, 'VOICE')} style={{ backgroundColor: '#0284C7', color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>📞 음성 ({c.voicePrice / 10000}만)</button>
                      <button onClick={() => handleStartConsultation(c, 'VIDEO')} style={{ backgroundColor: '#1B4332', color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>📹 화상 ({c.videoPrice / 10000}만)</button>
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
                    <button onClick={() => alert('검사 결제 모듈이 진행됩니다.')} style={{ backgroundColor: '#1B4332', color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>검사 결제하기</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentTab === 'MY_PAGE' && (
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>💼 {MOCK_COUNSELOR_SETTLEMENT.counselorName} 대시보드</h3>
                <span style={{ fontSize: '12px', color: '#64748B' }}>{MOCK_COUNSELOR_SETTLEMENT.period}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>상태 변경:</span>
                <select value={myStatus} onChange={(e: any) => setMyStatus(e.target.value)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 'bold' }}>
                  <option value="ONLINE">🟢 상담 가능</option>
                  <option value="BUSY">🟡 상담 중</option>
                  <option value="OFFLINE">🔴 부재 중</option>
                </select>
              </div>
            </div>

            <div className="grid-dashboard">
              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '12px', color: '#64748B' }}>총 발생 매출액 ({MOCK_COUNSELOR_SETTLEMENT.completedCount}건)</span>
                <h4 style={{ margin: '8px 0 0 0', fontSize: '20px', color: '#0F172A', fontWeight: 'bold' }}>{totalSales.toLocaleString()} 원</h4>
              </div>
              <div style={{ backgroundColor: '#FEF2F2', padding: '16px', borderRadius: '12px', border: '1px solid #FECACA' }}>
                <span style={{ fontSize: '12px', color: '#991B1B' }}>플랫폼/PG 수수료 (18%)</span>
                <h4 style={{ margin: '8px 0 0 0', fontSize: '20px', color: '#991B1B', fontWeight: 'bold' }}>-{(platformFee + pgFee).toLocaleString()} 원</h4>
              </div>
              <div style={{ backgroundColor: '#F0FDF4', padding: '16px', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                <span style={{ fontSize: '12px', color: '#166534', fontWeight: 'bold' }}>💳 이번 달 입금 예정액</span>
                <h4 style={{ margin: '8px 0 0 0', fontSize: '22px', color: '#15803D', fontWeight: 'bold' }}>{netPayout.toLocaleString()} 원</h4>
              </div>
            </div>

            <h4 style={{ fontSize: '15px', margin: '20px 0 12px 0', fontWeight: 'bold' }}>📋 상세 진행 및 정산 내역</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '12px' }}>날짜</th>
                    <th style={{ padding: '12px' }}>상담 종류</th>
                    <th style={{ padding: '12px' }}>손님명</th>
                    <th style={{ padding: '12px' }}>결제금액</th>
                    <th style={{ padding: '12px' }}>정산상태</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_COUNSELOR_SETTLEMENT.history.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px' }}>{item.date}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.type}</td>
                      <td style={{ padding: '12px' }}>{item.user}</td>
                      <td style={{ padding: '12px' }}>{item.amount.toLocaleString()}원</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ backgroundColor: item.status === '정산완료' ? '#DCFCE7' : '#FEF3C7', color: item.status === '정산완료' ? '#15803D' : '#D97706', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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

        {currentTab === 'ADMIN' && (
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', fontWeight: 'bold' }}>👑 사장님(관리자) 심사 대시보드</h3>
            <p style={{ color: '#64748B', fontSize: '13px' }}>제출된 자격 증빙 서류를 검토 후 [승인]을 누르면 메인 화면에 즉시 정식 등록됩니다.</p>
            {pendingApplications.length === 0 ? (
              <p style={{ color: '#94A3B8', marginTop: '20px', fontSize: '14px' }}>현재 심사 대기 중인 신청 건이 없습니다.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                {pendingApplications.map((app) => (
                  <div key={app.id} style={{ padding: '16px', border: '1px solid #E2E8F0', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>{app.name}</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>{app.title}</p>
                      <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 'bold' }}>📄 증빙 서류 첨부됨</span>
                    </div>
                    <button onClick={() => handleApprove(app.id)} style={{ backgroundColor: '#2D6A4F', color: '#FFF', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>승인하기</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
