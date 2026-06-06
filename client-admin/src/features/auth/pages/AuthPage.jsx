import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import '../../../style/index.css';

export const AuthPage = () => {
  const [mode, setMode] = useState('login');
  return (
    <main className='min-h-screen flex items-center justify-center px-6' style={{ background: 'var(--fw-gradient)' }}>
      {mode === 'login'
        ? <LoginForm onRegister={() => setMode('register')} />
        : <RegisterForm onLogin={() => setMode('login')} />}
    </main>
  );
};