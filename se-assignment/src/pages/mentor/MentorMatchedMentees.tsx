import SidebarWrapper from '@/components/layouts/SidebarWrapper';
import { DashboardFooter } from '../dashboard/components';
import {
  UserRound,
  ArrowLeft,
  CalendarDays,
  Clock,
  List,
  X,
  Star,
  Ellipsis,
  Pencil,
  Trash,
  Filter,
} from 'lucide-react';
import {
  mockMatchedMentees,
  statusColors,
  mockSessionFeedback,
  mockDocuments,
  type SessionFeedback,
} from './constants/mentorData';
import { ProfileItem } from '../profile/Profile';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

type FeedbackModalType = 'mentee-feedback' | 'give-feedback' | 'your-feedback';

interface FilterOptions {
  status: string[];
  fromDate?: string;
  toDate?: string;
  sortBy: 'time' | 'name';
  order: 'ascending' | 'descending';
}

const MatchedMenteeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'Profile' | 'Feedback' | 'Documents'
  >('Feedback');

  // Feedback modal states
  const [sessions, setSessions] =
    useState<SessionFeedback[]>(mockSessionFeedback);
  const [selectedSession, setSelectedSession] =
    useState<SessionFeedback | null>(null);
  const [modalType, setModalType] = useState<FeedbackModalType | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  // Find the mentee by ID
  const matchedMentee = mockMatchedMentees.find((m) => m.id === id);

  if (!matchedMentee) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-2xl text-gray-600'>Mentee not found</p>
      </div>
    );
  }

  // Get sessions for this mentee
  const menteeSessions = sessions.filter((s) =>
    s.menteesFeedback.some(
      (feedback) => feedback.menteeID === matchedMentee.id,
    ),
  );

  // Handler functions for feedback modals
  const handleViewMenteeFeedback = (session: SessionFeedback) => {
    const currentSession = sessions.find((s) => s.id === session.id);
    setSelectedSession(currentSession || session);
    setModalType('mentee-feedback');
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
    if (!selectedSession || rating === 0) return;

    // Update the sessions state
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id !== selectedSession.id) return session;

        // Initialize mentorEvaluations if it doesn't exist
        const currentEvaluations = session.mentorEvaluations || [];

        // Find the mentor evaluation to update or add
        const updatedEvaluations = currentEvaluations.find(
          (ev) => ev.menteeID === matchedMentee.id,
        )
          ? currentEvaluations.map((ev) =>
              ev.menteeID === matchedMentee.id
                ? { ...ev, score: rating, comment: comment || undefined }
                : ev,
            )
          : [
              ...currentEvaluations,
              {
                menteeID: matchedMentee.id,
                score: rating,
                comment: comment || undefined,
              },
            ];

        // Return updated session
        return {
          ...session,
          mentorFeedback: true,
          mentorEvaluations: updatedEvaluations,
        };
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
      <SidebarWrapper />

      {/* Main Content */}
      <div className='flex flex-1 flex-col'>
        <main className='w-full flex-1 py-6 md:py-8 lg:py-12 xl:py-16'>
          <div className='page-container'>
            {/* === Header === */}
            <div className='mb-6 flex flex-col flex-wrap items-start justify-between md:mb-8 lg:mb-10 lg:flex-row lg:items-center'>
              {/* Back + Info */}
              <div className='flex flex-col gap-1'>
                <button
                  onClick={() => navigate('/mentor/matched-mentees')}
                  className='mb-2 flex items-center text-xl font-bold text-gray-800 transition hover:text-blue-600 md:text-2xl lg:text-3xl'
                >
                  <ArrowLeft className='mr-2 h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7' />{' '}
                  Mentee: {matchedMentee.name}
                </button>
                <p className='3xl:text-2xl text-left text-base text-gray-600 md:text-lg lg:text-xl'>
                  Matching Status:{' '}
                  <span
                    className={`font-semibold ${
                      matchedMentee.status === 'Active'
                        ? 'text-green-600'
                        : matchedMentee.status === 'Completed'
                          ? 'text-amber-600'
                          : 'text-gray-500'
                    }`}
                  >
                    {matchedMentee.status}
                  </span>
                </p>
                <p className='3xl:text-2xl text-left text-base text-gray-600 md:text-lg lg:text-xl'>
                  Support Area: {matchedMentee.supportArea}
                </p>
              </div>
              {matchedMentee.status === 'Active' && (
                <button className='3xl:text-xl rounded-lg border border-red-300 bg-red-100 px-4 py-2 text-base font-medium whitespace-nowrap text-red-600 transition hover:bg-red-200 md:px-5 md:text-lg lg:px-6'>
                  Cancel Matching
                </button>
              )}
            </div>

            {/* === Tabs === */}
            <div className='mb-6 flex flex-wrap items-center md:mb-8'>
              {['Profile', 'Feedback', 'Documents'].map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`3xl:px-6 3xl:text-xl rounded-lg border px-4 py-2 text-base font-medium transition md:px-5 md:text-lg ${
                    index > 0 ? 'ml-2 md:ml-3 lg:ml-4' : ''
                  } ${
                    activeTab === tab
                      ? 'border-blue-400 bg-blue-100 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* === Tab Content === */}
            {/* PROFILE TAB */}
            {activeTab === 'Profile' && (
              <div className='rounded-xl border border-gray-200 bg-white p-4 text-left shadow-lg md:rounded-2xl md:p-6 lg:p-8 xl:p-10'>
                <div className='flex w-full flex-col lg:flex-row lg:justify-between'>
                  {/* Left: Profile */}
                  <div className='flex flex-col items-center sm:flex-row sm:items-start'>
                    <div className='flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-50 md:h-28 md:w-28 lg:h-32 lg:w-32'>
                      <UserRound className='h-12 w-12 text-gray-500 md:h-14 md:w-14 lg:h-16 lg:w-16' />
                    </div>
                    <div className='mt-4 text-center sm:mt-0 sm:ml-4 sm:text-left md:ml-6'>
                      <h2 className='3xl:text-4xl text-2xl font-semibold text-gray-800 md:text-2xl'>
                        {matchedMentee.name}
                      </h2>
                      <p className='lg:text-md 3xl:text-2xl text-base text-gray-600 md:text-lg'>
                        <span className='font-semibold'>Student ID:</span>{' '}
                        {matchedMentee.studentId}
                      </p>
                      <p className='lg:text-md 3xl:text-2xl text-base text-gray-600 md:text-lg'>
                        <span className='font-semibold'>Email:</span>{' '}
                        {matchedMentee.email}
                      </p>
                      <p className='lg:text-md 3xl:text-2xl text-base text-gray-600 md:text-lg'>
                        <span className='font-semibold'>Faculty:</span>{' '}
                        {matchedMentee.faculty}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className='mt-6 flex flex-col lg:gap-4'>
                  <ProfileItem
                    label='Self Description'
                    value={
                      matchedMentee.description || 'No description available.'
                    }
                    editable={false}
                  />

                  <ProfileItem
                    label='Learning Goals'
                    value={
                      matchedMentee.goals || 'No learning goals specified.'
                    }
                    editable={false}
                  />
                </div>
              </div>
            )}

            {/* FEEDBACK TAB */}
            {activeTab === 'Feedback' && (
              <div className='space-y-4 md:space-y-6'>
                {menteeSessions.map((s) => {
                  // Check if mentor has evaluated this mentee
                  const menteeEvaluation = s.mentorEvaluations?.find(
                    (ev) => ev.menteeID === matchedMentee.id,
                  );
                  const hasEvaluated = menteeEvaluation?.comment !== undefined;

                  return (
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
                        <p className='text-md mt-1 flex items-start text-gray-600'>
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
                          onClick={() => handleViewMenteeFeedback(s)}
                          className='rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 md:text-base lg:text-lg'
                        >
                          Mentee's Feedback
                        </button>
                        <button
                          onClick={() => {
                            if (hasEvaluated) {
                              handleViewYourFeedback(s);
                            } else {
                              handleGiveFeedback(s);
                            }
                          }}
                          className='rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 md:text-base lg:text-lg'
                        >
                          {hasEvaluated ? 'Your Feedback' : 'Give Feedback'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === 'Documents' && (
              <div>
                <div className='mb-4 flex items-center justify-end'>
                  <button
                    type='button'
                    className='cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-lg font-medium text-white hover:bg-blue-400'
                  >
                    Upload Documents
                  </button>
                </div>
                {mockDocuments.length > 0 ? (
                  <div>
                    {/* Existing documents list with View / Download actions (buttons only) */}
                    <ul className='space-y-4 md:space-y-5'>
                      {mockDocuments.map((doc) => (
                        <li
                          key={doc.id}
                          className='flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left text-base text-gray-700 shadow-sm md:rounded-2xl md:p-5 md:text-lg lg:p-6'
                        >
                          <div className='flex items-center space-y-3'>
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
                          </div>
                          <div className='order-last ml-4 flex flex-col items-end justify-between lg:ml-6'>
                            <div className='mb-6 flex'>
                              <details className='relative'>
                                <summary className='cursor-pointer list-none rounded-full p-2 hover:bg-gray-100'>
                                  <Ellipsis
                                    size={20}
                                    className='text-gray-900'
                                  />
                                </summary>
                                <div className='absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border bg-white py-1 shadow-lg'>
                                  <button
                                    type='button'
                                    onClick={() =>
                                      console.log('Edit file', doc.id)
                                    }
                                    className='flex w-full items-center px-4 py-2 text-left hover:bg-gray-100'
                                  >
                                    <Pencil
                                      size={20}
                                      className='mr-2 inline-block'
                                    />
                                    Edit
                                  </button>
                                  <button
                                    type='button'
                                    onClick={() =>
                                      console.log('Delete file', doc.id)
                                    }
                                    className='flex w-full items-center px-4 py-2 text-left text-red-600 hover:bg-gray-100'
                                  >
                                    <Trash
                                      size={20}
                                      className='mr-2 inline-block'
                                    />
                                    Delete
                                  </button>
                                </div>
                              </details>
                            </div>
                            <div className='mt-3 flex justify-end space-x-6 lg:mt-0'>
                              <button
                                type='button'
                                className='rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 font-medium text-blue-700 hover:bg-blue-100'
                              >
                                View
                              </button>

                              {/* Download button (no logic) */}
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
                  </div>
                ) : (
                  <p>No documents uploaded yet.</p>
                )}
              </div>
            )}
          </div>
        </main>

        <DashboardFooter />
      </div>

      {/* ===== MODALS ===== */}

      {/* Mentee's Feedback Modal (View mentee's rating of mentor - 5 stars) */}
      {selectedSession && modalType === 'mentee-feedback' && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 text-left'>
          <div className='relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl md:p-8'>
            <button
              onClick={closeModal}
              className='absolute top-4 right-4 rounded-md p-2 text-gray-500 hover:bg-gray-100'
            >
              <X size={22} />
            </button>

            <h2 className='mb-6 text-2xl font-semibold text-gray-800 md:text-3xl'>
              Mentee's Feedback - Session {selectedSession.id}
            </h2>

            <div className='space-y-4'>
              {/* Session Info */}
              <div className='rounded-lg bg-gray-50 p-4'>
                <p className='text-base text-gray-700 md:text-lg'>
                  <strong>Topic:</strong> {selectedSession.topic}
                </p>
                <p className='text-base text-gray-700 md:text-lg'>
                  <strong>Date:</strong> {selectedSession.date} |{' '}
                  {selectedSession.time}
                </p>
              </div>

              {/* Mentee's Feedback */}
              {(() => {
                const menteeFeedback = selectedSession.menteesFeedback.find(
                  (f) => f.menteeID === matchedMentee.id,
                );

                if (!menteeFeedback?.score) {
                  return (
                    <p className='text-center text-base text-gray-600 md:text-lg'>
                      {matchedMentee.name} hasn't given feedback yet.
                    </p>
                  );
                }

                return (
                  <div className='rounded-lg border border-gray-200 bg-white p-4'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <p className='text-lg font-semibold text-gray-800 md:text-xl'>
                          {matchedMentee.name}
                        </p>
                        <div className='mt-2 flex items-center gap-1'>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={24}
                              className={
                                star <= (menteeFeedback.score || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                          <span className='ml-2 text-base text-gray-600 md:text-lg'>
                            ({menteeFeedback.score}/5)
                          </span>
                        </div>
                        {menteeFeedback.comment && (
                          <p className='mt-3 text-base text-gray-700 md:text-lg'>
                            "{menteeFeedback.comment}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Give Feedback Modal (Mentor rates mentee with 10-point score) */}
      {selectedSession && modalType === 'give-feedback' && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 text-left'>
          <div className='relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl md:p-8'>
            <button
              onClick={closeModal}
              className='absolute top-4 right-4 rounded-md p-2 text-gray-500 hover:bg-gray-100'
            >
              <X size={22} />
            </button>

            <h2 className='mb-6 text-2xl font-semibold text-gray-800 md:text-3xl'>
              Evaluate Student
            </h2>

            <div className='space-y-6'>
              {/* Session and Mentee Info */}
              <div className='rounded-lg bg-gray-50 p-4'>
                <p className='text-base text-gray-700 md:text-lg'>
                  <strong>Session:</strong> {selectedSession.id} -{' '}
                  {selectedSession.topic}
                </p>
                <p className='text-base text-gray-700 md:text-lg'>
                  <strong>Mentee:</strong> {matchedMentee.name}
                </p>
                <p className='text-base text-gray-700 md:text-lg'>
                  <strong>Date:</strong> {selectedSession.date}
                </p>
              </div>

              {/* Comment */}
              <div>
                <label className='mb-2 block text-lg font-medium text-gray-800 md:text-xl'>
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder='Add your feedback for this mentee...'
                  rows={4}
                  className='w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none md:text-lg'
                />
              </div>

              {/* Submit Button */}
              <div className='flex justify-end gap-3'>
                <button
                  onClick={closeModal}
                  className='rounded-lg border border-gray-300 px-6 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 md:text-lg'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={rating === 0}
                  className='rounded-lg bg-blue-500 px-6 py-2 text-base font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300 md:text-lg'
                >
                  Submit Evaluation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Your Feedback Modal (View mentor's submitted evaluation) */}
      {selectedSession && modalType === 'your-feedback' && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 text-left'>
          <div className='relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl md:p-8'>
            <button
              onClick={closeModal}
              className='absolute top-4 right-4 rounded-md p-2 text-gray-500 hover:bg-gray-100'
            >
              <X size={22} />
            </button>

            <h2 className='mb-6 text-2xl font-semibold text-gray-800 md:text-3xl'>
              Your Feedback - Session {selectedSession.id}
            </h2>

            <div className='space-y-4'>
              {/* Session Info */}
              <div className='rounded-lg bg-gray-50 p-4'>
                <p className='text-base text-gray-700 md:text-lg'>
                  <strong>Topic:</strong> {selectedSession.topic}
                </p>
                <p className='text-base text-gray-700 md:text-lg'>
                  <strong>Mentee:</strong> {matchedMentee.name}
                </p>
                <p className='text-base text-gray-700 md:text-lg'>
                  <strong>Date:</strong> {selectedSession.date} |{' '}
                  {selectedSession.time}
                </p>
              </div>

              {/* Your Evaluation */}
              {(() => {
                const menteeEvaluation =
                  selectedSession.mentorEvaluations?.find(
                    (ev) => ev.menteeID === matchedMentee.id,
                  );

                if (!menteeEvaluation?.comment) {
                  return (
                    <div className='text-center'>
                      <p className='mb-4 text-base text-gray-600 md:text-lg'>
                        You haven't evaluated {matchedMentee.name} yet.
                      </p>
                      <button
                        onClick={() => {
                          setModalType('give-feedback');
                          setRating(0);
                          setComment('');
                        }}
                        className='rounded-lg bg-blue-500 px-6 py-2 text-base font-medium text-white hover:bg-blue-600 md:text-lg'
                      >
                        Give Feedback Now
                      </button>
                    </div>
                  );
                }

                return (
                  <div className='rounded-lg border border-gray-200 bg-white p-4'>
                    <p className='text-lg font-semibold text-gray-800 md:text-xl'>
                      {matchedMentee.name}
                    </p>
                    {menteeEvaluation.comment && (
                      <p className='mt-3 text-base text-gray-700 md:text-lg'>
                        "{menteeEvaluation.comment}"
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MentorMatchedMentees = () => {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const handleFilterToggle = () => setShowFilter(!showFilter);

  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    fromDate: '',
    toDate: '',
    sortBy: 'time',
    order: 'descending',
  });

  const handleReset = () =>
    setFilters({
      status: [],
      fromDate: '',
      toDate: '',
      sortBy: 'time',
      order: 'descending',
    });

  const handleStatusChange = (status: string) => {
    setFilters((prev) => {
      const exists = prev.status.includes(status);
      return {
        ...prev,
        status: exists
          ? prev.status.filter((s) => s !== status)
          : [...prev.status, status],
      };
    });
  };

  let mentees = mockMatchedMentees;

  // Filtering logic
  let filtered = mentees.filter((r) =>
    filters.status.length ? filters.status.includes(r.status) : true,
  );

  // Date filter logic omitted: requests do not have a timestamp property yet.
  let sorted = [...filtered];
  if (filters.sortBy === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (filters.order === 'descending') sorted.reverse();

  const handleMentorClick = (menteeId: string) => {
    navigate(`/mentor/matched-mentees/${menteeId}`);
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
              <h1 className='page-title'>Matched Mentees</h1>
              <button
                onClick={handleFilterToggle}
                className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:text-base lg:text-lg'
              >
                <Filter size={16} /> Filter
              </button>
            </div>

            {/* Mentor Cards */}
            <div className='space-y-4 md:space-y-5'>
              {sorted.map((mentee) => (
                <div
                  key={mentee.id}
                  onClick={() => handleMentorClick(mentee.id)}
                  className='flex w-full cursor-pointer flex-col items-start rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between md:rounded-2xl md:p-6 lg:p-7'
                >
                  {/* Left: Avatar + Info */}
                  <div className='flex items-center'>
                    <div className='flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-50 md:h-18 md:w-18 lg:h-20 lg:w-20'>
                      <UserRound className='h-8 w-8 text-gray-500 md:h-9 md:w-9 lg:h-10 lg:w-10' />
                    </div>

                    <div className='ml-4 min-w-0 md:ml-6'>
                      <h3 className='3xl:text-3xl truncate text-left text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl'>
                        {mentee.name}
                      </h3>
                      <p className='3xl:text-xl text-left text-sm text-gray-600 sm:text-base md:text-lg'>
                        Faculty: {mentee.faculty}
                      </p>
                      <p className='3xl:text-xl text-left text-sm text-gray-600 sm:text-base md:text-lg'>
                        Support area: {mentee.supportArea}
                      </p>
                    </div>
                  </div>

                  {/* Right: Status */}
                  <div
                    className={`3xl:px-6 3xl:text-xl mt-4 flex-shrink-0 self-center rounded-md border px-4 py-1.5 text-sm font-medium whitespace-nowrap sm:mt-0 sm:text-base md:rounded-lg md:px-5 md:py-2 md:text-lg ${statusColors[mentee.status]}`}
                  >
                    {mentee.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* FILTER POPUP */}
          {showFilter && (
            <div className='absolute top-24 right-12 z-40 w-80 rounded-2xl border border-gray-200 bg-white p-5 shadow-xl'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-base font-semibold text-gray-800 md:text-lg lg:text-xl'>
                  Filter
                </h3>
                <button
                  onClick={handleReset}
                  className='text-sm text-blue-500 hover:underline md:text-base'
                >
                  Reset
                </button>
              </div>

              <div className='md:text-md space-y-4 text-left text-gray-700'>
                <div>
                  <p className='mb-1 font-medium'>Status</p>
                  {['Active', 'Completed', 'Cancelled'].map((status) => (
                    <label key={status} className='flex items-center gap-2'>
                      <input
                        type='checkbox'
                        checked={filters.status.includes(status)}
                        onChange={() => handleStatusChange(status)}
                      />
                      {status}
                    </label>
                  ))}
                </div>

                <div>
                  <p className='mb-1 font-medium'>Time start</p>
                  <div className='flex items-center gap-2'>
                    <input
                      type='date'
                      value={filters.fromDate}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          fromDate: e.target.value,
                        }))
                      }
                      className='w-1/2 rounded-md border border-gray-300 px-2 py-1'
                      placeholder='From'
                    />
                    <input
                      type='date'
                      value={filters.toDate}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          toDate: e.target.value,
                        }))
                      }
                      className='w-1/2 rounded-md border border-gray-300 px-2 py-1'
                      placeholder='To'
                    />
                  </div>
                </div>

                <div>
                  <p className='mb-1 font-medium'>Sort by</p>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value as 'time' | 'name',
                      }))
                    }
                    className='w-full rounded-md border border-gray-300 px-2 py-1'
                  >
                    <option value='time'>Time</option>
                    <option value='name'>Name</option>
                  </select>
                  <select
                    value={filters.order}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        order: e.target.value as 'ascending' | 'descending',
                      }))
                    }
                    className='mt-2 w-full rounded-md border border-gray-300 px-2 py-1'
                  >
                    <option value='ascending'>Ascending</option>
                    <option value='descending'>Descending</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setShowFilter(false)}
                className='3xl:text-lg mt-5 w-full rounded-lg bg-blue-500 py-2 text-sm font-medium text-white hover:bg-blue-600 md:text-base'
              >
                Apply
              </button>
            </div>
          )}
        </main>

        <DashboardFooter />
      </div>
    </div>
  );
};

export default MentorMatchedMentees;
export { MatchedMenteeDetail };
