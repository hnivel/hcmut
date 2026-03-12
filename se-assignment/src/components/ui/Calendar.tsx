import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  MapPin,
  UserRound,
  Menu,
  CircleHelp,
  Clock,
} from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  CalendarEvent,
  CalendarType,
  AvailabilityEvent,
  Mentor,
  Meeting,
} from '@/constants/data';
import {
  calendarStatusColors,
  getPopulatedCalendarEvent,
  getMentorById,
} from '@/constants/data';

const hours = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
];

// Helper function to get the week containing a specific date
const getWeekDays = (year: number, month: number, weekOffset: number = 0) => {
  // month is 1-indexed (1 = January, 12 = December)
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const dayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Calculate the Monday of the first week (adjust if month doesn't start on Monday)
  const firstMonday = new Date(firstDayOfMonth);
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  firstMonday.setDate(firstDayOfMonth.getDate() + daysToMonday);

  // Add week offset
  const targetWeekStart = new Date(firstMonday);
  targetWeekStart.setDate(firstMonday.getDate() + weekOffset * 7);

  // Generate 7 days starting from Monday
  const days = [];
  const dayNames = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(targetWeekStart);
    currentDay.setDate(targetWeekStart.getDate() + i);
    days.push({
      day: dayNames[i],
      date: currentDay.getDate(),
      month: currentDay.getMonth() + 1, // 1-indexed
      year: currentDay.getFullYear(),
    });
  }

  return days;
};

// Helper to get total weeks in a month view
const getTotalWeeksInMonth = (year: number, month: number) => {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const firstDayOfWeek = firstDay.getDay();
  const daysToFirstMonday = firstDayOfWeek === 0 ? -6 : 1 - firstDayOfWeek;
  const firstMonday = new Date(firstDay);
  firstMonday.setDate(firstDay.getDate() + daysToFirstMonday);

  const lastDayOfWeek = lastDay.getDay();
  const daysToLastSunday = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
  const lastSunday = new Date(lastDay);
  lastSunday.setDate(lastDay.getDate() + daysToLastSunday);

  const diffTime = lastSunday.getTime() - firstMonday.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return Math.ceil(diffDays / 7);
};

const Calendar = ({
  calendarEvents = [],
  availabilityEvents = [],
  type,
  role,
  buttonOnClick,
  onSlotClick,
  readOnly,
  todayOverride,
  getPopulatedEvent,
  meetings,
  setMeetings,
}: {
  calendarEvents?: CalendarEvent[];
  type?: CalendarType;
  availabilityEvents?: AvailabilityEvent[];
  role?: 'mentor' | 'mentee';
  buttonOnClick?: () => void;
  onSlotClick?: (event: AvailabilityEvent) => void;
  readOnly?: boolean;
  todayOverride?: { year: number; month: number; date: number };
  getPopulatedEvent?: (calendarEvent: CalendarEvent) => {
    calendarEvent: CalendarEvent;
    meeting: any;
    event: any;
    mentor?: Mentor | undefined;
    mentee?: any;
  };
  meetings?: Meeting[];
  setMeetings?: React.Dispatch<React.SetStateAction<Meeting[]>>;
}) => {
  const navigate = useNavigate();
  const [monthIndex, setMonthIndex] = useState(10);
  const [year, setYear] = useState(2025);
  const [weekOffset, setWeekOffset] = useState(4); // Week containing Nov 10 (example)
  const [selectedEvent, setSelectedEvent] = useState<{
    event: any;
    meeting: any;
    mentor: Mentor | undefined;
    meetingIndex?: number;
    eventIndex?: number;
  } | null>(null);

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCancelConfirm, setIsCancelConfirm] = useState(false);
  const [proposedTimes, setProposedTimes] = useState<
    { date: string; startTime: string; endTime: string }[]
  >([{ date: '', startTime: '', endTime: '' }]);
  const [proposedLocations, setProposedLocations] = useState<
    { location: string; isOnline: boolean }[]
  >([{ location: '', isOnline: true }]);
  const [isOnline, setIsOnline] = useState(true);
  const handleCancelMeeting = (meetingIndex: number, eventIndex: number) => {
    if (!setMeetings || !meetings) return;

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

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Generate days for the current week
  const days = useMemo(() => {
    return getWeekDays(year, monthIndex, weekOffset);
  }, [year, monthIndex, weekOffset]);

  // Get the displayed month/year from the first day of the week (Monday)
  const displayedMonth = days.length > 0 ? days[0].month : monthIndex;
  const displayedYear = days.length > 0 ? days[0].year : year;
  const currentMonthName = monthNames[displayedMonth - 1];

  const today = 27;
  const currentMonth = 10;
  const currentYear = 2025; // Populate calendar events with meeting and mentor data
  const populatedEvents = useMemo(() => {
    // Use the provided helper function or fall back to the default one
    const populateFunc = getPopulatedEvent || getPopulatedCalendarEvent;

    return calendarEvents
      .map((ce) => {
        const populated = populateFunc(ce);
        // No filtering by month here - we'll filter by the actual day/date in the rendering
        return {
          ...ce,
          title: populated.event?.title || 'Untitled',
          status: populated.event?.status || 'pending',
          mentor: populated.mentor,
          event: populated.event,
          meeting: populated.meeting,
        };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);
  }, [calendarEvents, getPopulatedEvent]);

  // Helper function to check if event matches a specific day in the calendar
  const isEventOnDay = (
    event: (typeof populatedEvents)[0],
    calendarDay: { day: string; date: number; month: number; year: number },
  ) => {
    if (!event.meeting) return false;

    // Parse the date from meeting (e.g., "Mon 3" -> 3)
    const dateParts = event.meeting.date.split(' ');
    const eventDate = parseInt(dateParts[1]);
    const eventMonth = event.meeting.month;
    const eventYear = event.meeting.year;

    // Convert month name to number
    const monthIndex = monthNames.indexOf(eventMonth) + 1;

    // Match by day name, date, month, and year
    return (
      event.day === calendarDay.day &&
      eventDate === calendarDay.date &&
      monthIndex === calendarDay.month &&
      eventYear === calendarDay.year
    );
  };

  const handlePrev = () => {
    // Move to previous week
    const newWeekOffset = weekOffset - 1;

    // Check if we need to go to previous month
    if (newWeekOffset < 0) {
      // Go to previous month
      if (monthIndex === 1) {
        setMonthIndex(12);
        setYear((y) => y - 1);
      } else {
        setMonthIndex((m) => m - 1);
      }
      // Set to last week of the new month
      const prevMonth = monthIndex === 1 ? 12 : monthIndex - 1;
      const prevYear = monthIndex === 1 ? year - 1 : year;
      const totalWeeks = getTotalWeeksInMonth(prevYear, prevMonth);
      setWeekOffset(totalWeeks - 1);
    } else {
      setWeekOffset(newWeekOffset);
    }
  };

  const handleNext = () => {
    // Move to next week
    const newWeekOffset = weekOffset + 1;
    const totalWeeks = getTotalWeeksInMonth(year, monthIndex);

    // Check if we need to go to next month
    if (newWeekOffset >= totalWeeks) {
      // Go to next month
      if (monthIndex === 12) {
        setMonthIndex(1);
        setYear((y) => y + 1);
      } else {
        setMonthIndex((m) => m + 1);
      }
      // Set to first week of the new month
      setWeekOffset(0);
    } else {
      setWeekOffset(newWeekOffset);
    }
  };

  const handleToday = () => {
    const todayYear = 2025;
    const todayMonth = 10;

    setYear(todayYear);
    setMonthIndex(todayMonth);

    // Find which week contains base date
    const firstDayOfMonth = new Date(todayYear, todayMonth - 1, 1);
    const dayOfWeek = firstDayOfMonth.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const firstMonday = new Date(firstDayOfMonth);
    firstMonday.setDate(firstDayOfMonth.getDate() + daysToMonday);

    const diffTime =
      new Date(todayYear, todayMonth - 1, 27).getTime() - firstMonday.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const weekIndex = Math.floor(diffDays / 7);

    setWeekOffset(Math.max(0, weekIndex));
  };

  // If todayOverride is provided, initialize to that week on mount
  useEffect(() => {
    if (todayOverride) {
      handleToday();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayOverride?.year, todayOverride?.month, todayOverride?.date]);

  // Helper function to parse time string to minutes from midnight
  const parseTimeToMinutes = (timeStr: string): number => {
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (!match) return 0;
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    return hours * 60 + minutes;
  };

  // Helper function to convert time string to hour slot index
  const getHourIndex = (timeStr: string): number => {
    const minutes = parseTimeToMinutes(timeStr);
    const startMinutes = 7 * 60; // 07:00 in minutes
    return Math.floor((minutes - startMinutes) / 60);
  };

  // Calculate position and height for events with start and end times
  const getEventStyle = (timeStr: string, endTimeStr?: string) => {
    const startMinutes = parseTimeToMinutes(timeStr);
    const startOfDay = 7 * 60; // 07:00

    // Calculate offset from the top of the hour slot
    const hourSlotStart =
      Math.floor((startMinutes - startOfDay) / 60) * 60 + startOfDay;
    const minutesFromSlotStart = startMinutes - hourSlotStart;
    const topOffset = (minutesFromSlotStart / 60) * 100; // Percentage within the hour slot

    let height = 100; // Default to full hour slot

    if (endTimeStr) {
      const endMinutes = parseTimeToMinutes(endTimeStr);
      const durationMinutes = endMinutes - startMinutes;
      height = (durationMinutes / 60) * 100; // Height as percentage of hour slots
    }

    return {
      top: `${topOffset}%`,
      height: `${height}%`,
    };
  };

  // Helper to check if an event should be rendered at this time slot
  const shouldRenderEvent = (
    event: CalendarEvent | AvailabilityEvent,
    currentTime: string,
  ): boolean => {
    // Check if event starts in this hour slot
    const eventHour = getHourIndex(event.time);
    const slotHour = hours.indexOf(currentTime);
    return eventHour === slotHour;
  };

  // Format time range for display
  const formatTimeRange = (startTime: string, endTime?: string): string => {
    if (!endTime) return startTime;
    return `${startTime} - ${endTime}`;
  };

  return (
    <div className='space-y-4'>
      {/* ===== Header ===== */}
      <div className='flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        {/* Left Controls */}
        <div className='flex flex-wrap items-center gap-2'>
          <button
            onClick={handleToday}
            className='text-md sm:text-md rounded-lg border border-gray-300 px-3 py-1.5 font-medium shadow-sm transition hover:bg-gray-100 sm:px-4'
          >
            Today
          </button>

          <div className='flex items-center gap-1 sm:gap-2'>
            <button
              onClick={handlePrev}
              className='rounded-md p-1.5 transition hover:bg-gray-100 hover:text-gray-700 sm:p-2'
            >
              <ChevronLeft size={20} className='sm:h-6 sm:w-6' />
            </button>
            <button
              onClick={handleNext}
              className='rounded-md p-1.5 transition hover:bg-gray-100 hover:text-gray-700 sm:p-2'
            >
              <ChevronRight size={20} className='sm:h-6 sm:w-6' />
            </button>
          </div>

          <span className='3xl:text-2xl text-base font-semibold tracking-tight whitespace-nowrap text-gray-800 sm:text-lg md:text-xl'>
            {currentMonthName} {displayedYear}
          </span>
        </div>

        {/* Right Legend */}
        <div className='3xl:gap-x-6 3xl:text-xl flex flex-wrap items-center gap-2 sm:justify-end sm:gap-3'>
          {role === 'mentor' && type === 'availability' && (
            <>
              {!readOnly && (
                <button
                  onClick={buttonOnClick}
                  className='3xl:px-4 3xl:py-3 flex items-center gap-1 rounded-lg border bg-blue-500 px-3 py-1.5 transition hover:bg-blue-400 sm:py-2 sm:pr-4 sm:pl-3'
                >
                  <Plus
                    size={16}
                    className='text-white sm:h-[18px] sm:w-[18px]'
                  />
                  <span className='text-md sm:text-md font-semibold text-white'>
                    Add time slot
                  </span>
                </button>
              )}
              <div className='flex flex-wrap items-start gap-2 text-xs sm:gap-4 sm:text-sm'>
                <Legend
                  label='Fixed'
                  color={`${calendarStatusColors['fixed']}`}
                />
                <Legend
                  label='Flexible'
                  color={`${calendarStatusColors['flexible']}`}
                />
              </div>
            </>
          )}

          {type === 'sessionSchedule' && (
            <>
              <div className='flex flex-col gap-1'>
                <Legend
                  label='Completed'
                  color={`${calendarStatusColors['completed']}`}
                />
                <Legend
                  label='Upcoming'
                  color={`${calendarStatusColors['upcoming']}`}
                />
              </div>
              <div className='flex flex-col gap-1'>
                <Legend
                  label='Reschedule Pending'
                  color={`${calendarStatusColors['pending']}`}
                />
                <Legend
                  label='Cancelled'
                  color={`${calendarStatusColors['cancelled']}`}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {role === 'mentor' && type === 'sessionSchedule' && (
        <div className='flex justify-start'>
          <button
            onClick={buttonOnClick}
            className='3xl:px-4 3xl:py-3 flex items-center gap-1 rounded-lg border bg-blue-500 px-3 py-1.5 transition hover:bg-blue-400 sm:py-2 sm:pr-4 sm:pl-3'
          >
            <Plus size={16} className='text-white sm:h-[18px] sm:w-[18px]' />
            <span className='text-md sm:text-md font-semibold text-white'>
              Create session
            </span>
          </button>
        </div>
      )}
      {/* ===== Calendar Grid ===== */}
      <div className='w-full overflow-x-auto rounded-lg'>
        {/* Responsive grid: Fixed width columns for consistent sizing */}
        <div className='3xl:text-xl grid w-full min-w-[640px] grid-cols-[80px_repeat(7,minmax(90px,1fr))] grid-rows-[auto] rounded-2xl border text-center text-xs text-gray-700 shadow-sm sm:text-sm'>
          {/* Top Row: Time header + Days */}
          <div className='border-b bg-gray-50 py-1.5 text-xs font-semibold text-gray-800 sm:py-2 sm:text-sm'>
            Time
          </div>
          {days.map((day) => (
            <div
              key={day.day}
              className='flex flex-col items-center justify-center border-b bg-gray-50 py-1'
            >
              <div className='py-1 text-xs font-semibold text-gray-800 sm:py-2 sm:text-sm'>
                {day.day}
              </div>
              <div
                className={`3xl:h-9 3xl:w-9 flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-xs font-medium text-gray-700 sm:h-7 sm:w-7 sm:text-sm lg:h-8 lg:w-8 ${
                  day.date === today &&
                  day.month === currentMonth &&
                  day.year === currentYear
                    ? 'bg-gray-700 text-white'
                    : ''
                }`}
              >
                {day.date}
              </div>
            </div>
          ))}

          {/* Rows: each hour + day cells */}
          {hours.map((time, hourIndex) => (
            <React.Fragment key={`hour-block-${time}`}>
              {/* Left Time Label - Vertically Centered */}
              <div
                key={`time-${time}`}
                className='3xl:text-xl flex items-center justify-center border-r border-b bg-gray-50 py-2 text-[10px] font-medium text-gray-600 sm:text-xs lg:text-sm'
              >
                {time}
              </div>

              {/* Day Cells for sessionSchedule */}
              {type === 'sessionSchedule' &&
                days.map((day) => {
                  const event = populatedEvents.find(
                    (e) => isEventOnDay(e, day) && shouldRenderEvent(e, time),
                  );

                  // Check if this cell is occupied by an event from a previous time slot
                  const isOccupiedByPreviousEvent = populatedEvents.some(
                    (e) => {
                      if (!isEventOnDay(e, day)) return false;
                      const eventHourIndex = getHourIndex(e.time);
                      const eventStartMinutes = parseTimeToMinutes(e.time);
                      const eventEndMinutes = e.endTime
                        ? parseTimeToMinutes(e.endTime)
                        : eventStartMinutes + 60;
                      const currentSlotStart = (7 + hourIndex) * 60;

                      return (
                        eventHourIndex < hourIndex &&
                        eventEndMinutes > currentSlotStart
                      );
                    },
                  );

                  if (isOccupiedByPreviousEvent) {
                    // Render empty cell to maintain grid structure
                    return (
                      <div
                        key={`${day.day}-${time}`}
                        className='relative flex min-h-12 items-center justify-center border-r border-b sm:min-h-14'
                      />
                    );
                  }

                  const eventStyle = event
                    ? getEventStyle(event.time, event.endTime)
                    : {};

                  return (
                    <div
                      key={`${day.day}-${time}`}
                      className='relative flex min-h-12 items-center justify-center border-r border-b sm:min-h-14'
                    >
                      {event && event.event && event.meeting && (
                        <div
                          onClick={() => {
                            // Find the meeting and event indices for state updates
                            const meetingIndex = meetings?.findIndex(
                              (m) => m.id === event.meeting?.id,
                            );
                            const eventIndex = meetings
                              ?.find((m) => m.id === event.meeting?.id)
                              ?.events?.findIndex(
                                (e) => e.id === event.event?.id,
                              );

                            setSelectedEvent({
                              event: event.event!,
                              meeting: event.meeting!,
                              mentor: event.mentor,
                              meetingIndex:
                                meetingIndex !== undefined && meetingIndex >= 0
                                  ? meetingIndex
                                  : undefined,
                              eventIndex:
                                eventIndex !== undefined && eventIndex >= 0
                                  ? eventIndex
                                  : undefined,
                            });
                          }}
                          className={`absolute right-1 left-1 z-10 flex cursor-pointer flex-col justify-start gap-0.5 overflow-hidden rounded-md border p-1 text-left text-[10px] font-medium shadow-sm transition hover:opacity-80 sm:right-2 sm:left-2 sm:rounded-lg sm:text-xs md:text-sm ${calendarStatusColors[event.status as keyof typeof calendarStatusColors]}`}
                          style={eventStyle}
                        >
                          <span className='text-centerleading-tight overflow-hidden px-1'>
                            {event.title}
                          </span>
                          <span className='3xl:text-[15px] flex-shrink-0 text-[9px] text-gray-600 sm:text-[10px] md:text-xs'>
                            {formatTimeRange(event.time, event.endTime)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              {/* Day Cells for availability */}
              {type === 'availability' &&
                days.map((day) => {
                  const event = availabilityEvents.find(
                    (e) => e.day === day.day && shouldRenderEvent(e, time),
                  );

                  // Check if this cell is occupied by an event from a previous time slot
                  const isOccupiedByPreviousEvent = availabilityEvents.some(
                    (e) => {
                      if (e.day !== day.day) return false;
                      const eventHourIndex = getHourIndex(e.time);
                      const eventStartMinutes = parseTimeToMinutes(e.time);
                      const eventEndMinutes = e.endTime
                        ? parseTimeToMinutes(e.endTime)
                        : eventStartMinutes + 60;
                      const currentSlotStart = (7 + hourIndex) * 60;

                      return (
                        eventHourIndex < hourIndex &&
                        eventEndMinutes > currentSlotStart
                      );
                    },
                  );

                  if (isOccupiedByPreviousEvent) {
                    // Render empty cell to maintain grid structure
                    return (
                      <div
                        key={`${day.day}-${time}`}
                        className='relative flex min-h-12 items-center justify-center border-r border-b sm:min-h-14'
                      />
                    );
                  }

                  const eventStyle = event
                    ? getEventStyle(event.time, event.endTime)
                    : {};

                  return (
                    <div
                      key={`${day.day}-${time}`}
                      className='relative flex min-h-12 items-center justify-center border-r border-b sm:min-h-14'
                    >
                      {event && (
                        <div
                          onClick={() => {
                            if (role === 'mentor' && !readOnly) {
                              onSlotClick?.(event);
                            }
                          }}
                          className={`absolute right-1 left-1 z-10 flex flex-col items-center justify-center rounded-md border text-[10px] font-medium shadow-sm transition sm:right-2 sm:left-2 sm:rounded-lg sm:text-xs md:text-sm ${
                            role === 'mentor'
                              ? calendarStatusColors[event.type] +
                                (readOnly
                                  ? ''
                                  : ' cursor-pointer hover:opacity-80')
                              : 'border-amber-400 bg-amber-200'
                          }`}
                          style={eventStyle}
                        ></div>
                      )}
                    </div>
                  );
                })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Meeting details modal - displays comprehensive information about the selected event */}
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
              {selectedEvent.meeting.date.split(' ')[1]},{' '}
              {selectedEvent.meeting.year}
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

              <p className='flex items-center gap-2'>
                <UserRound size={18} className='text-gray-600' />
                <span>
                  Mentor:{' '}
                  {getMentorById(selectedEvent.event.mentorId)?.name ||
                    'Unknown'}
                </span>
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
                    if (selectedEvent.event.type === 'group') {
                      alert('You cannot reschedule a group meeting');
                      return;
                    }
                    setIsRescheduling(true);
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
                  onClick={() => navigate('/session/sent-requests')}
                  className='text-md 3xl:text-lg rounded-lg border border-blue-300 bg-blue-100 px-5 py-2 font-medium text-blue-700 hover:bg-blue-200'
                >
                  View Reschedule Request
                </button>
              </div>
            )}
            {selectedEvent.event.status === 'completed' && (
              <div className='mt-6 flex justify-end gap-3'>
                <button
                  onClick={() =>
                    navigate(
                      `/matching/matched-mentors/${selectedEvent.event.mentorId}`,
                    )
                  }
                  className='text-md 3xl:text-lg rounded-lg border border-blue-300 bg-blue-100 px-5 py-2 font-medium text-blue-700 hover:bg-blue-200'
                >
                  Feedback
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reschedule modal - allows user to propose new times and locations for rescheduling the meeting */}
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
                  {selectedEvent.meeting.date.split(' ')[1]},{' '}
                  {selectedEvent.meeting.year}
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
                  <span>
                    Mentor:{' '}
                    {getMentorById(selectedEvent.event.mentorId)?.name ||
                      'Unknown'}
                  </span>
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
                  if (
                    !meetings ||
                    !setMeetings ||
                    selectedEvent.meetingIndex === undefined ||
                    selectedEvent.eventIndex === undefined
                  ) {
                    alert('Cannot reschedule this meeting');
                    return;
                  }

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

                  const updatedMeetings = [...meetings];
                  const meeting = updatedMeetings[selectedEvent.meetingIndex];
                  if (meeting?.events?.[selectedEvent.eventIndex]) {
                    meeting.events[selectedEvent.eventIndex].status = 'pending';
                  }

                  setMeetings(updatedMeetings);
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

      {/* Cancel confirmation modal - confirms meeting cancellation with reason */}
      {isCancelConfirm && selectedEvent && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='relative w-full max-w-md rounded-3xl bg-white p-8 shadow-xl'>
            <button
              onClick={() => setIsCancelConfirm(false)}
              className='absolute top-4 right-4 rounded-md p-2 text-gray-500 hover:bg-gray-100'
            >
              <X size={22} />
            </button>

            <h2 className='3xl:text-2xl mb-5 text-left text-xl font-semibold text-gray-800'>
              Cancel Meeting
            </h2>

            <p className='mb-4 text-gray-600'>
              Are you sure you want to cancel this{' '}
              {selectedEvent.event.type === 'group' ? 'group' : 'individual'}{' '}
              meeting with{' '}
              {getMentorById(selectedEvent.event.mentorId)?.name || 'Unknown'}?
            </p>

            <div className='mb-6'>
              <label className='mb-2 block font-medium text-gray-700'>
                Reason for cancellation
              </label>
              <textarea
                value={selectedEvent.event.cancelReason || ''}
                onChange={(e) => {
                  const updatedEvent = {
                    ...selectedEvent,
                    event: {
                      ...selectedEvent.event,
                      cancelReason: e.target.value,
                    },
                  };
                  setSelectedEvent(updatedEvent);
                }}
                className='w-full rounded-md border border-gray-300 px-3 py-2'
                rows={3}
                placeholder='Please provide a reason for cancellation'
              />
            </div>

            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setIsCancelConfirm(false)}
                className='rounded-lg border border-gray-300 bg-white px-5 py-2 font-medium text-gray-700 hover:bg-gray-50'
              >
                Keep Meeting
              </button>
              <button
                onClick={() => {
                  if (
                    selectedEvent.meetingIndex !== undefined &&
                    selectedEvent.eventIndex !== undefined
                  ) {
                    handleCancelMeeting(
                      selectedEvent.meetingIndex,
                      selectedEvent.eventIndex,
                    );
                  }
                  setIsCancelConfirm(false);
                  setSelectedEvent(null);
                }}
                className='rounded-lg bg-red-500 px-5 py-2 font-medium text-white hover:bg-red-600'
              >
                Cancel Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Legend = ({ label, color }: { label: string; color: string }) => (
  <div className='flex items-center gap-1'>
    <span
      className={`h-3 w-3 flex-shrink-0 rounded-full sm:h-4 sm:w-4 ${color}`}
    />
    <span className='text-sm text-gray-600'>{label}</span>
  </div>
);

export default Calendar;
