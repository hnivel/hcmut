import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layouts/Sidebar';
import {
  ArrowLeft,
  UserRound,
  CalendarDays,
  Clock,
  List,
  X,
  Star,
  Plus,
  Trash2,
} from 'lucide-react';
import DashboardFooter from '@/components/layouts/Footer';
import Calendar from '../../components/ui/Calendar';
import {
  mockMatchedMentors,
  mockMentorAvailabilityEvents,
  mockDocuments,
} from '@/constants/data';
import { mockSessionFeedback, type SessionFeedback } from '@/constants/data';
import { ProfileItem } from '../profile/Profile';

type FeedbackModalType = 'mentor-feedback' | 'give-feedback' | 'your-feedback';

const MatchedMentorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Default to Profile per requirement: show profile first
  const [activeTab, setActiveTab] = useState<
    'Profile' | 'Availability' | 'Feedback' | 'Documents'
  >('Profile');
  const [showRequestMeeting, setShowRequestMeeting] = useState(false);

  // Feedback modal states (filter to this mentor)
  const [sessions, setSessions] = useState<SessionFeedback[]>(() =>
    mockSessionFeedback.filter((s) => s.mentorId === id),
  );
  const [selectedSession, setSelectedSession] =
    useState<SessionFeedback | null>(null);
  const [modalType, setModalType] = useState<FeedbackModalType | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  // Request meeting states
  const [description, setDescription] = useState<string>('');
  const [proposedTimes, setProposedTimes] = useState<
    Array<{ date: string; startTime: string; endTime: string }>
  >([{ date: '', startTime: '', endTime: '' }]);
  const [proposedLocations, setProposedLocations] = useState<
    Array<{ type: 'Online' | 'Offline'; location: string }>
  >([{ type: 'Online', location: '' }]);

  // Request matching modal state
  const [isRequestMatchingOpen, setIsRequestMatchingOpen] = useState(false);
  const [desiredArea, setDesiredArea] = useState('');

  // Find the mentor by ID
  const matchedMentor = mockMatchedMentors.find((m) => m.id === id);

  if (!matchedMentor) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-2xl text-gray-600'>Mentor not found</p>
      </div>
    );
  }

  // Feedback handlers
  const handleViewMentorFeedback = (session: SessionFeedback) => {
    const currentSession = sessions.find((s) => s.id === session.id);
    setSelectedSession(currentSession || session);
    setModalType('mentor-feedback');
  };

  const handleGiveFeedback = (session: SessionFeedback) => {
    const currentSession = sessions.find((s) => s.id === session.id);
    setSelectedSession(currentSession || session);
    setModalType('give-feedback');
    setRating(0);
    setComment('');
  };

  const handleViewYourFeedback = (session: SessionFeedback) => {
    const currentSession = sessions.find((s) => s.id === session.id);
    setSelectedSession(currentSession || session);
    setModalType('your-feedback');
  };

  const handleSubmitFeedback = () => {
    if (!selectedSession || rating === 0 || comment.trim() === '') return;
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== selectedSession.id) return session;
        return {
          ...session,
          menteeFeedback: { rating: rating, comment: comment || undefined },
        } as SessionFeedback;
      }),
    );
    closeModal();
  };

  const closeModal = () => {
    setSelectedSession(null);
    setModalType(null);
    setRating(0);
    setComment('');
  };

  return (
    <div className='page-layout'>
      {/* Sidebar */}
      <div className='3xl:w-96 hidden bg-white lg:block lg:w-56'>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className='flex flex-1 flex-col'>
        <main className='w-full flex-1 py-6 md:py-8 lg:py-12 xl:py-16'>
          <div className='page-container'>
            {/* Header */}
            <div className='mb-6 flex flex-col flex-wrap items-start justify-between md:mb-8 lg:mb-10 lg:flex-row lg:items-center'>
              <div className='flex-1'>
                <button
                  onClick={() => navigate('/matching/matched-mentors')}
                  className='mb-2 flex items-center text-xl font-bold text-gray-800 transition hover:text-blue-600 md:text-2xl lg:text-3xl'
                >
                  <ArrowLeft className='mr-2 h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7' />{' '}
                  Mentor: {matchedMentor.name}
                </button>
                <p className='3xl:text-2xl mt-4 text-left text-base text-gray-600 md:text-lg lg:text-xl'>
                  Matching Status:{' '}
                  <span
                    className={`font-semibold ${
                      matchedMentor.status === 'Active'
                        ? 'text-green-600'
                        : matchedMentor.status === 'Completed'
                          ? 'text-amber-600'
                          : 'text-gray-500'
                    }`}
                  >
                    {matchedMentor.status}
                  </span>
                </p>
                <p className='3xl:text-2xl mt-1 text-left text-base text-gray-600 md:text-lg lg:text-xl'>
                  Support Area: {matchedMentor.supportArea}
                </p>
              </div>
              <div className='mt-4 flex w-full flex-col sm:flex-row md:mt-6 lg:mt-0 lg:w-auto'>
                {matchedMentor.status === 'Active' && (
                  <button className='3xl:text-xl rounded-lg border border-red-300 bg-red-100 px-4 py-2 text-base font-medium whitespace-nowrap text-red-600 transition hover:bg-red-200 md:px-5 md:text-lg lg:px-6'>
                    Cancel Matching
                  </button>
                )}
                {matchedMentor.status === 'Active' ? (
                  <button
                    onClick={() => {
                      setShowRequestMeeting(!showRequestMeeting);
                      setActiveTab('Availability');
                    }}
                    className='3xl:text-xl mt-3 rounded-lg bg-blue-500 px-4 py-2 text-base font-medium whitespace-nowrap text-white transition hover:bg-blue-400 sm:mt-0 sm:ml-3 md:ml-4 md:px-5 md:text-lg lg:px-6'
                  >
                    Request Meeting
                  </button>
                ) : (
                  <button
                    onClick={() => setIsRequestMatchingOpen(true)}
                    className='3xl:text-xl mt-3 rounded-lg bg-slate-700 px-4 py-2 text-base font-medium whitespace-nowrap text-white transition hover:bg-slate-800 sm:mt-0 sm:ml-3 md:ml-4 md:px-5 md:text-lg lg:px-6'
                  >
                    Request Matching
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className='mb-6 flex flex-wrap items-center md:mb-8'>
              {matchedMentor.status === 'Active'
                ? ['Profile', 'Availability', 'Feedback', 'Documents'].map(
                    (tab, index) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`3xl:text-xl rounded-lg border px-4 py-2 text-base font-medium transition md:px-5 md:text-lg lg:px-6 ${
                          index > 0 ? 'ml-2 md:ml-3 lg:ml-4' : ''
                        } ${
                          activeTab === tab
                            ? 'border-blue-400 bg-blue-100 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                        {...(tab === 'Profile'
                          ? { 'data-profile-tab-btn': true }
                          : {})}
                      >
                        {tab}
                      </button>
                    ),
                  )
                : ['Profile', 'Feedback', 'Documents'].map((tab, index) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`3xl:text-xl rounded-lg border px-4 py-2 text-base font-medium transition md:px-5 md:text-lg lg:px-6 ${
                        index > 0 ? 'ml-2 md:ml-3 lg:ml-4' : ''
                      } ${
                        activeTab === tab
                          ? 'border-blue-400 bg-blue-100 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                      {...(tab === 'Profile'
                        ? { 'data-profile-tab-btn': true }
                        : {})}
                    >
                      {tab}
                    </button>
                  ))}
            </div>

            {/* PROFILE TAB */}
            {activeTab === 'Profile' && (
              <div className='rounded-xl border border-gray-200 bg-white p-4 text-left shadow-lg md:rounded-2xl md:p-6 lg:p-8 xl:p-10'>
                <div className='flex w-full flex-col lg:flex-row lg:justify-between'>
                  <div className='flex flex-col items-center sm:flex-row sm:items-start'>
                    <div className='flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-50 md:h-28 md:w-28 lg:h-32 lg:w-32'>
                      <UserRound className='h-12 w-12 text-gray-500 md:h-14 md:w-14 lg:h-16 lg:w-16' />
                    </div>
                    <div className='mt-4 text-center sm:mt-0 sm:ml-4 sm:text-left md:ml-6'>
                      <h2 className='3xl:text-4xl text-2xl font-semibold text-gray-800 md:text-2xl'>
                        {matchedMentor.name}
                      </h2>
                      <p className='3xl:text-2xl text-base text-gray-600 md:text-lg lg:text-lg'>
                        <span className='font-semibold'>Email: </span>{' '}
                        {matchedMentor.email}
                      </p>
                      <p className='3xl:text-2xl text-base text-gray-600 md:text-lg lg:text-lg'>
                        <span className='font-semibold'>Faculty: </span>{' '}
                        {matchedMentor.faculty}
                      </p>
                      <p className='3xl:text-2xl text-base text-gray-600 md:text-lg lg:text-lg'>
                        <span className='font-semibold'>Department: </span>{' '}
                        {matchedMentor.department}
                      </p>
                    </div>
                  </div>
                  <ProfileItem
                    label='Office Hours'
                    value={
                      matchedMentor.officeHours?.map((hour, idx) => (
                        <p key={idx}>{hour}</p>
                      )) || <p>No office hours set</p>
                    }
                    editable={false}
                    className='lg:ml-10 lg:w-1/2'
                  />
                </div>
                <div className='mt-6 flex flex-col lg:gap-4'>
                  <ProfileItem
                    label='Self Description'
                    value={
                      matchedMentor.description || 'No description provided.'
                    }
                    editable={false}
                  />
                  <ProfileItem
                    label='Support Areas'
                    value={
                      matchedMentor.supportArea || 'No support areas provided.'
                    }
                    editable={false}
                  />
                  <ProfileItem
                    label='Mentoring Methods'
                    value={
                      matchedMentor.mentoringMethod ||
                      'Online consultation, collaborative projects, and hands-on exercises.'
                    }
                    editable={false}
                  />
                </div>
              </div>
            )}

            {/* AVAILABILITY TAB */}
            {activeTab === 'Availability' && (
              <AvailabilitySection
                mentorId={matchedMentor.id}
                showRequestMeeting={showRequestMeeting}
                setShowRequestMeeting={setShowRequestMeeting}
                description={description}
                setDescription={setDescription}
                proposedTimes={proposedTimes}
                setProposedTimes={setProposedTimes}
                proposedLocations={proposedLocations}
                setProposedLocations={setProposedLocations}
              />
            )}

            {/* FEEDBACK TAB */}
            {activeTab === 'Feedback' && (
              <div className='space-y-4 md:space-y-6'>
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className='flex w-full flex-col rounded-xl border border-gray-200 bg-white p-4 text-left text-base text-gray-700 shadow-sm md:rounded-2xl md:p-5 md:text-lg lg:flex-row lg:items-center lg:justify-between lg:p-6'
                  >
                    <div>
                      <h4 className='text-lg font-semibold text-gray-800 md:text-xl lg:text-2xl'>
                        Session {s.id}
                      </h4>
                      <p className='mt-1 flex items-center text-gray-600'>
                        <CalendarDays
                          size={16}
                          className='mr-2 md:h-[18px] md:w-[18px]'
                        />{' '}
                        {s.date}
                      </p>
                      <p className='flex items-center text-gray-600'>
                        <Clock
                          size={16}
                          className='mr-2 md:h-[18px] md:w-[18px]'
                        />{' '}
                        {s.time}
                      </p>
                      <p className='mt-1 flex items-start text-gray-600'>
                        <List
                          size={16}
                          className='mt-1 mr-2 md:h-[18px] md:w-[18px]'
                        />
                        <span>
                          {s.topic}
                          <br />
                          {s.problem}
                        </span>
                      </p>
                    </div>
                    <div className='mt-4 flex flex-col gap-3 lg:mt-0 lg:ml-6 lg:min-w-[220px]'>
                      <button
                        onClick={() => handleViewMentorFeedback(s)}
                        className='rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 md:text-base lg:text-lg'
                      >
                        Mentor's Feedback
                      </button>
                      <button
                        onClick={() =>
                          s.menteeFeedback.rating !== -1
                            ? handleViewYourFeedback(s)
                            : handleGiveFeedback(s)
                        }
                        className='rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 md:text-base lg:text-lg'
                      >
                        {s.menteeFeedback.rating !== -1
                          ? 'Your Feedback'
                          : 'Give Feedback'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === 'Documents' && (
              <div>
                {mockDocuments.filter((d) => d.mentorId === matchedMentor.id)
                  .length > 0 ? (
                  <ul className='space-y-4 md:space-y-5'>
                    {mockDocuments
                      .filter((doc) => doc.mentorId === matchedMentor.id)
                      .map((doc) => (
                        <li
                          key={doc.id}
                          className='flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left text-base text-gray-700 shadow-sm md:rounded-2xl md:p-5 md:text-lg lg:p-6'
                        >
                          <div>
                            <div className='text-xl font-medium'>
                              {doc.title}
                            </div>
                            <div className='text-gray-500'>
                              {doc.uploadDate}
                            </div>
                            <div className='text-gray-500'>
                              Type: {doc.type}
                            </div>
                          </div>
                          <div className='ml-4 flex flex-col items-end justify-between lg:ml-6'>
                            <div className='mt-3 flex justify-end space-x-6 lg:mt-0'>
                              <button
                                type='button'
                                className='rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 font-medium text-blue-700 hover:bg-blue-100'
                              >
                                View
                              </button>
                              <button
                                type='button'
                                className='rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-100'
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p>No documents uploaded yet.</p>
                )}
              </div>
            )}
          </div>
        </main>
        <DashboardFooter />
      </div>

      {/* Feedback Modals */}
      {selectedSession && modalType === 'mentor-feedback' && (
        <FeedbackModal
          type='mentor'
          session={selectedSession}
          close={closeModal}
        />
      )}
      {selectedSession && modalType === 'give-feedback' && (
        <GiveFeedbackModal
          session={selectedSession}
          mentorName={matchedMentor.name}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          submit={handleSubmitFeedback}
          close={closeModal}
        />
      )}
      {selectedSession && modalType === 'your-feedback' && (
        <YourFeedbackModal
          session={selectedSession}
          mentorName={matchedMentor.name}
          setModalType={setModalType}
          setRating={setRating}
          setComment={setComment}
          close={closeModal}
        />
      )}

      {/* Request Matching Modal */}
      {isRequestMatchingOpen && matchedMentor && (
        <RequestMatchingModal
          mentorName={matchedMentor.name}
          desiredArea={desiredArea}
          setDesiredArea={setDesiredArea}
          close={() => {
            setIsRequestMatchingOpen(false);
            setDesiredArea('');
          }}
        />
      )}
    </div>
  );
};

// ===== Availability Section Component =====
interface AvailabilitySectionProps {
  mentorId: string;
  showRequestMeeting: boolean;
  setShowRequestMeeting: (v: boolean) => void;
  description: string;
  setDescription: (v: string) => void;
  proposedTimes: Array<{ date: string; startTime: string; endTime: string }>;
  setProposedTimes: (
    v: Array<{ date: string; startTime: string; endTime: string }>,
  ) => void;
  proposedLocations: Array<{ type: 'Online' | 'Offline'; location: string }>;
  setProposedLocations: (
    v: Array<{ type: 'Online' | 'Offline'; location: string }>,
  ) => void;
}

const AvailabilitySection = ({
  mentorId,
  showRequestMeeting,
  setShowRequestMeeting,
  description,
  setDescription,
  proposedTimes,
  setProposedTimes,
  proposedLocations,
  setProposedLocations,
}: AvailabilitySectionProps) => {
  // Filter availability events for this mentor
  const availabilityEvents = mockMentorAvailabilityEvents.filter(
    (e) => !e.mentorId || e.mentorId === mentorId,
  );

  return (
    <div className='relative flex flex-col md:flex-row'>
      <div className='flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-lg md:mr-6 md:rounded-2xl md:p-6 lg:p-8'>
        <Calendar
          type='availability'
          role='mentee'
          readOnly
          todayOverride={{ year: 2025, month: 10, date: 27 }}
          availabilityEvents={availabilityEvents}
        />
      </div>
      {showRequestMeeting && (
        <MeetingRequestSidebar
          setShowRequestMeeting={setShowRequestMeeting}
          description={description}
          setDescription={setDescription}
          proposedTimes={proposedTimes}
          setProposedTimes={setProposedTimes}
          proposedLocations={proposedLocations}
          setProposedLocations={setProposedLocations}
        />
      )}
    </div>
  );
};

// ===== Meeting Request Sidebar =====
const MeetingRequestSidebar = ({
  setShowRequestMeeting,
  description,
  setDescription,
  proposedTimes,
  setProposedTimes,
  proposedLocations,
  setProposedLocations,
}: {
  setShowRequestMeeting: (v: boolean) => void;
  description: string;
  setDescription: (v: string) => void;
  proposedTimes: Array<{ date: string; startTime: string; endTime: string }>;
  setProposedTimes: (
    v: Array<{ date: string; startTime: string; endTime: string }>,
  ) => void;
  proposedLocations: Array<{ type: 'Online' | 'Offline'; location: string }>;
  setProposedLocations: (
    v: Array<{ type: 'Online' | 'Offline'; location: string }>,
  ) => void;
}) => {
  return (
    <div className='absolute top-0 right-0 h-full w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 shadow-lg md:static md:w-[350px] md:rounded-2xl md:p-6 lg:w-[400px]'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-800 md:text-xl lg:text-2xl'>
          Request Meeting
        </h3>
        <button
          onClick={() => {
            setShowRequestMeeting(false);
            setDescription('');
            setProposedTimes([{ date: '', startTime: '', endTime: '' }]);
            setProposedLocations([{ type: 'Online', location: '' }]);
          }}
          className='text-xl text-gray-500 hover:text-gray-700'
        >
          ✕
        </button>
      </div>
      <div className='mt-4'>
        <label className='block text-left text-base font-medium text-gray-700 md:text-xl'>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Describe your problem or topic...'
          className='text-md 3xl:text-lg mt-2 w-full rounded-lg border border-gray-300 p-3 text-base text-gray-700 focus:border-blue-400 focus:outline-none'
          rows={3}
        />
      </div>
      <div className='mt-4 space-y-3 text-base text-gray-700 md:mt-6'>
        <div className='flex items-center justify-between'>
          <label className='block font-medium md:text-xl'>Proposed Times</label>
          <button
            onClick={() =>
              setProposedTimes([
                ...proposedTimes,
                { date: '', startTime: '', endTime: '' },
              ])
            }
            className='text-md flex items-center rounded-lg bg-blue-100 px-3 py-2 font-semibold text-blue-700 hover:bg-blue-200'
          >
            <Plus
              size={22}
              strokeWidth={2.5}
              className='mr-1 inline-block h-4 w-4'
            />
            Add Time
          </button>
        </div>
        {proposedTimes.map((timeSlot, index) => (
          <div
            key={index}
            className='rounded-lg border border-gray-200 bg-gray-50 p-3'
          >
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-md font-medium text-gray-600'>
                Option {index + 1}
              </span>
              {proposedTimes.length > 1 && (
                <button
                  onClick={() =>
                    setProposedTimes(
                      proposedTimes.filter((_, i) => i !== index),
                    )
                  }
                  className='flex h-8 w-8 items-center justify-center rounded-full text-sm text-red-600 hover:bg-red-200'
                >
                  <Trash2 size={18} className='inline-block' />
                </button>
              )}
            </div>
            <div className='space-y-2'>
              <input
                type='date'
                value={timeSlot.date}
                onChange={(e) => {
                  const newTimes = [...proposedTimes];
                  newTimes[index].date = e.target.value;
                  setProposedTimes(newTimes);
                }}
                className='text-md w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-400 focus:outline-none'
              />
              <div className='flex items-center gap-2'>
                <input
                  type='time'
                  value={timeSlot.startTime}
                  onChange={(e) => {
                    const newTimes = [...proposedTimes];
                    newTimes[index].startTime = e.target.value;
                    setProposedTimes(newTimes);
                  }}
                  className='text-md flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-400 focus:outline-none'
                />
                <span className='text-sm'>to</span>
                <input
                  type='time'
                  value={timeSlot.endTime}
                  onChange={(e) => {
                    const newTimes = [...proposedTimes];
                    newTimes[index].endTime = e.target.value;
                    setProposedTimes(newTimes);
                  }}
                  className='text-md flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-400 focus:outline-none'
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='mt-4 space-y-3 text-base text-gray-700 md:mt-6'>
        <div className='flex items-center justify-between'>
          <label className='block font-medium md:text-xl'>
            Proposed Locations
          </label>
          <button
            onClick={() =>
              setProposedLocations([
                ...proposedLocations,
                { type: 'Online', location: '' },
              ])
            }
            className='text-md flex items-center rounded-lg bg-blue-100 px-3 py-2 font-semibold text-blue-700 hover:bg-blue-200'
          >
            <Plus
              size={18}
              strokeWidth={2.5}
              className='mr-1 inline-block h-4 w-4'
            />
            Add Location
          </button>
        </div>
        {proposedLocations.map((locationObj, index) => (
          <div
            key={index}
            className='rounded-lg border border-gray-200 bg-gray-50 p-3'
          >
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-md font-medium text-gray-600'>
                Option {index + 1}
              </span>
              {proposedLocations.length > 1 && (
                <button
                  onClick={() =>
                    setProposedLocations(
                      proposedLocations.filter((_, i) => i !== index),
                    )
                  }
                  className='flex h-8 w-8 items-center justify-center rounded-full text-sm text-red-600 hover:bg-red-200'
                >
                  <Trash2 size={18} className='inline-block' />
                </button>
              )}
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => {
                    const newLocations = [...proposedLocations];
                    newLocations[index].type = 'Online';
                    setProposedLocations(newLocations);
                  }}
                  className={`text-md flex-1 rounded-lg border px-4 py-2 font-medium transition ${
                    locationObj.type === 'Online'
                      ? 'border-blue-400 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Online
                </button>
                <button
                  onClick={() => {
                    const newLocations = [...proposedLocations];
                    newLocations[index].type = 'Offline';
                    setProposedLocations(newLocations);
                  }}
                  className={`text-md flex-1 rounded-lg border px-4 py-2 font-medium transition ${
                    locationObj.type === 'Offline'
                      ? 'border-blue-400 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Offline
                </button>
              </div>
              <input
                type='text'
                value={locationObj.location}
                onChange={(e) => {
                  const newLocations = [...proposedLocations];
                  newLocations[index].location = e.target.value;
                  setProposedLocations(newLocations);
                }}
                placeholder={
                  locationObj.type === 'Online'
                    ? 'e.g., Google Meet, Zoom, Teams'
                    : 'e.g., Room A101, Coffee Shop'
                }
                className='text-md w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-400 focus:outline-none'
              />
            </div>
          </div>
        ))}
      </div>
      <div className='mt-4 flex justify-end md:mt-6'>
        <button
          onClick={() => {
            console.log({ description, proposedTimes, proposedLocations });
            alert('Meeting request submitted!');
            setShowRequestMeeting(false);
            setDescription('');
            setProposedTimes([{ date: '', startTime: '', endTime: '' }]);
            setProposedLocations([{ type: 'Online', location: '' }]);
          }}
          className='text-md 3xl:text-lg rounded-lg bg-blue-500 px-4 py-2 text-base font-medium text-white hover:bg-blue-400 md:px-6'
        >
          Submit
        </button>
      </div>
    </div>
  );
};

// ===== Feedback Modals (simplified placeholders) =====
const FeedbackModal = ({
  session,
  close,
}: {
  session: SessionFeedback;
  close: () => void;
  type: 'mentor';
}) => (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 text-left'>
    <div className='relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl md:p-8'>
      <button
        onClick={close}
        className='absolute top-4 right-4 rounded-md p-2 text-gray-500 hover:bg-gray-100'
      >
        <X size={22} />
      </button>
      <h2 className='mb-6 text-2xl font-semibold text-gray-800 md:text-3xl'>
        Mentor's Feedback - Session {session.id}
      </h2>
      <div className='rounded-lg bg-gray-50 p-4 mb-4'>
        <p className='text-base text-gray-700 md:text-lg'>
          <strong>Topic:</strong> {session.topic}
        </p>
        <p className='text-base text-gray-700 md:text-lg'>
          <strong>Date:</strong> {session.date} | {session.time}
        </p>
      </div>
      {session.mentorFeedback?.comment ? (
        <div className='rounded-lg border-gray-300 border-2 p-4'>
        <p className='text-gray-700 text-lg font-semibold'>{session.mentorFeedback.comment}</p>
      </div>
      ) : (
        <p className='mt-4 text-gray-500'>
          No feedback provided by the mentor.
        </p>
      )}
    </div>
  </div>
);

const GiveFeedbackModal = ({
  session,
  rating,
  setRating,
  comment,
  setComment,
  submit,
  close,
}: {
  session: SessionFeedback;
  mentorName: string;
  rating: number;
  setRating: (n: number) => void;
  comment: string;
  setComment: (v: string) => void;
  submit: () => void;
  close: () => void;
}) => (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 text-left'>
    <div className='relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl md:p-8'>
      <button
        onClick={close}
        className='absolute top-4 right-4 rounded-md p-2 text-gray-500 hover:bg-gray-100'
      >
        <X size={22} />
      </button>
      <h2 className='mb-6 text-2xl font-semibold text-gray-800 md:text-3xl'>
        Rate Your Mentor
      </h2>
      <p className='text-gray-600'>
        Session: {session.id} - {session.topic}
      </p>
      <div className='mt-4 flex items-center gap-2'>
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} onClick={() => setRating(star)}>
            <Star
              size={40}
              className={
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Comment'
        className='mt-4 w-full rounded-lg border border-gray-300 px-4 py-3'
        rows={4}
      />
      <div className='mt-4 flex justify-end gap-3'>
        <button
          onClick={close}
          className='rounded-lg border border-gray-300 px-6 py-2 text-base font-medium text-gray-700 hover:bg-gray-100'
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={rating === 0}
          className='rounded-lg bg-blue-500 px-6 py-2 text-base font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300'
        >
          Submit
        </button>
      </div>
    </div>
  </div>
);

const YourFeedbackModal = ({
  session,
  setModalType,
  mentorName,
  setRating,
  setComment,
  close,
}: {
  session: SessionFeedback;
  mentorName: string;
  setModalType: (v: FeedbackModalType | null) => void;
  setRating: (n: number) => void;
  setComment: (v: string) => void;
  close: () => void;
}) => {
  // Using simplified mentee feedback model
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 text-left'>
      <div className='relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl md:p-8'>
        <button
          onClick={close}
          className='absolute top-4 right-4 rounded-md p-2 text-gray-500 hover:bg-gray-100'
        >
          <X size={22} />
        </button>
        <h2 className='mb-6 text-2xl font-semibold text-gray-800 md:text-3xl'>
          Your Feedback - Session {session.id}
        </h2>
        <div className='rounded-lg bg-gray-50 p-4'>
          <p className='text-base text-gray-700 md:text-lg'>
            <strong>Topic:</strong> {session.topic}
          </p>
          <p className='text-base text-gray-700 md:text-lg'>
            <strong>Mentor:</strong> {mentorName}
          </p>
          <p className='text-base text-gray-700 md:text-lg'>
            <strong>Date:</strong> {session.date} | {session.time}
          </p>
        </div>
        {session.menteeFeedback.rating === -1 ? (
          <div className='mt-4 text-center'>
            <p className='mb-4 text-base text-gray-600'>
              You haven't given feedback yet.
            </p>
            <button
              onClick={() => {
                setModalType('give-feedback');
                setRating(0);
                setComment('');
              }}
              className='rounded-lg bg-blue-500 px-6 py-2 text-base font-medium text-white hover:bg-blue-600'
            >
              Give Feedback Now
            </button>
          </div>
        ) : (
          <div className='mt-4 rounded-lg border-gray-300 border-2 p-4'>
            <div className='flex items-center gap-1'>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className={
                    star <= (session.menteeFeedback.rating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }
                />
              ))}
              <span className='ml-2 text-base text-gray-600 md:text-lg'>
                ({session.menteeFeedback.rating}/5)
              </span>
            </div>
            {session.menteeFeedback.comment ? (
              <p className='text-lg text-gray-700'>
                "{session.menteeFeedback.comment}"
              </p>
            ) : (
              <p className='text-base text-gray-600'>No comment provided.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ===== Request Matching Modal =====
const RequestMatchingModal = ({
  mentorName,
  desiredArea,
  setDesiredArea,
  close,
}: {
  mentorName: string;
  desiredArea: string;
  setDesiredArea: (v: string) => void;
  close: () => void;
}) => (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
    <div className='relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl md:rounded-3xl md:p-8'>
      <button
        onClick={() => {
          close();
        }}
        className='absolute top-3 right-3 rounded-md p-2 text-gray-500 hover:bg-gray-100 md:top-4 md:right-4'
      >
        <X size={20} className='md:h-[22px] md:w-[22px]' />
      </button>
      <div className='mb-6'>
        <h2 className='text-left text-2xl font-semibold text-gray-800 md:text-3xl'>
          Request Matching
        </h2>
        <p className='mt-2 text-left text-lg text-gray-600'>
          Submit a matching request to{' '}
          <span className='font-medium'>{mentorName}</span>
        </p>
      </div>
      <div className='space-y-6'>
        <div>
          <label
            htmlFor='desiredArea'
            className='mb-2 block text-left text-lg font-medium text-gray-700'
          >
            Desired Area
          </label>
          <textarea
            id='desiredArea'
            value={desiredArea}
            onChange={(e) => setDesiredArea(e.target.value)}
            placeholder='Describe the specific area or topic you would like to get mentoring on...'
            className='w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-lg text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none'
            rows={4}
          />
        </div>
        <div className='flex gap-4'>
          <button
            onClick={() => {
              if (desiredArea.trim()) {
                console.log('Matching request submitted:', {
                  mentorName,
                  desiredArea: desiredArea.trim(),
                });
                alert('Matching request submitted successfully!');
                close();
                setDesiredArea('');
              }
            }}
            disabled={!desiredArea.trim()}
            className='flex-1 rounded-lg bg-slate-700 px-6 py-3 text-lg font-medium text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-gray-300'
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default MatchedMentorDetail;
