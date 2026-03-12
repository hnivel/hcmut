import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarWrapper from '@/components/layouts/SidebarWrapper';
import {
  UserRound,
  Search,
  Filter,
  X,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardFooter } from '../dashboard/components';
import { mockExploreMentors } from '@/constants/data';

const ExploreMentor = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [desiredArea, setDesiredArea] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([
    'Monday',
    'Tuesday',
  ]);
  const [sortBy, setSortBy] = useState('Name');
  const [_ratingOrder, setRatingOrder] = useState('Descending');

  // ✅ collapsible state
  const [openSections, setOpenSections] = useState({
    faculty: true,
    availability: true,
    sort: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const faculties = ['Computer Science & Engineering', 'EEE', 'ME'];
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const sortOptions = ['Name', 'Faculty', 'Rating'];

  const toggleSelection = (
    list: string[],
    setter: (x: string[]) => void,
    item: string,
  ) => {
    setter(
      list.includes(item) ? list.filter((x) => x !== item) : [...list, item],
    );
  };

  const resetFilters = () => {
    setSelectedFaculty([]);
    setSelectedDays([]);
    setSortBy('Name');
    setRatingOrder('Descending');
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  const handleRequestMatching = (mentor: any) => {
    setSelectedMentor(mentor);
    setIsRequestModalOpen(true);
  };

  const handleSubmitRequest = () => {
    if (desiredArea.trim() && selectedMentor) {
      // Here you would typically send the request to your backend
      console.log('Matching request submitted:', {
        mentorId: selectedMentor.id,
        mentorName: selectedMentor.name,
        desiredArea: desiredArea.trim(),
      });

      // Close modal and reset form
      setIsRequestModalOpen(false);
      setSelectedMentor(null);
      setDesiredArea('');

      // Show success feedback
      alert('Matching request submitted successfully!');
    }
  };

  const handleCancelRequest = () => {
    setIsRequestModalOpen(false);
    setSelectedMentor(null);
    setDesiredArea('');
  };

  return (
    <div className='page-layout'>
      {/* Responsive Sidebar Wrapper */}
      <SidebarWrapper />

      {/* Main Content */}
      <div className='flex flex-1 flex-col'>
        <main className='w-full flex-1 py-8 md:py-12 lg:py-16'>
          <div className='page-container max-w-7xl'>
            {/* ===== Header ===== */}
            <div className='page-header'>
              <h1 className='page-title'>Explore Mentors</h1>
            </div>

            {/* ===== Search Bar ===== */}
            <div className='mb-6 flex items-center rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md md:mb-8 md:rounded-xl md:px-5 md:py-4'>
              <Search className='h-5 w-5 flex-shrink-0 text-gray-500 md:h-6 md:w-6' />
              <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search by name, faculty, or support area'
                className='3xl:text-xl ml-3 w-full border-none bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none sm:text-base md:text-lg'
              />
            </div>

            {/* ===== Search Results Header ===== */}
            <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-5'>
              <h2 className='3xl:text-3xl text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl'>
                Search Results
              </h2>
              <button
                onClick={() => setIsFilterOpen(true)}
                className='flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100 sm:justify-start sm:px-4 sm:py-2 md:text-base lg:text-lg'
              >
                <Filter className='mr-2 h-4 w-4 md:h-5 md:w-5' /> Filter
              </button>
            </div>

            {/* ===== Mentor Cards ===== */}
            {(() => {
              // Apply filters + search + sort in-memory
              let results = [...mockExploreMentors];

              // Filter by faculty (if any selected)
              if (selectedFaculty.length > 0) {
                results = results.filter((m) =>
                  selectedFaculty.includes(m.faculty),
                );
              }

              // Text search across name, faculty, supportArea
              const q = query.trim().toLowerCase();
              if (q) {
                results = results.filter((m) => {
                  const hay =
                    `${m.name} ${m.faculty} ${m.supportArea}`.toLowerCase();
                  return hay.includes(q);
                });
              }

              // Sort
              if (sortBy === 'Name') {
                results.sort((a, b) => a.name.localeCompare(b.name));
              } else if (sortBy === 'Faculty') {
                results.sort((a, b) => a.faculty.localeCompare(b.faculty));
              }

              return (
                <div className='space-y-4 md:space-y-5'>
                  {results.length === 0 && (
                    <div className='rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600'>
                      No mentors found. Try adjusting your search or filters.
                    </div>
                  )}
                  {results.map((mentor) => (
                    <div
                      key={mentor.id}
                      className='flex w-full flex-col items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center sm:gap-6 md:rounded-2xl md:p-6 lg:p-7'
                    >
                      {/* Left: Avatar + Info */}
                      <div className='flex w-full min-w-0 items-center gap-4 sm:flex-1 md:gap-6'>
                        <div className='flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-50 sm:h-16 sm:w-16 md:h-18 md:w-18 lg:h-20 lg:w-20'>
                          <UserRound className='h-7 w-7 text-gray-500 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10' />
                        </div>

                        <div className='min-w-0 flex-1'>
                          <h3 className='3xl:text-3xl truncate text-left text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl'>
                            {mentor.name}
                          </h3>
                          <p className='3xl:text-xl text-left text-sm text-gray-600 sm:text-base md:text-lg'>
                            Faculty: {mentor.faculty}
                          </p>
                          <p className='3xl:text-xl text-left text-sm text-gray-600 sm:text-base md:text-lg'>
                            Support area: {mentor.supportArea}
                          </p>
                        </div>
                      </div>

                      {/* Right: Buttons */}
                      <div className='flex w-full flex-shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:gap-3'>
                        <button
                          onClick={() =>
                            navigate(`/mentors/profile/${mentor.id}`)
                          }
                          className='3xl:px-6 md:text-md 3xl:text-xl rounded-lg border-1 border-gray-800 px-4 font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-100'
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleRequestMatching(mentor)}
                          className='3xl:px-6 md:text-md 3xl:text-xl rounded-lg bg-slate-700 px-4 font-medium text-white transition-all hover:bg-slate-800 sm:px-5 sm:py-3'
                        >
                          Request Matching
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </main>

        <DashboardFooter />
      </div>

      {/* ===== Request Matching Modal ===== */}
      {isRequestModalOpen && selectedMentor && (
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
              <h2 className='3xl:text-3xl text-left text-2xl font-semibold text-gray-800'>
                Request Matching
              </h2>
              <p className='mt-4 text-left text-lg text-gray-600'>
                Submit a matching request to{' '}
                <span className='font-medium'>{selectedMentor.name}</span>
              </p>
            </div>

            {/* Form */}
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

              {/* Buttons */}
              <div className='flex gap-4'>
                <Button
                  onClick={handleSubmitRequest}
                  disabled={!desiredArea.trim()}
                  className='flex-1 bg-slate-700 px-6 py-3 text-lg font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-gray-300'
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Filter Popup ===== */}
      {isFilterOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <div className='relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl md:rounded-3xl md:p-8'>
            {/* Close Button */}
            <button
              onClick={() => setIsFilterOpen(false)}
              className='absolute top-3 right-3 rounded-md p-2 text-gray-500 hover:bg-gray-100 md:top-4 md:right-4'
            >
              <X size={20} className='md:h-[22px] md:w-[22px]' />
            </button>
            <br />

            {/* Header */}
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-gray-800 md:text-2xl'>
                Filter
              </h2>
              <button
                onClick={resetFilters}
                className='flex items-center text-sm text-gray-500 hover:text-gray-700 md:text-base'
              >
                <RotateCcw size={16} className='mr-1 md:h-[18px] md:w-[18px]' />{' '}
                Reset
              </button>
            </div>

            <div className='space-y-5 max-h-[60vh] overflow-y-scroll text-base text-gray-700 md:space-y-6 md:text-lg'>
              {/* === Faculty Section === */}
              <div>
                <div
                  className='flex cursor-pointer items-center justify-between'
                  onClick={() => toggleSection('faculty')}
                >
                  <span className='font-semibold'>Faculty</span>
                  {openSections.faculty ? (
                    <ChevronUp
                      size={16}
                      className='text-gray-600 md:h-[18px] md:w-[18px]'
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      className='text-gray-600 md:h-[18px] md:w-[18px]'
                    />
                  )}
                </div>
                {openSections.faculty && (
                  <div className='mt-2 space-y-2 pl-1'>
                    {faculties.map((f) => (
                      <label
                        key={f}
                        className='flex cursor-pointer items-center'
                      >
                        <input
                          type='checkbox'
                          checked={selectedFaculty.includes(f)}
                          onChange={() =>
                            toggleSelection(
                              selectedFaculty,
                              setSelectedFaculty,
                              f,
                            )
                          }
                          className='h-4 w-4 accent-blue-500 md:h-5 md:w-5'
                        />
                        <span className='ml-2'>{f}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* === Availability Section === */}
              <div>
                <div
                  className='flex cursor-pointer items-center justify-between'
                  onClick={() => toggleSection('availability')}
                >
                  <span className='font-semibold'>Availability</span>
                  {openSections.availability ? (
                    <ChevronUp
                      size={16}
                      className='text-gray-600 md:h-[18px] md:w-[18px]'
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      className='text-gray-600 md:h-[18px] md:w-[18px]'
                    />
                  )}
                </div>
                {openSections.availability && (
                  <div className='mt-2 space-y-2 pl-1'>
                    {days.map((day) => (
                      <label
                        key={day}
                        className='flex cursor-pointer items-center'
                      >
                        <input
                          type='checkbox'
                          checked={selectedDays.includes(day)}
                          onChange={() =>
                            toggleSelection(selectedDays, setSelectedDays, day)
                          }
                          className='h-4 w-4 accent-blue-500 md:h-5 md:w-5'
                        />
                        <span className='ml-2'>{day}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* === Sort Section === */}
              <div>
                <div
                  className='flex cursor-pointer items-center justify-between'
                  onClick={() => toggleSection('sort')}
                >
                  <span className='font-semibold'>Sort By</span>
                  {openSections.sort ? (
                    <ChevronUp
                      size={16}
                      className='text-gray-600 md:h-[18px] md:w-[18px]'
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      className='text-gray-600 md:h-[18px] md:w-[18px]'
                    />
                  )}
                </div>
                {openSections.sort && (
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className='mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-700 focus:border-blue-400 focus:outline-none md:text-lg'
                  >
                    {sortOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* === Apply Button === */}
            </div>
            <div className='mt-6 flex justify-end'>
              <button
                onClick={applyFilters}
                className='rounded-lg bg-blue-500 px-5 py-2 text-base font-medium text-white hover:bg-blue-600 md:px-6 md:text-lg'
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreMentor;
