import { useState } from 'react';
import SidebarWrapper from '@/components/layouts/SidebarWrapper';
import { UserRound, Filter, Search } from 'lucide-react';
import DashboardFooter from '@/components/layouts/Footer';
import {
  mockMatchingRequests,
  matchingRequestStatusColors,
  type MatchingRequestMentor,
} from '@/constants/data';

interface FilterOptions {
  status: string[];
  fromDate?: string;
  toDate?: string;
  sortBy: 'time' | 'name';
  order: 'ascending' | 'descending';
}

const MatchingRequests = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [requests] = useState<MatchingRequestMentor[]>(mockMatchingRequests);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    sortBy: 'time',
    order: 'descending',
  });

  const handleFilterToggle = () => setShowFilter(!showFilter);

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
    setFilters({ status: [], sortBy: 'time', order: 'descending' });

  // Compute filtered + sorted data
  const filtered = requests
    .filter((r) =>
      filters.status.length ? filters.status.includes(r.status) : true,
    )
    .filter((r) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      const hay =
        `${r.name} ${r.faculty} ${r.supportArea} ${r.yourDesiredArea}`.toLowerCase();
      return hay.includes(q);
    });

  const sorted = [...filtered];
  if (filters.sortBy === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (filters.order === 'descending') sorted.reverse();

  return (
    <div className='page-layout'>
      {/* Sidebar */}
      <SidebarWrapper />

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
              <Search className='h-5 w-5 flex-shrink-0 text-gray-500 md:h-6 md:w-6' />
              <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search by name, faculty, support or your desired area'
                className='ml-3 w-full border-none bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none sm:text-base md:text-lg 3xl:text-xl'
              />
            </div> */}

            {/* Mentor Cards */}
            <div className='space-y-4 md:space-y-5'>
              {sorted.map((mentor) => (
                <div
                  key={mentor.id}
                  className='flex w-full flex-col items-start rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between md:rounded-2xl md:p-6 lg:p-7'
                >
                  {/* Left: Avatar + Info */}
                  <div className='flex items-start gap-4 md:gap-6'>
                    <div className='flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-50 md:h-18 md:w-18 lg:h-20 lg:w-20'>
                      <UserRound className='h-8 w-8 text-gray-500 md:h-9 md:w-9 lg:h-10 lg:w-10' />
                    </div>

                    <div>
                      <h3 className='text-left text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl 3xl:text-3xl'>
                        {mentor.name}
                      </h3>
                      <p className='text-left text-sm text-gray-600 sm:text-base md:text-lg 3xl:text-xl'>
                        Faculty: {mentor.faculty}
                      </p>
                      <p className='text-left text-sm text-gray-600 sm:text-base md:text-lg 3xl:text-xl'>
                        Support area: {mentor.supportArea}
                      </p>
                      <div className='text-left text-sm text-gray-600 sm:text-base md:text-lg 3xl:text-xl'>
                        Your desired area: {mentor.yourDesiredArea}
                      </div>
                    </div>
                  </div>

                  {/* Right: Status */}
                  <div
                    className={`mt-4 flex-shrink-0 self-center rounded-md border px-4 py-1.5 text-sm font-medium whitespace-nowrap sm:mt-0 sm:text-base md:rounded-lg md:px-5 md:py-2 md:text-lg 3xl:px-6 3xl:text-xl ${matchingRequestStatusColors[mentor.status]}`}
                  >
                    {mentor.status}
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

              <div className='space-y-4 text-md text-gray-700 md:text-md text-left'>
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

                {/* Time submit filter omitted - no timestamp in dataset */}

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
                className='mt-5 w-full rounded-lg bg-blue-500 py-2 text-sm font-medium text-white hover:bg-blue-600 md:text-base lg:text-lg'
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

export default MatchingRequests;
