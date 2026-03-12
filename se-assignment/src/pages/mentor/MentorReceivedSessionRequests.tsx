import { useState } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import { MapPin, UserRound, List, X, Check } from 'lucide-react';
import DashboardFooter from '@/components/layouts/Footer';
import {
  mockMentorReceivedSessionRequests,
  statusColors,
  type ReceivedSessionRequest,
} from './constants/mentorData';

const MentorReceivedSessionRequests = () => {
  const [selectedRequest, setSelectedRequest] =
    useState<ReceivedSessionRequest | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [requests, setRequests] = useState<ReceivedSessionRequest[]>(
    mockMentorReceivedSessionRequests,
  );

  const handleAccept = () => {
    if (!selectedRequest) return;

    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequest.id
          ? { ...req, status: 'Accepted' as const }
          : req,
      ),
    );

    // Close modal and reset selections
    setSelectedRequest(null);
    setSelectedTime(null);
    setSelectedLocation(null);
  };

  const handleReject = () => {
    if (!selectedRequest) return;

    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequest.id
          ? { ...req, status: 'Rejected' as const }
          : req,
      ),
    );

    // Close modal and reset selections
    setSelectedRequest(null);
    setSelectedTime(null);
    setSelectedLocation(null);
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
            <div className='page-header'>
              <h1 className='page-title'>Received Requests</h1>
            </div>

            {/* Request List */}
            <div className='space-y-4 md:space-y-5'>
              {requests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className='flex w-full cursor-pointer flex-col items-start rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between md:rounded-2xl md:p-6 lg:p-7'
                >
                  <div>
                    <h3 className='text-left text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl 3xl:text-3xl'>
                      {req.type} Request
                    </h3>
                    <p className='text-left text-sm text-gray-600 sm:text-base md:text-lg 3xl:text-xl'>
                      Mentee: {req.mentee}
                    </p>
                    <p className='text-left text-sm text-gray-600 sm:text-base md:text-lg 3xl:text-xl'>
                      Submit time: {req.submitTime}
                    </p>
                  </div>

                  <div
                    className={`mt-4 flex-shrink-0 self-center rounded-md border px-4 py-1.5 text-sm font-medium whitespace-nowrap sm:mt-0 sm:text-base md:rounded-lg md:px-5 md:py-2 md:text-lg 3xl:px-6 3xl:text-xl ${statusColors[req.status]}`}
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
              onClick={() => {
                setSelectedRequest(null);
                setSelectedTime(null);
                setSelectedLocation(null);
              }}
              className='absolute top-4 right-4 rounded-md p-2 text-gray-500 hover:bg-gray-100'
            >
              <X size={22} />
            </button>

            {/* Header */}
            <h2 className='mb-8 text-3xl font-semibold text-gray-800'>
              {selectedRequest.type} Request
            </h2>

            <div className='flex flex-col justify-between gap-8 md:flex-row'>
              {/* === Left Side === */}
              <div className='flex-1 space-y-2 3xl:space-y-4 text-lg 3xl:text-2xl text-gray-700'>
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
                {selectedRequest.type === 'Reschedule' && (
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
                    <p className='flex items-start gap-2'>
                      <MapPin size={20} className='mt-1 text-gray-600' />
                      <span>{selectedRequest.location}</span>
                    </p>
                  </>
                )}

                {/* Mentee */}
                <p className='flex items-center gap-2'>
                  <UserRound size={20} className='text-gray-600' />
                  Mentee: {selectedRequest.mentee}
                </p>

                {/* Description */}
                <p className='flex items-start gap-2 text-gray-700'>
                  <List size={20} className='mt-1 text-gray-600' />
                  {selectedRequest.description}
                </p>
              </div>

              {/* === Right Side === */}
              <div className='flex-1 border-l pl-8 3xl:text-2xl text-gray-700'>
                <h3 className='mb-3 font-semibold text-gray-800 text-xl'>
                  Proposed Time
                </h3>
                <ul className='space-y-2'>
                  {selectedRequest.proposedTimes.map((t, i) => {
                    const [date, startTime, endTime] = t.split(' - ');
                    return (
                      <li
                        key={i}
                        onClick={() =>
                          selectedRequest.status === 'Pending'
                            ? setSelectedTime(i)
                            : null
                        }
                        className={`flex items-center justify-between rounded-lg border px-4 py-2 text-lg 3xl:text-xl ${
                          selectedRequest.status === 'Pending'
                            ? 'cursor-pointer hover:bg-gray-50'
                            : ''
                        } ${
                          selectedRequest.status === 'Pending' &&
                          selectedTime === i
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div>
                          <p>{date}</p>
                          <p className='text-gray-600'>{startTime} - {endTime}</p>
                        </div>
                        {selectedRequest.status === 'Accepted' && i === 0 && (
                          <Check
                            size={24}
                            strokeWidth={3}
                            className='text-blue-500'
                          />
                        )}
                        {selectedRequest.status === 'Pending' &&
                          selectedTime === i && (
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

                <h3 className='mt-6 mb-3 font-semibold text-gray-800 text-xl'>
                  Proposed Location
                </h3>
                <ul className='space-y-2'>
                  {selectedRequest.proposedLocations.map((loc, i) => (
                    <li
                      key={i}
                      onClick={() =>
                        selectedRequest.status === 'Pending'
                          ? setSelectedLocation(i)
                          : null
                      }
                      className={`flex items-center justify-between rounded-lg border px-4 py-2 text-lg 3xl:text-xl ${
                        selectedRequest.status === 'Pending'
                          ? 'cursor-pointer hover:bg-gray-50'
                          : ''
                      } ${
                        selectedRequest.status === 'Pending' &&
                        selectedLocation === i
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      {loc}
                      {selectedRequest.status === 'Accepted' && i === 0 && (
                        <Check
                          size={24}
                          strokeWidth={3}
                          className='text-blue-500'
                        />
                      )}
                      {selectedRequest.status === 'Pending' &&
                        selectedLocation === i && (
                          <Check
                            size={24}
                            strokeWidth={3}
                            className='text-blue-500'
                          />
                        )}
                    </li>
                  ))}
                </ul>

                {/* Action Buttons for Pending Requests */}
                {selectedRequest.status === 'Pending' && (
                  <div className='mt-6 flex gap-3'>
                    <button
                      className='flex-1 rounded-lg border border-gray-300 px-4 py-2 text-md 3xl:text-xl font-medium text-gray-700 transition hover:bg-gray-100'
                      onClick={handleReject}
                    >
                      Reject
                    </button>
                    <button
                      className='flex-1 rounded-lg bg-blue-500 px-4 py-2 text-md 3xl:text-xl font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300'
                      onClick={handleAccept}
                      disabled={
                        selectedTime === null || selectedLocation === null
                      }
                    >
                      Accept
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorReceivedSessionRequests;
