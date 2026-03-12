import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useLogin } from '@/hooks/auth/useLogin';
import type { LoginRequest } from '@/hooks/auth/auth.interface';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [warnBeforeLogin, setWarnBeforeLogin] = useState(false);
  const { handleLogin } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginRequest: LoginRequest = { email, password };
    const { success, message } = await handleLogin(loginRequest);
    toast[success ? 'success' : 'error'](message);
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
    setWarnBeforeLogin(false);
  };

  return (
    <div className='flex flex-col gap-6 text-left lg:flex-row lg:items-start'>
      <Toaster position='top-center' />

      {/* Main Content Area */}
      <div className='flex-1 space-y-6'>
        {/* Login Box */}
        <div className='rounded-md border border-[#ddd] bg-white shadow-sm'>
          <div className='p-8'>
            <form onSubmit={handleSubmit}>
              <h2 className='mb-6 text-lg font-normal text-[#333]'>
                Enter your Username and Password
              </h2>

              {/* Username Field */}
              <div className='mb-5'>
                <label
                  htmlFor='username'
                  className='mb-2 block text-sm font-normal text-[#333]'
                >
                  Username
                </label>
                <input
                  id='username'
                  name='username'
                  type='text'
                  required
                  tabIndex={1}
                  accessKey='u'
                  autoComplete='off'
                  className='w-full rounded-sm border border-[#ccc] px-3 py-2 text-sm focus:border-[#66afe9] focus:ring-1 focus:ring-[#66afe9] focus:outline-none'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Field */}
              <div className='mb-5'>
                <label
                  htmlFor='password'
                  className='mb-2 block text-sm font-normal text-[#333]'
                >
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  required
                  tabIndex={2}
                  accessKey='p'
                  autoComplete='off'
                  className='w-full rounded-sm border border-[#ccc] px-3 py-2 text-sm focus:border-[#66afe9] focus:ring-1 focus:ring-[#66afe9] focus:outline-none'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Warn Checkbox */}
              <div className='mb-5 flex items-start gap-2'>
                <input
                  id='warn'
                  name='warn'
                  type='checkbox'
                  tabIndex={3}
                  accessKey='w'
                  className='mt-1'
                  checked={warnBeforeLogin}
                  onChange={(e) => setWarnBeforeLogin(e.target.checked)}
                />
                <label htmlFor='warn' className='text-sm text-[#333]'>
                  Warn me before logging me into other sites.
                </label>
              </div>

              {/* Buttons */}
              <div className='mb-5 flex gap-2'>
                <input
                  type='submit'
                  value='Login'
                  tabIndex={4}
                  accessKey='l'
                  className='cursor-pointer rounded-sm bg-[#0066cc] px-5 py-2 text-sm font-normal text-white hover:bg-[#0052a3]'
                />
                <input
                  type='button'
                  value='Clear'
                  tabIndex={5}
                  accessKey='c'
                  onClick={handleReset}
                  className='cursor-pointer rounded-sm border border-[#ccc] bg-white px-5 py-2 text-sm font-normal text-[#333] hover:bg-[#f5f5f5]'
                />
              </div>

              {/* Support Link */}
              <div className='border-t border-[#ddd] pt-4'>
                <ul className='list-none'>
                  <li>
                    <a
                      href='https://account.hcmut.edu.vn/'
                      className='text-sm text-[#0066cc] hover:underline'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Change password?
                    </a>
                  </li>
                </ul>
              </div>
            </form>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className='rounded-md border border-[#bee5eb] bg-[#d1ecf1] p-4'>
          <h3 className='mb-3 text-sm font-semibold text-[#0c5460]'>
            Demo Accounts
          </h3>
          <div className='space-y-2 text-xs text-[#0c5460]'>
            <div className='rounded bg-white p-2'>
              <span className='font-semibold'>Mentee:</span>{' '}
              <span className='font-mono'>vinhlpk@hcmut.edu.vn</span>
            </div>
            <div className='rounded bg-white p-2'>
              <span className='font-semibold'>Mentor:</span>{' '}
              <span className='font-mono'>giantkd@hcmut.edu.vn</span>
            </div>
            <div className='rounded bg-white p-2'>
              <span className='font-semibold'>Faculty:</span>{' '}
              <span className='font-mono'>khang.pham@hcmut.edu.vn</span>
            </div>
            <div className='rounded bg-white p-2'>
              <span className='font-semibold'>Password:</span>{' '}
              <span className='font-mono font-bold'>password123</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className='w-full space-y-4 lg:w-80'>
        {/* Languages */}
        <div className='rounded-md border border-[#ddd] bg-white p-4 shadow-sm'>
          <h3 className='mb-3 text-sm font-semibold text-[#333]'>Languages</h3>
          <ul className='space-y-2'>
            <li>
              <a
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  toast('Language: Vietnamese');
                }}
                className='text-sm text-[#0066cc] hover:underline'
              >
                Vietnamese
              </a>
            </li>
            <li>
              <a
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  toast('Language: English');
                }}
                className='text-sm text-[#0066cc] hover:underline'
              >
                English
              </a>
            </li>
          </ul>
        </div>

        {/* Please Note */}
        <div className='rounded-md border border-[#ddd] bg-white p-4 shadow-sm'>
          <h3 className='mb-3 text-sm font-semibold text-[#333]'>
            Please note
          </h3>
          <div className='space-y-3'>
            <p className='rounded-sm bg-[#f9f9f9] p-3 text-left text-xs leading-relaxed text-[#666]'>
              The Login page enables single sign-on to multiple websites at
              HCMUT. This means that you only have to enter your user name and
              password once for websites that subscribe to the Login page.
            </p>
            <p className='rounded-sm bg-[#f9f9f9] p-3 text-left text-xs leading-relaxed text-[#666]'>
              You will need to use your HCMUT Username and password to login to
              this site. The "HCMUT" account provides access to many resources
              including the HCMUT Information System, e-mail, ...
            </p>
            <p className='rounded-sm bg-[#f9f9f9] p-3 text-left text-xs leading-relaxed text-[#666]'>
              For security reasons, please Exit your web browser when you are
              done accessing services that require authentication!
            </p>
          </div>
        </div>

        {/* Technical Support */}
        <div className='rounded-md border border-[#ddd] bg-white p-4 shadow-sm'>
          <h3 className='mb-3 text-sm font-semibold text-[#333]'>
            Technical support
          </h3>
          <ul className='space-y-2 text-xs text-[#666]'>
            <li>
              E-mail:{' '}
              <a
                href='mailto:support@hcmut.edu.vn'
                className='text-[#0066cc] hover:underline'
              >
                support@hcmut.edu.vn
              </a>
            </li>
            <li>Tel: (84-8) 38647256 - 7204</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
