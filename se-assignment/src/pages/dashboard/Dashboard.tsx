import { DashboardFooter, UpcomingMeetings } from './components';
import { useRole } from '@/hooks/auth/useRole';
import MentorDashboard from '../mentor/MentorDashboard';
import Calendar from '../../components/ui/Calendar';
import {
  mockMeetings,
  mockMentors,
  type Meeting,
  type CalendarEvent,
  type Mentor,
} from '@/constants/data';
import SidebarWrapper from '@/components/layouts/SidebarWrapper';
import { useState, useMemo } from 'react';
const Dashboard = () => {
  const { isMentor, isFaculty } = useRole();

  if (isMentor) {
    return <MentorDashboard />;
  }

  if (isFaculty) {
    return (
      <div className='page-layout'>
        {/* Responsive Sidebar Wrapper */}
        <SidebarWrapper />

        {/* Main Content */}
        <div className='flex flex-1 flex-col'>
          <main className='w-full flex-1 py-12 md:py-16'>
            {/* Centered container */}
            <div className='page-container'>
              {/* Header */}
              <div className='page-header'>
                <h1 className='page-title'>
                  Welcome to Faculty Dashboard of BK-TTS
                </h1>
              </div>
            </div>
          </main>

          <DashboardFooter />
        </div>
      </div>
    );
  }

  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const calendarEvents: CalendarEvent[] = useMemo(
    () =>
      meetings.flatMap((meeting, meetingIndex) =>
        (meeting.events || []).map((event, eventIndex) => ({
          id: `CE${String(meetingIndex + 1).padStart(3, '0')}${String(
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
    const mentor: Mentor | undefined = event
      ? mockMentors.find((m) => m.id === event.mentorId)
      : undefined;
    return { calendarEvent: ce, meeting, event, mentor };
  };

  return (
    <div className='page-layout'>
      {/* Responsive Sidebar Wrapper */}
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
                    role='mentee'
                    type='sessionSchedule'
                    getPopulatedEvent={getPopulatedEvent}
                    meetings={meetings}
                    setMeetings={setMeetings}
                  />
                </div>
              </section>
            </div>
          </div>
        </main>

        <DashboardFooter />
      </div>
    </div>
  );
};

export default Dashboard;
