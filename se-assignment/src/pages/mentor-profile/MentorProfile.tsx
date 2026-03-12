import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layouts/Sidebar';
import { UserRound, ArrowLeft, Mail, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardFooter } from '../dashboard/components';
import { mockExploreMentors } from '@/constants/data';
import SidebarWrapper from '@/components/layouts/SidebarWrapper';
import { ProfileItem } from '../profile/Profile';

const MentorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [desiredArea, setDesiredArea] = useState('');

  // Find the mentor by ID
  const mentor = mockExploreMentors.find((m) => m.id === id);

  const handleSubmitRequest = () => {
    if (desiredArea.trim()) {
      // Here you would typically send the request to your backend
      console.log('Matching request submitted:', {
        mentorId: id,
        mentorName: mentor?.name,
        desiredArea: desiredArea.trim(),
      });

      // Close modal and reset form
      setIsModalOpen(false);
      setDesiredArea('');

      // Show success feedback (you could add a toast notification here)
      alert('Matching request submitted successfully!');
    }
  };

  const handleCancelRequest = () => {
    setIsModalOpen(false);
    setDesiredArea('');
  };

  if (!mentor) {
    return (
      <div className='flex min-h-screen'>
        <div className='3xl:w-96 hidden bg-white lg:block lg:w-56'>
          <Sidebar />
        </div>
        <div className='flex flex-1 flex-col'>
          <main className='w-full flex-1 py-12 md:py-16'>
            <div className='page-container'>
              <div className='page-header'>
                <h1 className='page-title'>Mentor Not Found</h1>
              </div>
              <div className='text-center text-gray-500'>
                The mentor you're looking for could not be found.
              </div>
            </div>
          </main>
          <DashboardFooter />
        </div>
      </div>
    );
  }

  return (
    <div className='page-layout'>
      {/* Sidebar */}
      <SidebarWrapper />

      {/* Main Content */}
      <div className='flex flex-1 flex-col'>
        <main className='w-full flex-1 py-12 md:py-16'>
          <div className='page-container'>
            {/* Header with Back Button */}
            <div className='page-header'>
              <div className='flex items-center gap-4'>
                <button
                  onClick={() => navigate('/matching/explore-mentors')}
                  className='flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-600 transition hover:bg-gray-100'
                >
                  <ArrowLeft className='h-5 w-5' />
                  <span className='text-sm sm:text-base md:text-lg 3xl:text-xl'>
                    Back
                  </span>
                </button>
                <h1 className='page-title'>Mentor Profile</h1>
              </div>
            </div>

            {/* Profile Card */}
            <div className='rounded-2xl border border-gray-200 bg-white p-8 shadow-sm'>
              {/* Header Section */}
              <div className='flex flex-col items-start gap-6 border-b border-gray-200 pb-6 sm:flex-row sm:items-center'>
                {/* Avatar */}
                <div className='flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-50 md:h-32 md:w-32'>
                  <UserRound className='h-12 w-12 text-gray-500 md:h-16 md:w-16' />
                </div>

                {/* Basic Info */}
                <div className='flex-1'>
                  <h2 className='text-left text-lg font-bold text-gray-800 sm:text-xl md:text-2xl lg:text-3xl'>
                    {mentor.name}
                  </h2>
                  <p className='mt-4 text-left text-sm text-gray-600 sm:text-base md:text-lg 3xl:text-xl'>
                    Faculty: {mentor.faculty}
                  </p>
                  <p className='text-left text-sm text-gray-600 sm:text-base md:text-lg 3xl:text-xl'>
                    Support Areas: {mentor.supportArea}
                  </p>
                </div>

                {/* Request Matching Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className='bg-slate-700 px-4 rounded-lg text-base font-medium text-white transition-all hover:bg-slate-800 sm:px-5 sm:py-3 md:px-6 md:text-lg 3xl:text-xl'
                >
                  Request Matching
                </button>
              </div>

              {/* Details Section */}
              <div className='mt-8 grid gap-8 md:grid-cols-2'>
                {/* Contact Information */}
                <div className='space-y-4'>
                  <h3 className='flex items-center gap-3 text-left text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl 3xl:text-3xl'>
                    <Mail className='h-6 w-6' />
                    Contact Information
                  </h3>
                  <div className='space-y-2'>
                    <p className='text-left text-sm text-gray-600 sm:text-base md:text-lg 3xl:text-xl'>
                      <span className='font-medium'>Email:</span>{' '}
                      {mentor.email ||
                        `${mentor.name.toLowerCase().replace(/\s+/g, '.')}@university.edu`}
                    </p>
                    <p className='text-left text-sm text-gray-600 sm:text-base md:text-lg 3xl:text-xl'>
                      <span className='font-medium'>Department:</span>{' '}
                      {mentor.department || 'Computer Science'}
                    </p>
                  </div>
                </div>

                {/* Office Hours */}
                <div className='space-y-4'>
                  <h3 className='flex items-center gap-3 text-left text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl 3xl:text-3xl'>
                    <Clock className='h-6 w-6' />
                    Office Hours
                  </h3>
                  <div className='space-y-2'>
                    {mentor.officeHours ? (
                      mentor.officeHours.map((hour, index) => (
                        <p
                          key={index}
                          className='text-left text-sm text-gray-600 sm:text-base md:text-lg 3xl:text-xl'
                        >
                          {hour}
                        </p>
                      ))
                    ) : (
                      <div className='space-y-1'>
                        <p className='text-left text-sm text-gray-600 sm:text-base md:text-lg 3xl:text-xl'>
                          Monday 7 AM - 9 AM
                        </p>
                        <p className='text-left text-sm text-gray-600 sm:text-base md:text-lg 3xl:text-xl'>
                          Wednesday 2 PM - 4 PM
                        </p>
                        <p className='text-left text-sm text-gray-600 sm:text-base md:text-lg 3xl:text-xl'>
                          Friday 10 AM - 12 PM
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* About Section */}
                <ProfileItem
                  label='About'
                  value= {mentor.description ||
                    `${mentor.name} is an experienced mentor specializing in ${mentor.supportArea}. 
                    With years of expertise in the field, they are passionate about guiding students
                    through their academic and professional journey. They focus on practical
                    problem-solving approaches and real-world applications to help students
                    develop both theoretical understanding and hands-on skills.`}
                  editable={false}
                  
                  className='md:col-span-2'
                />

                {/* Mentoring Approach */}
                <ProfileItem
                  label='Mentoring Approach'
                  value={mentor.mentoringMethod ||
                    `Interactive learning sessions combining theoretical concepts with practical applications. 
                    Emphasis on collaborative problem-solving, regular feedback, and personalized guidance 
                    to help students achieve their academic and career goals. Sessions include code reviews, 
                    project discussions, and career development advice.`}
                  editable={false}
                  className='md:col-span-2'
                />
              </div>
            </div>
          </div>
        </main>

        <DashboardFooter />
      </div>

      {/* Request Matching Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <div className='relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl md:rounded-3xl md:p-8'>
            {/* Close Button */}
            <button
              onClick={handleCancelRequest}
              className='absolute top-3 right-3 rounded-md p-2 text-gray-500 hover:bg-gray-100 md:top-4 md:right-4'
            >
              <X size={20} className='md:h-[22px] md:w-[22px]' />
            </button>

            {/* Header */}
            <div className='mb-6'>
              <h2 className='text-left text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl 3xl:text-3xl'>
                Request Matching
              </h2>
              <p className='mt-4 text-left text-sm text-gray-600 sm:text-base md:text-lg 3xl:text-xl'>
                Submit a matching request to{' '}
                <span className='font-medium'>{mentor?.name}</span>
              </p>
            </div>

            {/* Form */}
            <div className='space-y-6'>
              <div>
                <label
                  htmlFor='desiredArea'
                  className='mb-2 block text-left text-sm font-medium text-gray-700 sm:text-base md:text-lg 3xl:text-xl'
                >
                  Desired Area
                </label>
                <textarea
                  id='desiredArea'
                  value={desiredArea}
                  onChange={(e) => setDesiredArea(e.target.value)}
                  placeholder='Describe the specific area or topic you would like to get mentoring on...'
                  className='w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none sm:text-base md:text-lg 3xl:text-xl'
                  rows={4}
                />
              </div>

              {/* Buttons */}
              <div className='flex gap-4'>
                <Button
                  onClick={handleSubmitRequest}
                  disabled={!desiredArea.trim()}
                  className='flex-1 bg-slate-700 px-4 py-4 text-base font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-gray-300 sm:px-5 sm:py-3 md:px-6 md:text-lg 3xl:text-xl'
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorProfile;
