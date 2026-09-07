'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function MainPlatform() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'USER' | 'COUNSELOR' | 'ADMIN'>('USER');
  const [isSignUp, setIsSignUp] = useState(false);

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
        await supabase.from('profiles').insert([
          { id: data.user.id, email, name, role }
        ]);
        alert('실제 회원가입이 완료되었습니다! 로그인해 주세요.');
        setIsSignUp(false);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return alert(`로그인 실패: ${error.message}`);
      
      alert('로그인 성공!');
      checkUser();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    alert('로그아웃 되었습니다.');
  };

  return (
    <div style={{ backgroundColor: '#FAF9F6', minHeight: '100vh', fontFamily: 'sans-serif', color: '#1E293B' }}>
      <div style={{ backgroundColor: '#0F172A', color: '#FFF', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
        <span>🌿 마인드케어 실제 DB 연동 상태</span>
        <div>
          {user ? (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span><b>{user.name || user.email}</b>님 ({user.role === 'ADMIN' ? '👑 관리자' : user.role === 'COUNSELOR' ? '💼 상담사' : '👤 일반고객'})</span>
              <button onClick={handleLogout} style={{ backgroundColor: '#DC2626', color: '#FFF', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>로그아웃</button>
            </div>
          ) : (
            <span style={{ color: '#94A3B8' }}>로그인이 필요합니다.</span>
          )}
        </div>
      </div>

      <main style={{ maxWidth: '800px', margin: '20px auto', padding: '16px' }}>
        {!user && (
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>
              {isSignUp ? '📝 실제 회원가입 (DB 저장)' : '🔑 실제 로그인'}
            </h3>
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {isSignUp && (
                <>
                  <input type="text" placeholder="이름" required value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                  <select value={role} onChange={(e: any) => setRole(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 'bold' }}>
                    <option value="USER">👤 일반 고객으로 가입</option>
                    <option value="COUNSELOR">💼 심리상담사로 가입</option>
                    <option value="ADMIN">👑 서비스 관리자로 가입</option>
                  </select>
                </>
              )}
              <input type="email" placeholder="이메일 주소" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <input type="password" placeholder="비밀번호" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <button type="submit" style={{ backgroundColor: '#2D6A4F', color: '#FFF', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                {isSignUp ? '회원가입 완료하기' : '로그인하기'}
              </button>
            </form>
            <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: 'none', border: 'none', color: '#0284C7', cursor: 'pointer', marginTop: '12px', fontSize: '13px' }}>
              {isSignUp ? '이미 계정이 있으신가요? 로그인하기' : '계정이 없으신가요? 회원가입하기'}
            </button>
          </div>
        )}

        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>전문 심리상담사 목록</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {counselors.map((c) => (
            <div key={c.id} style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 'bold' }}>{c.name}</h4>
              <p style={{ margin: '0 0 12px 0', color: '#64748B', fontSize: '13px' }}>{c.title}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => alert('실제 PG 결제 모듈(포트원)과 연동될 예정입니다.')} style={{ backgroundColor: '#2D6A4F', color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                  💬 채팅상담 ({c.chat_price?.toLocaleString()}원)
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
