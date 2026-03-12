import { useNavigate } from 'react-router-dom';

const UnauthenticatedGateway = () => {
  const navigate = useNavigate();

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4'>
      <div className='w-full max-w-md text-center'>
        <div className='mb-8'>
          {/* If you have a logo asset, replace the text below with an <img /> tag */}
          <h1 className='text-3xl font-extrabold tracking-tight text-gray-800'>
            Tutor Support System
          </h1>
          <p className='mt-2 text-gray-600'>
            Connecting mentors and mentees effectively.
          </p>
        </div>
        <div className='rounded-2xl border border-gray-200 bg-white p-8 shadow-sm'>
          <h2 className='mb-4 text-xl font-semibold text-gray-800'>Welcome</h2>
          <p className='mb-6 text-sm text-gray-600'>
            You need to be authenticated to access the platform. Please proceed
            to log in.
          </p>
          <button
            onClick={() => navigate('/login')}
            className='w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none'
          >
            Log In
          </button>
        </div>
        <p className='mt-8 text-xs text-gray-400'>
          © {new Date().getFullYear()} Tutor Support System
        </p>
      </div>
    </div>
  );
};

export default UnauthenticatedGateway;
