import React from 'react';
import LoginForm from './components/LoginForm';
import LoginHeader from './components/LoginHeader';
const Login: React.FC = () => {
  return (
    <div className='min-h-screen bg-[#f5f5f5]'>
      <LoginHeader />
      <div className='mx-auto max-w-7xl px-4 py-6'>
        <LoginForm />
      </div>
      {/* Footer with copyright information */}
      <div className='right-0 bottom-0 left-0 border-t border-[#ddd] bg-white p-4 text-center'>
        <div className='text-xs text-[#666]'>
          <p>
            Copyright &copy; 2011 - 2025 Ho Chi Minh University of Technology.
            All rights reserved.
          </p>
          <p className='mt-1'>Powered by Jasig CAS 3.5.1</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
