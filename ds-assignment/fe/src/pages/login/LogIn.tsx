import React from 'react';
import LoginForm from './components/LogInForm';
import LoginHeader from './components/LogInHeader';

const LogIn: React.FC = () => {
  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100 px-4'>
      <LoginHeader />
      <LoginForm />
    </div>
  );
};

export default LogIn;
