import SidebarWrapper from '@/components/layouts/SidebarWrapper';
import { DashboardFooter } from '../dashboard/components';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import {
  mockMeetings,
  statusColors,
  type Meeting,
  type Mentee,
  mockMatchedMentees,
} from './constants/mentorData';
import type { CalendarEvent } from '@/constants/data';
import {
  Clock,
  CalendarDays,
  MapPin,
  UserRound,
  X,
  Menu,
  CircleHelp,
  Plus,
  Check,
  CircleEllipsis,
} from 'lucide-react';
const statusIcons: Record<string, ReactElement> = {
  Accepted: <Check className='text-green-600' size={20} />,
  Pending: <CircleEllipsis className='text-amber-600' size={20} />,
  Rejected: <X className='text-red-600' size={20} />,
};

import Calendar from '../../components/ui/Calendar';

const UpcomingMeetings = ({
  meetings,
  setMeetings,
}: {
  meetings: Meeting[];
  setMeetings: React.Dispatch<React.SetStateAction<Meeting[]>>;
}) => {
  const navigate = useNavigate();

  // Keep indexes so deletion is precise
  const [selectedEvent, setSelectedEvent] = useState<{
    event: NonNullable<Meeting['events']>[number];
    meeting: Meeting;
    meetingIndex: number;
    eventIndex: number;
  } | null>(null);

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCancelConfirm, setIsCancelConfirm] = useState(false);

  // Reschedule fields - multiple times and locations
  const [proposedTimes, setProposedTimes] = useState<
    { date: string; startTime: string; endTime: string }[]
  >([{ date: '', startTime: '', endTime: '' }]);
  const [proposedLocations, setProposedLocations] = useState<
    { location: string; isOnline: boolean }[]
  >([{ location: '', isOnline: true }]);
  const [isOnline, setIsOnline] = useState(true);

  const handleCancelMeeting = () => {
    if (!selectedEvent) return;
    const { meetingIndex, eventIndex } = selectedEvent;

    setMeetings((prev) =>
      prev.map((m, idx) =>
        idx === meetingIndex
          ? {
              ...m,
              events: (m.events || []).filter((_, j) => j !== eventIndex),
            }
          : m,
      ),
    );

    setIsCancelConfirm(false);
    setSelectedEvent(null);
  };

  // === Group meetings by month ===
  const groupedByMonth = meetings.reduce<
    Record<string, { meeting: Meeting; originalIndex: number }[]>
  >((acc, m, idx) => {
    if (!acc[m.month]) acc[m.month] = [];
    acc[m.month].push({ meeting: m, originalIndex: idx });
    return acc;
  }, {});

  return (
    <div className='3xl:space-y-10 space-y-6'>
      {Object.entries(groupedByMonth).map(([month, monthMeetings]) => (
        <section key={month}>
          {/* ===== Month Header ===== */}
          <h2 className='3xl:mb-6 3xl:text-3xl mb-2 border-b border-gray-200 pb-2 text-xl font-bold text-gray-900'>
            {month} 2025
          </h2>

          {/* ===== Days ===== */}
          <div className='3xl:space-y-6 space-y-2'>
            {monthMeetings.map(({ meeting, originalIndex }) => (
              <div key={meeting.id}>
                {/* ===== Date Row ===== */}
                <div className='mb-2 flex items-center space-x-2'>
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-base font-medium text-gray-700 ${meeting.date === 'Fri 30' ? 'bg-gray-700 text-white' : ''}`}
                  >
                    {meeting.date.split(' ')[1]}
                  </div>
                  <span className='text-md 3xl:ml-2 3xl:text-2xl text-xl font-semibold text-gray-700'>
                    {meeting.day}
                  </span>
                </div>

                {/* ===== Event Cards ===== */}
                {meeting.events && meeting.events.length > 0 ? (
                  <div className='space-y-3'>
                    {meeting.events.map((event, eventIndex) => (
                      <div
                        key={event.id}
                        onClick={() =>
                          setSelectedEvent({
                            event,
                            meeting,
                            meetingIndex: originalIndex,
                            eventIndex,
                          })
                        }
                        className={`cursor-pointer rounded-lg border p-4 transition hover:shadow-md ${statusColors[event.status]} shadow-sm`}
                      >
                        <div className='3xl:text-base 3xl:text-xl mb-1 text-left text-sm font-semibold sm:text-base md:text-lg'>
                          {event.title}
                        </div>
                        <div className='3xl:text-xs md:text-md 3xl:text-lg text-left text-sm text-gray-600 sm:text-sm'>
                          {event.subject}
                        </div>
                        <div className='md:text-md 3xl:text-lg mt-1 flex items-center gap-1 text-xs text-gray-500 sm:text-sm'>
                          <Clock size={14} />
                          <span>
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='ml-10 flex items-center gap-1 text-sm text-gray-400 italic sm:text-base md:text-lg lg:text-xl'>
                    <CalendarDays size={14} /> No event
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* ===== Details Popup ===== */}
      {selectedEvent && !isRescheduling && !isCancelConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='relative w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl'>
            <button
              onClick={() => setSelectedEvent(null)}
              className='absolute top-4 right-4 rounded-md p-2 text-gray-500 hover:bg-gray-100'
            >
              <X size={22} />
            </button>

            <h2 className='3xl:text-2xl mb-5 text-left text-xl font-semibold text-gray-800'>
              Meeting Details
            </h2>

            <div className='3xl:mb-4 mb-2 flex items-center gap-2'>
              <span
                className={`h-4 w-4 rounded-full border ${
                  selectedEvent.event.status === 'completed'
                    ? 'border-green-400 bg-green-200'
                    : selectedEvent.event.status === 'upcoming'
                      ? 'border-blue-400 bg-blue-200'
                      : selectedEvent.event.status === 'pending'
                        ? 'border-yellow-400 bg-yellow-200'
                        : 'border-gray-400 bg-gray-300'
                }`}
              />
              <span className='text-md 3xl:text-lg font-medium text-gray-700 capitalize'>
                {selectedEvent.event.status}
              </span>
            </div>

            <p className='3xl:text-lg text-md text-left text-gray-700'>
              {selectedEvent.meeting.day}, {selectedEvent.meeting.month}{' '}
              {selectedEvent.meeting.date.split(' ')[1]}, 2025
              <br />
              <span className='text-base text-gray-600'>
                {selectedEvent.event.startTime} - {selectedEvent.event.endTime}
              </span>
            </p>

            <hr className='my-4 border-gray-200' />

            <div className='text-md 3xl:text-lg space-y-3 text-gray-700'>
              {selectedEvent.event.link ? (
                <p className='flex items-center gap-2'>
                  <MapPin size={18} className='text-gray-600' />
                  <span>
                    Online:{' '}
                    <a
                      href={selectedEvent.event.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 underline'
                    >
                      {selectedEvent.event.link}
                    </a>
                  </span>
                </p>
              ) : selectedEvent.event.location ? (
                <p className='flex items-center gap-2'>
                  <MapPin size={18} className='text-gray-600' />
                  <span>Location: {selectedEvent.event.location}</span>
                </p>
              ) : null}

              <p className='flex items-start gap-2'>
                <UserRound size={18} className='mt-1 text-gray-600' />
                {selectedEvent.event.mentees.length === 1 ? (
                  <span>Mentee: {selectedEvent.event.mentees[0].name}</span>
                ) : (
                  <div className='flex flex-col gap-2 text-left'>
                    Mentees:
                    {selectedEvent.event.mentees.map((mentee, idx) => (
                      <div
                        key={`mentee-${idx}`}
                        className='flex items-center justify-between gap-24'
                      >
                        {mentee.name}
                        {statusIcons[mentee.status]}
                      </div>
                    ))}
                  </div>
                )}
              </p>
              <p className='flex items-start gap-2'>
                <Menu size={20} className='mt-1 text-gray-600' />
                <p className='text-left text-gray-700'>
                  {selectedEvent.event.description}
                </p>
              </p>
              {selectedEvent.event.status === 'cancelled' && (
                <p className='flex items-start gap-2'>
                  <CircleHelp size={20} className='mt-1 text-gray-600' />
                  <p className='text-left text-gray-700'>
                    Cancel reason: {selectedEvent.event.cancelReason}
                  </p>
                </p>
              )}
            </div>

            {selectedEvent.event.status === 'upcoming' && (
              <div className='mt-6 flex justify-end gap-3'>
                <button
                  onClick={() => setIsCancelConfirm(true)}
                  className='text-md 3xl:text-lg rounded-lg border border-red-300 bg-red-100 px-5 py-2 font-medium text-red-700 hover:bg-red-200'
                >
                  Cancel Meeting
                </button>
                <button
                  onClick={() => {
                    if (selectedEvent.event.mentees.length === 1) {
                      setIsRescheduling(true);
                    } else {
                      alert(
                        'Rescheduling for group session is not allowed. Please cancel and create a new session.',
                      );
                    }
                  }}
                  className='text-md 3xl:text-lg rounded-lg border border-blue-300 bg-blue-100 px-5 py-2 font-medium text-blue-700 hover:bg-blue-200'
                >
                  Reschedule
                </button>
              </div>
            )}
            {selectedEvent.event.status === 'pending' && (
              <div className='mt-6 flex justify-end gap-3'>
                <button
                  onClick={() => navigate('/mentor/received-requests')}
                  className='text-md 3xl:text-lg rounded-lg border border-blue-300 bg-blue-100 px-5 py-2 font-medium text-blue-700 hover:bg-blue-200'
                >
                  View Reschedule Request
                </button>
              </div>
            )}
            {selectedEvent.event.status === 'completed' && (
              <div className='mt-6 flex justify-end gap-3'>
                <button
                  onClick={() => navigate('/mentor/feedback')}
                  className='text-md 3xl:text-lg rounded-lg border border-blue-300 bg-blue-100 px-5 py-2 font-medium text-blue-700 hover:bg-blue-200'
                >
                  Feedback
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reschedule modal - allows mentor to propose new times and locations for rescheduling */}
      {isRescheduling && selectedEvent && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <div className='3xl:p-10 relative max-h-[85vh] w-full max-w-7xl overflow-y-auto rounded-3xl bg-white p-8 shadow-xl'>
            <button
              onClick={() => {
                setIsRescheduling(false);
                setProposedTimes([{ date: '', startTime: '', endTime: '' }]);
                setProposedLocations([{ location: '', isOnline: true }]);
                setIsOnline(true);
              }}
              className='absolute top-4 right-4 rounded-md p-2 text-gray-500 hover:bg-gray-100'
            >
              <X size={22} />
            </button>

            <h2 className='3xl:text-3xl mb-8 text-xl font-semibold text-gray-800'>
              Reschedule Meeting
            </h2>

            <div className='flex w-full flex-col gap-10 md:flex-row'>
              {/* Left section: Displays current meeting details for reference */}
              <div className='3xl:space-y-4 3xl:text-lg text-md w-full space-y-2 border-r pr-6 text-gray-700 md:w-2/5'>
                <h3 className='3xl:text-xl text-lg font-semibold text-gray-800'>
                  Current Details
                </h3>

                <div className='flex items-center gap-2'>
                  <span
                    className={`h-4 w-4 rounded-full border ${
                      selectedEvent.event.status === 'completed'
                        ? 'border-green-400 bg-green-200'
                        : selectedEvent.event.status === 'upcoming'
                          ? 'border-blue-400 bg-blue-200'
                          : selectedEvent.event.status === 'pending'
                            ? 'border-yellow-400 bg-yellow-200'
                            : 'border-gray-400 bg-gray-300'
                    }`}
                  />
                  <span className='text-md 3xl:text-lg font-medium capitalize'>
                    {selectedEvent.event.status}
                  </span>
                </div>

                <p className='text-left'>
                  {selectedEvent.meeting.day}, {selectedEvent.meeting.month}{' '}
                  {selectedEvent.meeting.date.split(' ')[1]}, 2025
                </p>
                <p className='text-left text-gray-600'>
                  {selectedEvent.event.startTime} -{' '}
                  {selectedEvent.event.endTime}
                </p>

                {selectedEvent.event.link ? (
                  <p className='flex items-center gap-2 text-left'>
                    <MapPin size={18} className='text-gray-600' />
                    <span>
                      Online:{' '}
                      <a
                        href={selectedEvent.event.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 underline'
                      >
                        {selectedEvent.event.link}
                      </a>
                    </span>
                  </p>
                ) : selectedEvent.event.location ? (
                  <p className='flex items-center gap-2'>
                    <MapPin size={18} className='text-gray-600' />
                    <span>Location: {selectedEvent.event.location}</span>
                  </p>
                ) : null}

                <p className='flex items-center gap-2'>
                  <UserRound size={18} className='text-gray-600' />
                  <span>Mentee: {selectedEvent.event.mentees[0].name}</span>
                </p>
                <p className='flex items-start gap-2'>
                  <Menu size={20} className='mt-1 text-gray-600' />
                  <p className='text-left text-gray-700'>
                    {selectedEvent.event.description}
                  </p>
                </p>
              </div>

              {/* Right section: Editable form for proposing new meeting times and locations */}
              <div className='3xl:space-y-8 w-full space-y-6 md:w-3/5'>
                <h3 className='3xl:text-xl text-lg font-semibold text-gray-800'>
                  New Details
                </h3>

                <div>
                  <h4 className='text-md 3xl:text-lg mb-3 flex items-center gap-2 font-medium text-gray-800'>
                    <Clock size={18} className='text-gray-600' /> Proposed Times
                  </h4>

                  <div className='space-y-3'>
                    {/* Input form for the first time slot with add button */}
                    <div className='flex flex-wrap items-center gap-3'>
                      <input
                        type='date'
                        value={proposedTimes[0].date}
                        onChange={(e) => {
                          const updated = [...proposedTimes];
                          updated[0].date = e.target.value;
                          setProposedTimes(updated);
                        }}
                        className='rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none'
                      />
                      <input
                        type='time'
                        value={proposedTimes[0].startTime}
                        onChange={(e) => {
                          const updated = [...proposedTimes];
                          updated[0].startTime = e.target.value;
                          setProposedTimes(updated);
                        }}
                        className='rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-400 focus:outline-none'
                      />
                      <span className='text-gray-500'>to</span>
                      <input
                        type='time'
                        value={proposedTimes[0].endTime}
                        onChange={(e) => {
                          const updated = [...proposedTimes];
                          updated[0].endTime = e.target.value;
                          setProposedTimes(updated);
                        }}
                        className='rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-400 focus:outline-none'
                      />
                      <button
                        onClick={() => {
                          if (
                            proposedTimes[0].date &&
                            proposedTimes[0].startTime &&
                            proposedTimes[0].endTime
                          ) {
                            setProposedTimes([
                              { date: '', startTime: '', endTime: '' },
                              ...proposedTimes,
                            ]);
                          } else {
                            alert('Please fill in all fields before adding.');
                          }
                        }}
                        className='rounded-full border border-blue-300 bg-blue-50 p-2 text-blue-700 hover:bg-blue-100'
                        title='Add Time Slot'
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    {/* Display list of added time slots with remove functionality */}
                    {proposedTimes.slice(1).map((timeSlot, index) => (
                      <div
                        key={index + 1}
                        className='flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3'
                      >
                        <span className='text-gray-700'>
                          {timeSlot.date
                            ? new Date(timeSlot.date).toLocaleDateString(
                                'en-US',
                                {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                },
                              )
                            : 'No date'}{' '}
                          - {timeSlot.startTime || '--:--'} to{' '}
                          {timeSlot.endTime || '--:--'}
                        </span>
                        <button
                          onClick={() => {
                            setProposedTimes(
                              proposedTimes.filter((_, i) => i !== index + 1),
                            );
                          }}
                          className='rounded-full border border-red-300 bg-red-50 p-2 text-red-600 hover:bg-red-100'
                          title='Remove'
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className='text-md 3xl:text-lg mb-3 flex items-center gap-2 font-medium text-gray-800'>
                    <MapPin size={18} className='text-gray-600' /> Proposed
                    Locations
                  </h4>

                  <div className='space-y-3'>
                    {/* Input form for location with online/offline toggle and add button */}
                    <div className='flex flex-wrap items-center gap-3'>
                      <button
                        className={`rounded-lg border px-4 py-2 text-gray-700 transition ${
                          isOnline
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-300 hover:bg-gray-100'
                        }`}
                        onClick={() => setIsOnline(true)}
                      >
                        Online
                      </button>
                      <button
                        className={`rounded-lg border px-4 py-2 text-gray-700 transition ${
                          !isOnline
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-300 hover:bg-gray-100'
                        }`}
                        onClick={() => setIsOnline(false)}
                      >
                        Offline
                      </button>
                      <input
                        type='text'
                        placeholder={
                          isOnline
                            ? 'Enter meeting link or platform'
                            : 'Enter location'
                        }
                        value={proposedLocations[0].location}
                        onChange={(e) => {
                          const updated = [...proposedLocations];
                          updated[0].location = e.target.value;
                          setProposedLocations(updated);
                        }}
                        className='flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none'
                      />
                      <button
                        onClick={() => {
                          if (proposedLocations[0].location.trim()) {
                            setProposedLocations([
                              { location: '', isOnline: true },
                              { ...proposedLocations[0], isOnline: isOnline },
                              ...proposedLocations.slice(1),
                            ]);
                            setIsOnline(true);
                          } else {
                            alert('Please enter a location before adding.');
                          }
                        }}
                        className='rounded-full border border-blue-300 bg-blue-50 p-2 text-blue-700 hover:bg-blue-100'
                        title='Add Location'
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    {/* Display list of added locations with online/offline badges and remove functionality */}
                    {proposedLocations.slice(1).map((locationObj, index) => (
                      <div
                        key={index + 1}
                        className='flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3'
                      >
                        <span className='text-gray-700'>
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                              locationObj.isOnline
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {locationObj.isOnline ? 'Online' : 'Offline'}
                          </span>{' '}
                          {locationObj.location || 'No location specified'}
                        </span>
                        <button
                          onClick={() => {
                            setProposedLocations(
                              proposedLocations.filter(
                                (_, i) => i !== index + 1,
                              ),
                            );
                          }}
                          className='rounded-full border border-red-300 bg-red-50 p-2 text-red-600 hover:bg-red-100'
                          title='Remove'
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='3xl:mt-10 mt-6 flex justify-end gap-3'>
              <button
                onClick={() => {
                  const validTimes = proposedTimes.filter(
                    (t) => t.date && t.startTime && t.endTime,
                  );
                  const validLocations = proposedLocations.filter(
                    (l) => l.location,
                  );

                  if (validTimes.length === 0 || validLocations.length === 0) {
                    alert('Please provide at least one time and one location');
                    return;
                  }

                  // Update event status to pending
                  setMeetings((prev) =>
                    prev.map((m, idx) =>
                      idx === selectedEvent.meetingIndex
                        ? {
                            ...m,
                            events: m.events?.map((e, eIdx) =>
                              eIdx === selectedEvent.eventIndex
                                ? { ...e, status: 'pending' }
                                : e,
                            ),
                          }
                        : m,
                    ),
                  );

                  setIsRescheduling(false);
                  setSelectedEvent(null);
                  setProposedTimes([{ date: '', startTime: '', endTime: '' }]);
                  setProposedLocations([{ location: '', isOnline: true }]);
                  setIsOnline(true);
                }}
                className='text-md 3xl:text-lg rounded-lg border border-blue-300 bg-blue-100 px-6 py-2 font-medium text-blue-700 hover:bg-blue-200'
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Cancel Confirmation Popup ===== */}
      {isCancelConfirm && selectedEvent && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl'>
            <h2 className='3xl:text-2xl mb-4 text-lg font-semibold text-gray-800'>
              Cancel Meeting
            </h2>
            <p className='text-md 3xl:text-lg mb-2 text-gray-700'>
              Are you sure you want to cancel this meeting with{' '}
              {selectedEvent.event.mentees.length === 1 ? (
                <span className='font-semibold'>
                  {selectedEvent.event.mentees[0].name}
                </span>
              ) : (
                <span className='font-semibold'>
                  {selectedEvent.event.mentees.length} mentees
                </span>
              )}
              {'?'}
            </p>
            <textarea
              id='cancel-reason'
              placeholder='Optional: Provide a reason for cancellation'
              className='3xl:text-lg mb-6 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none'
              rows={4}
            />
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setIsCancelConfirm(false)}
                className='text-md 3xl:text-lg rounded-lg border border-gray-300 bg-gray-100 px-5 py-2 font-medium text-gray-700 hover:bg-gray-200'
              >
                No
              </button>
              <button
                onClick={handleCancelMeeting}
                className='text-md 3xl:text-lg rounded-lg border border-red-300 bg-red-100 px-5 py-2 font-medium text-red-700 hover:bg-red-200'
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CreateSessionPopup = ({ onClose }: { onClose: () => void }) => {
  const [sessionName, setSessionName] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [mode, setMode] = useState('Online');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [addedMentees, setAddedMentees] = useState<Mentee[]>([]);

  const toggleMentee = (mentee: Mentee) => {
    if (addedMentees.find((m) => m.id === mentee.id)) {
      setAddedMentees(addedMentees.filter((m) => m.id !== mentee.id));
    } else {
      setAddedMentees([...addedMentees, mentee]);
    }
  };
  const filteredMentees = mockMatchedMentees.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) &&
      m.status === 'Active',
  );

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='3xl:p-10 relative w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-8 shadow-xl'>
        {/* Close Button */}
        <button
          onClick={() => {
            setSessionName('');
            setDate('');
            setStartTime('');
            setEndTime('');
            setMode('Online');
            setLocation('');
            setDescription('');
            setSearch('');
            setAddedMentees([]);
            onClose();
          }}
          className='absolute top-4 right-4 rounded-md p-2 hover:bg-gray-100'
        >
          <X size={22} />
        </button>

        <h2 className='3xl:text-3xl mb-8 text-xl font-semibold text-gray-800'>
          Create session
        </h2>

        <div className='flex gap-6'>
          {/* ===== Left Section ===== */}
          <div className='flex-1 space-y-4'>
            <div>
              <input
                type='text'
                placeholder='Session Name'
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className='3xl:text-2xl mt-1 w-full border-b border-gray-300 px-3 py-2 text-lg font-bold outline-none focus:border-b-2 focus:border-blue-500'
              />
            </div>

            <div className='flex items-center gap-3'>
              <Clock size={20} className='text-gray-500' />
              <input
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className='rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none'
              />
              <input
                type='time'
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className='rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none'
              />
              <span>to</span>
              <input
                type='time'
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className='rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none'
              />
            </div>

            <div className='flex items-center gap-3'>
              <MapPin size={20} className='text-gray-500' />
              <button
                className={`rounded-lg border px-4 py-2 text-gray-700 transition ${
                  mode === 'Online'
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => setMode('Online')}
              >
                Online
              </button>
              <button
                className={`rounded-lg border px-4 py-2 text-gray-700 transition ${
                  mode === 'Offline'
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => setMode('Offline')}
              >
                Offline
              </button>

              <span>at</span>
              <input
                type='text'
                value={location}
                placeholder='Enter location'
                onChange={(e) => setLocation(e.target.value)}
                className='flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none'
              />
            </div>

            <div>
              <div className='flex items-start gap-2 text-gray-600'>
                <Menu size={20} className='mt-2' />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Describe the session content'
                  rows={3}
                  className='mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                />
              </div>
            </div>
          </div>

          {/* ===== Right Section ===== */}
          <div className='flex w-[360px] max-w-full flex-col border-l pl-4'>
            <span className='mb-2 text-lg font-semibold text-gray-700'>
              Invite mentee
            </span>
            <input
              type='text'
              placeholder='Search mentee'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='mb-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
            />

            <div className='h-[300px] w-full space-y-2 overflow-y-auto pr-2'>
              {filteredMentees.map((mentee) => {
                const added = addedMentees.find((m) => m.id === mentee.id);
                return (
                  <div
                    key={mentee.id}
                    className='flex items-center justify-between rounded-lg border px-4 py-2 hover:bg-gray-50'
                  >
                    <div>
                      <p className='font-medium text-gray-800'>{mentee.name}</p>
                      <p className='text-sm text-gray-500'>{mentee.email}</p>
                    </div>
                    <button
                      onClick={() => toggleMentee(mentee)}
                      className={`rounded-full border p-1 ${added ? 'bg-blue-500 hover:bg-blue-400' : 'bg-none hover:bg-gray-200'}`}
                    >
                      {added ? (
                        <Check
                          size={18}
                          strokeWidth={3}
                          className='text-white'
                        />
                      ) : (
                        <Plus
                          size={18}
                          strokeWidth={3}
                          className='text-gray-600'
                        />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <p className='mt-2 text-sm text-gray-500'>
              Added {addedMentees.length} mentee
              {addedMentees.length !== 1 && 's'}
            </p>

            <button className='mt-4 w-full rounded-lg bg-blue-500 py-2 text-sm font-medium text-white hover:bg-blue-400'>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MentorDashboard = () => {
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);

  const calendarEvents: CalendarEvent[] = useMemo(
    () =>
      meetings.flatMap((meeting, meetingIndex) =>
        (meeting.events || []).map((event, eventIndex) => ({
          id: `MCE${String(meetingIndex + 1).padStart(3, '0')}${String(
            eventIndex + 1,
          ).padStart(1, '0')}`,
          meetingId: meeting.id,
          eventId: event.id,
          day: meeting.day,
          time: event.startTime,
          endTime: event.endTime,
        })),
      ),
    [meetings],
  );

  const getPopulatedEvent = (ce: CalendarEvent) => {
    const meeting = meetings.find((m) => m.id === ce.meetingId);
    const event = meeting?.events?.find((e) => e.id === ce.eventId);
    // For mentor view, the current user is the mentor; no need to resolve mentor by event
    return { calendarEvent: ce, meeting, event, mentor: undefined };
  };
  return (
    <div className='page-layout'>
      {/* Sidebar */}
      <SidebarWrapper />

      {/* Main Content */}
      <div className='flex flex-1 flex-col'>
        <main className='w-full flex-1 py-12 md:py-16'>
          {/* Centered container */}
          <div className='page-container'>
            {/* Header */}
            <div className='page-header'>
              <h1 className='page-title'>Dashboard</h1>
            </div>

            {/* Grid */}
            <div className='grid grid-cols-1 items-stretch gap-4 md:gap-6 lg:grid-cols-[2fr_5fr]'>
              {/* Upcoming Meetings */}
              <section className='flex min-w-0 flex-col rounded-2xl bg-white p-4 shadow-lg md:rounded-3xl md:p-6 lg:p-8'>
                <h2 className='3xl:text-3xl mb-4 text-lg font-semibold text-gray-800 sm:text-xl md:mb-5 md:text-2xl'>
                  Upcoming Meetings
                </h2>
                <div className='flex-1 overflow-auto'>
                  <UpcomingMeetings
                    meetings={meetings}
                    setMeetings={setMeetings}
                  />
                </div>
              </section>

              {/* Calendar */}
              <section className='flex min-w-0 flex-col rounded-2xl bg-white p-4 shadow-lg md:rounded-3xl md:p-6 lg:p-8'>
                <h2 className='3xl:text-3xl mb-4 text-lg font-semibold text-gray-800 sm:text-xl md:mb-5 md:text-2xl lg:mb-6'>
                  Calendar
                </h2>
                <div className='min-w-0 flex-1'>
                  <Calendar
                    calendarEvents={calendarEvents}
                    role='mentor'
                    type='sessionSchedule'
                    buttonOnClick={() => setIsCreatingSession(true)}
                    getPopulatedEvent={getPopulatedEvent}
                    meetings={meetings as any}
                    setMeetings={setMeetings as any}
                  />
                </div>
              </section>
            </div>
            {isCreatingSession && (
              <CreateSessionPopup onClose={() => setIsCreatingSession(false)} />
            )}
          </div>
        </main>

        <DashboardFooter />
      </div>
    </div>
  );
};

export default MentorDashboard;
