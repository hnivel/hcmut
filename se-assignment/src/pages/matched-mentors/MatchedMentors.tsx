import SidebarWrapper from '@/components/layouts/SidebarWrapper';
import { UserRound } from 'lucide-react';
import DashboardFooter from '@/components/layouts/Footer';
import { mockMatchedMentors, statusColors } from '@/constants/data';
import { useNavigate } from 'react-router-dom';

const MatchedMentors = () => {
  const navigate = useNavigate();

  const handleMentorClick = (mentorId: string) => {
    navigate(`/matching/matched-mentors/${mentorId}`);
  };

  return (
    <div className='page-layout'>
      {/* Sidebar */}
      <SidebarWrapper />

      {/* Main Content */}
      <div className='flex flex-1 flex-col'>
        <main className='w-full flex-1 py-6 md:py-8 lg:py-12 xl:py-16'>
          <div className='page-container'>
            {/* Header */}
            <div className='page-header'>
              <h1 className='page-title'>Matched Mentors</h1>
            </div>

            {/* Mentor Cards */}
            <div className='space-y-4 md:space-y-5'>
              {mockMatchedMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  onClick={() => handleMentorClick(mentor.id)}
                  className='flex w-full cursor-pointer flex-col items-start rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between md:rounded-2xl md:p-6 lg:p-7'
                >
                  {/* Left: Avatar + Info */}
                  <div className='flex items-center'>
                    <div className='flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-50 md:h-18 md:w-18 lg:h-20 lg:w-20'>
                      <UserRound className='h-8 w-8 text-gray-500 md:h-9 md:w-9 lg:h-10 lg:w-10' />
                    </div>

                    <div className='ml-4 min-w-0 md:ml-6'>
                      <h3 className='truncate text-left text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl 3xl:text-3xl'>
                        {mentor.name}
                      </h3>
                      <p className='text-left text-sm text-gray-600 sm:text-base md:text-lg 3xl:text-xl'>
                        Faculty: {mentor.faculty}
                      </p>
                      <p className='text-left text-sm text-gray-600 sm:text-base md:text-lg 3xl:text-xl'>
                        Support area: {mentor.supportArea}
                      </p>
                    </div>
                  </div>

                  {/* Right: Status */}
                  <div
                    className={`mt-4 flex-shrink-0 self-center rounded-md border px-4 py-1.5 text-sm font-medium whitespace-nowrap sm:mt-0 sm:text-base md:rounded-lg md:px-5 md:py-2 md:text-lg 3xl:px-6 3xl:text-xl ${statusColors[mentor.status]}`}
                  >
                    {mentor.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <DashboardFooter />
      </div>
    </div>
  );
};

export default MatchedMentors;
