import { useState } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import DashboardFooter from '@/components/layouts/Footer';
import { ArrowLeft, Filter, UserRound } from 'lucide-react';
import {
  mockMatchingRequests,
  matchingRequestStatusColors,
  mockMentees,
  type MatchingRequestMentor,
} from './constants/mentorData';
import { useNavigate, useParams } from 'react-router-dom';

import { ProfileItem } from '../profile/Profile';

interface FilterOptions {
  status: string[];
  fromDate?: string;
  toDate?: string;
  sortBy: 'time' | 'name';
  order: 'ascending' | 'descending';
}

const MenteeProfile = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const idParam = params.id;
  const [requests, setRequests] =
    useState<MatchingRequestMentor[]>(mockMatchingRequests);

  const mentee = mockMentees.find((m) => m.id === idParam);
  if (!mentee) {
    return <div className='flex min-h-screen'>Mentee not found</div>;
  }
  const request = requests.find((r) => r.id === idParam);
  if (!request) {
    return <div className='flex min-h-screen'>Request not found</div>;
  }

  const handleBack = () => {
    navigate('/mentor/matching-requests');
  };

  const handleAccept = () => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === idParam ? { ...req, status: 'Accepted' as const } : req,
      ),
    );
  };

  const handleReject = () => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === idParam ? { ...req, status: 'Rejected' as const } : req,
      ),
    );
  };

  return (
    <div className='page-layout'>
      {/* Sidebar */}
      <div className='3xl:w-96 hidden bg-white lg:block lg:w-56'>
        <Sidebar />
      </div>

      <div className='flex flex-1 flex-col'>
        <main className='w-full flex-1 py-12 md:py-16'>
          <div className='page-container space-y-6'>
            <button
              onClick={handleBack}
              className='mb-6 flex items-center text-xl font-bold text-gray-800 transition hover:text-blue-600 md:text-2xl lg:text-3xl'
            >
              <ArrowLeft className='mr-2 h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7' />
              Mentee: {mentee.name}
            </button>

            <div className='rounded-2xl border bg-white p-8 text-left shadow-sm'>
              {/* Profile Info */}
              <div className='flex w-full flex-col lg:flex-row lg:items-start lg:justify-between xl:justify-start xl:space-x-20'>
                {/* === Left: Avatar and Name === */}
                <div className='flex flex-col items-center sm:flex-row sm:items-start'>
                  <div className='flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-50 md:h-28 md:w-28 lg:h-32 lg:w-32'>
                    <UserRound className='h-12 w-12 text-gray-500 md:h-14 md:w-14 lg:h-16 lg:w-16' />
                  </div>
                  <div className='mt-4 space-y-1 text-center sm:mt-0 sm:ml-4 sm:text-left md:ml-6 md:space-y-4'>
                    <h2 className='3xl:text-4xl text-2xl font-semibold text-gray-800 md:text-3xl'>
                      {mentee.name}
                    </h2>
                    <p className='3xl:text-2xl text-base text-gray-600 md:text-lg 3xl:text-xl'>
                      <span className='font-semibold'>Student ID:</span>{' '}
                      {mentee.studentId}
                    </p>
                  </div>
                </div>

                {/* === Right: Contact Info === */}
                <div className='3xl:text-2xl mt-6 flex flex-col gap-4 pt-2 text-left text-base text-gray-600 sm:text-left md:mt-8 md:text-lg lg:mt-0 3xl:text-xl'>
                  <p>
                    <span className='font-semibold'>Email:</span> {mentee.email}
                  </p>
                  <p>
                    <span className='font-semibold'>Faculty:</span>{' '}
                    {mentee.faculty}
                  </p>
                </div>
              </div>

              <div className='mt-6 flex flex-col lg:gap-4'>
                {request.status === 'Pending' && (
                  <div className='3xl:text-2xl rounded-xl bg-gray-100 p-4 text-base text-gray-700 shadow-md md:rounded-2xl md:p-5 md:text-lg lg:p-6 3xl:text-xl'>
                    <p className='text-left leading-relaxed text-gray-600'>
                      The mentee has sent you a matching request with their
                      desired support area:{' '}
                      <span className='font-medium'>{request.desiredArea}</span>
                    </p>

                    <div className='mt-4 flex justify-end gap-3'>
                      <button
                        onClick={handleReject}
                        className='rounded-lg border-1 border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 md:text-base lg:text-lg'
                      >
                        Reject
                      </button>
                      <button
                        onClick={handleAccept}
                        className='rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 md:text-base lg:text-lg'
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                )}

                <ProfileItem
                  label='Self Description'
                  value={mentee.description || 'No description available.'}
                  editable={false}
                />
                <ProfileItem
                  label='Learning Goals'
                  value={mentee.goals || 'No learning goals available.'}
                  editable={false}
                />
              </div>
            </div>
          </div>
        </main>

        <DashboardFooter />
      </div>
    </div>
  );
};

const MentorMatchingRequest = () => {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [requests, setRequests] =
    useState<MatchingRequestMentor[]>(mockMatchingRequests);
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    fromDate: '',
    toDate: '',
    sortBy: 'time',
    order: 'descending',
  });
  const [search, setSearch] = useState('');

  const handleFilterToggle = () => setShowFilter(!showFilter);
  const handleViewProfile = (id: string) => {
    navigate(`/mentor/matching-requests/${id}`);
  };

  const handleAccept = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: 'Accepted' as const } : req,
      ),
    );
  };

  const handleReject = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: 'Rejected' as const } : req,
      ),
    );
  };

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

  const handleReset = () =>
    setFilters({
      status: [],
      fromDate: '',
      toDate: '',
      sortBy: 'time',
      order: 'descending',
    });

  // Filtering logic
  let filtered = requests.filter((r) =>
    filters.status.length ? filters.status.includes(r.status) : true,
  );
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter((r) =>
      `${r.name} ${r.faculty} ${r.desiredArea}`.toLowerCase().includes(q),
    );
  }
  // Date filter logic omitted: requests do not have a timestamp property yet.
  let sorted = [...filtered];
  if (filters.sortBy === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (filters.order === 'descending') sorted.reverse();

  return (
    <div className='flex min-h-screen'>
      {/* Sidebar */}
      <div className='3xl:w-96 hidden bg-white lg:block lg:w-56'>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className='flex flex-1 flex-col'>
        <main className='relative w-full flex-1 py-6 md:py-8 lg:py-12 xl:py-16'>
          <div className='page-container'>
            {/* Header */}
            <div className='page-header'>
              <h1 className='page-title'>Matching Requests</h1>
              <button
                onClick={handleFilterToggle}
                className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:text-base lg:text-lg'
              >
                <Filter size={16} /> Filter
              </button>
            </div>

            {/* Search Bar */}
            {/* <div className='mb-6 flex items-center rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md md:mb-8 md:rounded-xl md:px-5 md:py-4'>
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search by name, faculty, or desired area'
                className='3xl:text-xl ml-1 w-full border-none bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none sm:text-base md:text-lg'
              />
            </div> */}

            {/* Request Cards */}
            <div className='space-y-4 md:space-y-5'>
              {sorted.map((mentee) => (
                <div
                  key={mentee.id}
                  className='flex w-full cursor-pointer flex-col items-start rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between md:rounded-2xl md:p-6 lg:p-7'
                  onClick={() => handleViewProfile(mentee.id)}
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
                        Desired support area: {mentee.desiredArea}
                      </p>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className='mt-4 flex items-center gap-3 sm:mt-0'>
                    <div
                      className={`3xl:px-6 3xl:text-xl flex-shrink-0 rounded-md border px-4 py-1.5 text-sm font-medium whitespace-nowrap sm:text-base md:rounded-lg md:px-5 md:py-2 md:text-lg ${matchingRequestStatusColors[mentee.status]}`}
                    >
                      {mentee.status}
                    </div>
                    {mentee.status === 'Pending' && (
                      <div className='flex gap-2'>
                        <button
                          onClick={(e) => handleReject(e, mentee.id)}
                          className='rounded-lg border border-blue-300 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-100 md:text-base lg:text-lg'
                        >
                          Reject
                        </button>
                        <button
                          onClick={(e) => handleAccept(e, mentee.id)}
                          className='rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 md:text-base lg:text-lg'
                        >
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========== FILTER POPUP ========== */}
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

              <div className='space-y-4 text-gray-700 md:text-md text-left'>
                <div>
                  <p className='mb-1 font-medium'>Status</p>
                  {['Pending', 'Accepted', 'Rejected'].map((status) => (
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
                  <p className='mb-1 font-medium'>Time submit</p>
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
                className='mt-5 w-full rounded-lg bg-blue-500 py-2 text-sm font-medium text-white hover:bg-blue-600 md:text-base 3xl:text-lg'
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

export default MentorMatchingRequest;
export { MenteeProfile };
