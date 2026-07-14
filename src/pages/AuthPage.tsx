import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/context';
import { Field } from '../components/Field';
import { ROUTES } from '../data/constants';
import * as v from '../utils/validation';
import Logo from '../assets/Logo.png'

export function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const { login, signup, authLoading } = useApp();
  const navigate = useNavigate();
  const isLogin = mode === 'login';

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [suUsername, setSuUsername] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const clearErr = (key: string) => setErrors((e) => ({ ...e, [key]: undefined }));

  function switchMode(next: 'login' | 'signup') {
    setErrors({});
    navigate(next === 'login' ? ROUTES.login : ROUTES.signup);
  }

  function submitLogin() {
    const next = {
      loginEmail: v.email(loginEmail),
      loginPassword: v.required(loginPassword, '비밀번호'),
    };
    setErrors(next);
    if (v.hasErrors(next)) return;
    login(loginEmail.trim(), loginPassword);
  }

  function submitSignup() {
    const next = {
      suUsername: v.required(suUsername, '아이디'),
      suEmail: v.email(suEmail),
      suPassword: v.password(suPassword),
    };
    setErrors(next);
    if (v.hasErrors(next)) return;
    signup({ username: suUsername.trim(), email: suEmail.trim(), password: suPassword });
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={Logo} alt="" style={{ width: '80px', height: '80px' }} />
          <div className="t1">예산대로</div>
          <div className="t2">가게 관리</div>
        </div>
        <div className="auth-tabs">
          <button className={isLogin ? 'active' : ''} onClick={() => switchMode('login')}>로그인</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => switchMode('signup')}>회원가입</button>
        </div>

        {isLogin ? (
          <>
            <Field label="이메일" error={errors.loginEmail}>
              <input
                type="email"
                placeholder="owner@example.com"
                value={loginEmail}
                onChange={(e) => { setLoginEmail(e.target.value); clearErr('loginEmail'); }}
              />
            </Field>
            <Field label="비밀번호" error={errors.loginPassword}>
              <input
                type="password"
                placeholder="비밀번호"
                value={loginPassword}
                onChange={(e) => { setLoginPassword(e.target.value); clearErr('loginPassword'); }}
                onKeyDown={(e) => { if (e.key === 'Enter') submitLogin(); }}
              />
            </Field>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={submitLogin} disabled={authLoading}>
              {authLoading ? '로그인 중...' : '로그인'}
            </button>
            <div className="auth-foot">계정이 없으신가요? <span onClick={() => switchMode('signup')}>회원가입</span></div>
          </>
        ) : (
          <>
            <Field label="아이디" error={errors.suUsername}>
              <input
                type="text"
                placeholder="kimsiheun"
                value={suUsername}
                onChange={(e) => { setSuUsername(e.target.value); clearErr('suUsername'); }}
              />
            </Field>
            <Field label="이메일" error={errors.suEmail}>
              <input
                type="email"
                placeholder="owner@example.com"
                value={suEmail}
                onChange={(e) => { setSuEmail(e.target.value); clearErr('suEmail'); }}
              />
            </Field>
            <Field label="비밀번호" error={errors.suPassword} hint={errors.suPassword ? undefined : '8자 이상 입력해주세요'}>
              <input
                type="password"
                placeholder="비밀번호"
                value={suPassword}
                onChange={(e) => { setSuPassword(e.target.value); clearErr('suPassword'); }}
                onKeyDown={(e) => { if (e.key === 'Enter') submitSignup(); }}
              />
            </Field>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={submitSignup} disabled={authLoading}>
              {authLoading ? '가입 중...' : '가입하고 시작하기'}
            </button>
            <div className="auth-foot">이미 계정이 있으신가요? <span onClick={() => switchMode('login')}>로그인</span></div>
          </>
        )}
      </div>
    </div>
  );
}
