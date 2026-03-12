import { useState } from 'react';
import SidebarWrapper from '@/components/layouts/SidebarWrapper';
import DashboardFooter from '@/components/layouts/Footer';
import { CalendarDays, Clock, List, X, Star } from 'lucide-react';
import {
  mockSessionFeedback,
  mockMentees,
  type SessionFeedback,
} from './constants/mentorData';

type FeedbackModalType = 'mentee-feedback' | 'give-feedback' | 'your-feedback';

const MentorFeedback = () => {
  const [sessions, setSessions] =
    useState<SessionFeedback[]>(mockSessionFeedback);
  const [selectedSession, setSelectedSession] =
    useState<SessionFeedback | null>(null);
  const [modalType, setModalType] = useState<FeedbackModalType | null>(null);
  const [selectedMenteeId, setSelectedMenteeId] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('');

  // Filter only completed sessions (sessions that have ended)
  const completedSessions = sessions;

  const handleViewMenteeFeedback = (session: SessionFeedback) => {
    // Get the latest version of this session from state
    const currentSession = sessions.find((s) => s.id === session.id);
    setSelectedSession(currentSession || session);
    setModalType('mentee-feedback');
  };

  const handleGiveFeedback = (session: SessionFeedback, menteeId: string) => {
    // Get the latest version of this session from state
    const currentSession = sessions.find((s) => s.id === session.id);
    setSelectedSession(currentSession || session);
    setSelectedMenteeId(menteeId);
    setModalType('give-feedback');
    setComment('');
  };

  const handleViewYourFeedback = (
    session: SessionFeedback,
    menteeId: string,
  ) => {
    // Get the latest version of this session from state
    const currentSession = sessions.find((s) => s.id === session.id);
    setSelectedSession(currentSession || session);
    setSelectedMenteeId(menteeId);
    setModalType('your-feedback');
  };

  const handleSubmitFeedback = () => {
    if (!selectedSession || !selectedMenteeId) return;

    // Update the sessions state
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id !== selectedSession.id) return session;

        // Initialize mentorEvaluations if it doesn't exist
        const currentEvaluations = session.mentorEvaluations || [];

        // Find the mentor evaluation to update or add
        const updatedEvaluations = currentEvaluations.find(
          (ev) => ev.menteeID === selectedMenteeId,
        )
          ? currentEvaluations.map((ev) =>
              ev.menteeID === selectedMenteeId
                ? { ...ev, comment: comment || undefined }
                : ev,
            )
          : [
              ...currentEvaluations,
              {
                menteeID: selectedMenteeId,
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

    // Close modal
    setSelectedSession(null);
    setModalType(null);
    setSelectedMenteeId(null);
    setComment('');
  };

  const closeModal = () => {
    setSelectedSession(null);
    setModalType(null);
    setSelectedMenteeId(null);
    setComment('');
  };

  const getMenteeById = (id: string) => {
    return mockMentees.find((m) => m.id === id);
  };

  // Get mentees who haven't been evaluated yet by the mentor
  const getUnevaluatedMentees = (session: SessionFeedback) => {
    const evaluatedIds = (session.mentorEvaluations || [])
      .filter((ev) => ev.comment !== undefined)
      .map((ev) => ev.menteeID);
    return session.menteesFeedback
      .filter((f) => !evaluatedIds.includes(f.menteeID))
      .map((f) => getMenteeById(f.menteeID))
      .filter(Boolean);
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
              <h1 className='page-title'>Feedback</h1>
            </div>

            {/* Sessions List */}
            {completedSessions.length === 0 ? (
              <div className='rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm'>
                <p className='text-lg text-gray-600 md:text-xl lg:text-2xl'>
                  No completed sessions available
                </p>
              </div>
            ) : (
              <div className='space-y-4 md:space-y-5'>
                {completedSessions.map((session) => {
                  const evaluatedCount = (
                    session.mentorEvaluations || []
                  ).filter((ev) => ev.comment !== undefined).length;
                  const totalMentees = session.menteesFeedback.length;

                  return (
                    <div
                      key={session.id}
                      className='flex w-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:rounded-2xl md:p-6 lg:p-7'
                    >
                      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
                        {/* Session Info */}
                        <div className='flex-1'>
                          <h3 className='text-left text-lg font-semibold text-gray-800 md:text-xl lg:text-2xl'>
                            Session {session.id}
                          </h3>
                          <p className='3xl:text-xl mt-1 flex items-center text-sm text-gray-600 sm:text-base md:text-lg'>
                            <CalendarDays
                              size={16}
                              className='mr-2 md:h-[18px] md:w-[18px]'
                            />
                            {session.date}
                          </p>
                          <p className='3xl:text-xl mt-1 flex items-center text-sm text-gray-600 sm:text-base md:text-lg'>
                            <Clock
                              size={16}
                              className='mr-2 md:h-[18px] md:w-[18px]'
                            />
                            {session.time}
                          </p>
                          <p className='3xl:text-xl mt-1 flex items-start text-sm text-gray-600 sm:text-base md:text-lg'>
                            <List
                              size={16}
                              className='mt-1 mr-2 md:h-[18px] md:w-[18px]'
                            />
                            <span className='text-left'>
                              {session.topic}
                              <br />
                              {session.problem}
                            </span>
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className='mt-4 flex flex-col gap-3 lg:mt-0 lg:ml-6 lg:min-w-[220px]'>
                          <button
                            onClick={() => handleViewMenteeFeedback(session)}
                            className='rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 md:text-base lg:text-lg'
                          >
                            Mentee's Feedback
                          </button>
                          <button
                            onClick={() =>
                              handleViewYourFeedback(
                                session,
                                session.menteesFeedback[0]?.menteeID || '',
                              )
                            }
                            className='rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 md:text-base lg:text-lg'
                          >
                            {session.mentorFeedback
                              ? `Your Feedback (${evaluatedCount}/${totalMentees})`
                              : 'Give Feedback'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        <DashboardFooter />
      </div>

      {/* ===== MODALS ===== */}

      {/* Mentee's Feedback Modal */}
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

              {/* Feedback List */}
              {selectedSession.menteesFeedback.filter((f) => f.score).length ===
              0 ? (
                <p className='text-center text-base text-gray-600 md:text-lg'>
                  No feedback from mentees yet.
                </p>
              ) : (
                <div className='space-y-4'>
                  {selectedSession.menteesFeedback
                    .filter((f) => f.score)
                    .map((feedback) => {
                      const mentee = getMenteeById(feedback.menteeID);
                      return (
                        <div
                          key={feedback.menteeID}
                          className='rounded-lg border border-gray-200 bg-white p-4'
                        >
                          <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                              <p className='text-lg font-semibold text-gray-800 md:text-xl'>
                                {mentee?.name || 'Unknown Mentee'}
                              </p>
                              {feedback.score && (
                                <div className='mt-2 flex items-center gap-1'>
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={24}
                                      className={
                                        star <= (feedback.score || 0)
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }
                                    />
                                  ))}
                                  <span className='ml-2 text-base text-gray-600 md:text-lg'>
                                    ({feedback.score}/5)
                                  </span>
                                </div>
                              )}
                              {feedback.comment && (
                                <p className='mt-3 text-base text-gray-700 md:text-lg'>
                                  "{feedback.comment}"
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Show mentees who haven't given feedback yet */}
              {selectedSession.menteesFeedback.filter((f) => !f.score).length >
                0 && (
                <div className='mt-4 rounded-lg bg-amber-50 p-4'>
                  <p className='text-base font-medium text-amber-800 md:text-lg'>
                    No feedback yet from:
                  </p>
                  <ul className='mt-2 list-inside list-disc text-base text-amber-700 md:text-lg'>
                    {selectedSession.menteesFeedback
                      .filter((f) => !f.score)
                      .map((feedback) => {
                        const mentee = getMenteeById(feedback.menteeID);
                        return <li key={feedback.menteeID}>{mentee?.name}</li>;
                      })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Give Feedback Modal */}
      {selectedSession && modalType === 'give-feedback' && selectedMenteeId && (
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
                  <strong>Mentee:</strong>{' '}
                  {getMenteeById(selectedMenteeId)?.name || 'Unknown'}
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
                  className='rounded-lg bg-blue-500 px-6 py-2 text-base font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300 md:text-lg'
                >
                  Submit Evaluation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Your Feedback Modal (View submitted feedback) */}
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
                  <strong>Date:</strong> {selectedSession.date} |{' '}
                  {selectedSession.time}
                </p>
              </div>

              {/* No feedback yet */}
              {!selectedSession.mentorFeedback ? (
                <div className='text-center'>
                  <p className='mb-4 text-base text-gray-600 md:text-lg'>
                    You haven't evaluated any mentees for this session yet.
                  </p>
                  <p className='mb-6 text-sm text-gray-500 md:text-base'>
                    Click on a mentee below to evaluate them:
                  </p>
                  <div className='space-y-3'>
                    {selectedSession.menteesFeedback.map((feedback) => {
                      const mentee = getMenteeById(feedback.menteeID);
                      return (
                        <button
                          key={feedback.menteeID}
                          onClick={() =>
                            handleGiveFeedback(
                              selectedSession,
                              feedback.menteeID,
                            )
                          }
                          className='w-full rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 text-left text-base font-medium text-blue-700 hover:bg-blue-100 md:text-lg'
                        >
                          Evaluate {mentee?.name || 'Unknown Mentee'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <>
                  {/* Evaluated mentees */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-800 md:text-xl'>
                      Evaluated Mentees
                    </h3>
                    {(selectedSession.mentorEvaluations || [])
                      .filter((ev) => ev.comment !== undefined)
                      .map((evaluation) => {
                        const mentee = getMenteeById(evaluation.menteeID);
                        return (
                          <div
                            key={evaluation.menteeID}
                            className='rounded-lg border border-gray-200 bg-white p-4'
                          >
                            <p className='text-lg font-semibold text-gray-800 md:text-xl'>
                              {mentee?.name || 'Unknown Mentee'}
                            </p>
                            {evaluation.comment && (
                              <p className='mt-3 text-base text-gray-700 md:text-lg'>
                                "{evaluation.comment}"
                              </p>
                            )}
                          </div>
                        );
                      })}
                  </div>

                  {/* Not yet evaluated */}
                  {getUnevaluatedMentees(selectedSession).length > 0 && (
                    <div className='space-y-3'>
                      <h3 className='text-lg font-semibold text-gray-800 md:text-xl'>
                        Not Yet Evaluated
                      </h3>
                      {selectedSession.menteesFeedback
                        .filter((f) => {
                          const evaluatedIds = (
                            selectedSession.mentorEvaluations || []
                          )
                            .filter((ev) => ev.comment !== undefined)
                            .map((ev) => ev.menteeID);
                          return !evaluatedIds.includes(f.menteeID);
                        })
                        .map((feedback) => {
                          const mentee = getMenteeById(feedback.menteeID);
                          return (
                            <button
                              key={feedback.menteeID}
                              onClick={() =>
                                handleGiveFeedback(
                                  selectedSession,
                                  feedback.menteeID,
                                )
                              }
                              className='w-full rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 text-left text-base font-medium text-blue-700 hover:bg-blue-100 md:text-lg'
                            >
                              Evaluate {mentee?.name || 'Unknown Mentee'}
                            </button>
                          );
                        })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorFeedback;
