import logoBK from '@/assets/logoBK.png';

const LoginHeader = () => {
  return (
    <div className='bg-gradient-to-r from-[#2c5282] to-[#1a365d] shadow-md'>
      <div className='mx-auto max-w-7xl px-6 py-4'>
        <div className='flex items-center gap-3'>
          <img src={logoBK} alt='BK' className='h-12 w-18 object-contain' />
          <h1 className='text-xl font-normal text-white'>
            Central Authentication Service
          </h1>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;
