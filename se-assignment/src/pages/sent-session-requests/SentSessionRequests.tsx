import { useState } from 'react';
import SidebarWrapper from '@/components/layouts/SidebarWrapper';
import { MapPin, UserRound, List, X, Check } from 'lucide-react';
import DashboardFooter from '@/components/layouts/Footer';
import {
  mockSentSessionRequests,
  statusColors,
  type SessionRequest,
} from '@/constants/data';
import { getMentorById } from '@/constants/data';

const SentRequests = () => {
  const [selectedRequest, setSelectedRequest] = useState<SessionRequest | null>(
    null,
  );

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
              <h1 className='page-title'>Sent Session Requests</h1>
            </div>

            {/* Request List */}
            <div className='space-y-4 md:space-y-5'>
              {mockSentSessionRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className='flex w-full cursor-pointer flex-col items-start rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between md:rounded-2xl md:p-6 lg:p-7'
                >
                  <div>
                    <h3 className='3xl:text-3xl text-left text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl'>
                      {req.title}
                    </h3>
                    <p className='3xl:text-xl text-left text-sm text-gray-600 sm:text-base md:text-lg'>
                      Mentor:{' '}
                      {getMentorById(req.mentorId)?.name ?? 'Unknown Mentor'}
                    </p>
                    <p className='3xl:text-xl text-left text-sm text-gray-600 sm:text-base md:text-lg'>
                      Submitted on: {req.submitTime}
                    </p>
                  </div>

                  <div
                    className={`3xl:px-6 3xl:text-xl mt-4 flex-shrink-0 self-center rounded-md border px-4 py-1.5 text-sm font-medium whitespace-nowrap sm:mt-0 sm:text-base md:rounded-lg md:px-5 md:py-2 md:text-lg ${statusColors[req.status]}`}
                  >
                    {req.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <DashboardFooter />
      </div>

      {/* ===== Popup ===== */}
      {selectedRequest && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 text-left'>
          <div className='relative w-full max-w-4xl rounded-3xl bg-white p-8 shadow-xl'>
            {/* Close */}
            <button
              onClick={() => setSelectedRequest(null)}
              className='absolute top-4 right-4 rounded-md p-2 text-gray-500 hover:bg-gray-100'
            >
              <X size={22} />
            </button>

            {/* Header */}
            <h2 className='mb-8 text-3xl font-semibold text-gray-800'>
              {selectedRequest.title}
            </h2>

            <div className='flex flex-col justify-between gap-8 md:flex-row'>
              {/* === Left Side === */}
              <div className='flex-1 space-y-4 text-lg 3xl:text-2xl text-gray-700'>
                {/* Status */}
                <p className='flex items-center gap-2'>
                  <span
                    className={`h-5 w-5 rounded-full ${
                      selectedRequest.status === 'Accepted'
                        ? 'bg-green-500'
                        : selectedRequest.status === 'Rejected'
                          ? 'bg-rose-500'
                          : 'bg-yellow-400'
                    }`}
                  ></span>
                  <span className='capitalize'>{selectedRequest.status}</span>
                </p>

                {/* Current Date + Time - Only show for Reschedule requests */}
                {selectedRequest.title === 'Reschedule Request' &&
                  selectedRequest.date && (
                    <>
                      <p className='text-gray-700'>
                        <span className='font-semibold'>Current Session:</span>
                        <br />
                        {selectedRequest.date}
                        <br />
                        <span className='text-gray-600'>
                          {selectedRequest.time}
                        </span>
                      </p>

                      {/* Current Location */}
                      {selectedRequest.location && (
                        <p className='flex items-start gap-2'>
                          <MapPin size={20} className='mt-1 text-gray-600' />
                          <span>{selectedRequest.location}</span>
                        </p>
                      )}
                    </>
                  )}

                {/* Mentor */}
                <p className='flex items-center gap-2'>
                  <UserRound size={20} className='text-gray-600' />
                  Mentor:{' '}
                  {getMentorById(selectedRequest.mentorId)?.name ??
                    'Unknown Mentor'}
                </p>

                {/* Description */}
                {selectedRequest.description && (
                  <p className='flex items-start gap-2 text-gray-700'>
                    <List
                      size={24}
                      className='mt-0.5 flex-shrink-0 text-gray-600'
                    />
                    {selectedRequest.description}
                  </p>
                )}
              </div>

              {/* === Right Side === */}
              <div className='flex-1 border-l pl-8 text-lg 3xl:text-2xl text-gray-700'>
                {selectedRequest.proposedTimes &&
                  selectedRequest.proposedTimes.length > 0 && (
                    <>
                      <h3 className='mb-3 font-semibold text-xl text-gray-800'>
                        Proposed Time
                      </h3>
                      <ul className='space-y-2'>
                        {selectedRequest.proposedTimes.map((t, i) => {
                          const [date, startTime, endTime] = t.split(' - ');
                          return (
                            <li
                              key={i}
                              className='flex items-center justify-between rounded-lg border text-md border-gray-200 px-4 py-2'
                            >
                              <div>
                                <p>{date}</p>
                                <p className='text-gray-600'>{startTime} - {endTime}</p>
                              </div>
                              {selectedRequest.status === 'Accepted' &&
                                i === 0 && (
                                  <Check
                                    size={24}
                                    strokeWidth={3}
                                    className='text-blue-500'
                                  />
                                )}
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}

                {selectedRequest.proposedLocations &&
                  selectedRequest.proposedLocations.length > 0 && (
                    <>
                      <h3 className='mt-6 mb-3 text-xl font-semibold text-gray-800'>
                        Proposed Location
                      </h3>
                      <ul className='space-y-2'>
                        {selectedRequest.proposedLocations.map((loc, i) => (
                          <li
                            key={i}
                            className='flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2'
                          >
                            {loc}
                            {selectedRequest.status === 'Accepted' &&
                              i === 0 && (
                                <Check
                                  size={24}
                                  strokeWidth={3}
                                  className='text-blue-500'
                                />
                              )}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentRequests;
