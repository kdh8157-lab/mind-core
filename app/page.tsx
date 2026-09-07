'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function MainPlatform() {
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'USER' | 'COUNSELOR' | 'ADMIN'>('USER');

  const [currentTab, setCurrentTab] = useState<'COUNSELORS' | 'TESTS'>('COUNSELORS');
  const [counselors, setCounselors] = useState<any[]>([]);

  useEffect(() => {
    checkUser();
    fetchCounselors();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      setUser({ ...session.user, ...profile });
    }
  };

  const fetchCounselors = async () => {
    const { data, error } = await supabase.from('counselors').select('*');
    if (!error && data && data.length > 0) {
      setCounselors(data);
    } else {
      setCounselors([
        {
          id: '1',
          name: '김마음 상담사',
          title: '한국상담심리학회 1급 / 심리학 석사',
          chat_price: 40000,
          voice_price: 50000,
          video_price: 60000,
          rating: 4.9,
          reviews_count: 52
        },
        {
          id: '2',
          name: '이이해 상담사',
          title: '임상심리사 1급 / 경력 10년',
          chat_price: 45000,
          voice_price: 55000,
          video_price: 70000,
          rating: 5.0,
          reviews_count: 38
        }
      ]);
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
    alert('로그아웃되었습니다.');
  };

  return (
    <div style={{ backgroundColor: '#FAF9F6', minHeight: '100vh', fontFamily: 'sans-serif', color: '#1E293B' }}>
      {/* 헤더 */}
      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🌿</span>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#1B4332' }}>마인드케어</h1>
        </div>

        <div>
          {user ? (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#334155' }}>
                <b>{user.name || user.email}</b>님 ({user.role === 'ADMIN' ? '관리자' : user.role === 'COUNSELOR' ? '상담사' : '회원'})
              </span>
              <button onClick={handleLogout} style={{ backgroundColor: '#EF4444', color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>로그아웃</button>
            </div>
          ) : (
            <button onClick={() => setShowAuthModal(true)} style={{ backgroundColor: '#1B4332', color: '#FFF', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
              로그인 / 회원가입
            </button>
          )}
        </div>
      </header>

      {/* 메인 히어로 배너 */}
      <section style={{ backgroundColor: '#1E293B', color: '#FFF', padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', margin: '0 0 12px 0', fontWeight: 'bold' }}>지친 당신의 마음에 전하는 따뜻한 전문 상담</h2>
        <p style={{ margin: '0 auto', color: '#94A3B8', fontSize: '15px', maxWidth: '600px', lineHeight: '1.6' }}>
          보건복지부 / 학회 검증 전문가와 100% 비밀보장 1:1 상담.<br />
          앱 설치 없이 채팅 · 음성통화 · 화상 중 편한 방법으로 시작하세요.
        </p>
      </section>

      {/* 메인 컨텐츠 영역 */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '30px 16px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '2px solid #E2E8F0' }}>
          <button onClick={() => setCurrentTab('COUNSELORS')} style={{ padding: '12px 20px', border: 'none', background: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', borderBottom: currentTab === 'COUNSELORS' ? '3px solid #2D6A4F' : 'none', color: currentTab === 'COUNSELORS' ? '#2D6A4F' : '#94A3B8' }}>
            전문 심리상담사 ({counselors.length})
          </button>
          <button onClick={() => setCurrentTab('TESTS')} style={{ padding: '12px 20px', border: 'none', background: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', borderBottom: currentTab === 'TESTS' ? '3px solid #2D6A4F' : 'none', color: currentTab === 'TESTS' ? '#2D6A4F' : '#94A3B8' }}>
            유료 심리검사 (TCI/자가진단)
          </button>
        </div>

        {currentTab === 'COUNSELORS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {counselors.map((c) => (
              <div key={c.id} style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 'bold' }}>{c.name}</h3>
                  <p style={{ margin: '0 0 12px 0', color: '#64748B', fontSize: '13px' }}>{c.title}</p>
                  <span style={{ fontSize: '13px', color: '#475569' }}>★ <b>{c.rating || 5.0}</b> ({c.reviews_count || 0}개 후기)</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => alert('채팅 상담 결제 모듈이 진행됩니다.')} style={{ backgroundColor: '#2D6A4F', color: '#FFF', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                    💬 채팅상담 ({c.chat_price?.toLocaleString()}원)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentTab === 'TESTS' && (
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>TCI 정식 기질/성격검사 + 1:1 해석</h3>
            <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '16px' }}>검증된 전문가 자격 기반 정식 TCI 검사코드 발급 및 30분 해석 상담 연계</p>
            <button onClick={() => alert('검사 결제가 진행됩니다.')} style={{ backgroundColor: '#1B4332', color: '#FFF', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
              35,000원 결제하고 검사 시작
            </button>
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
