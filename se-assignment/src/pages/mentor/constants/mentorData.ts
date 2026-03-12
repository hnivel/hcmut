// ============================================
// TYPES & INTERFACES
// ============================================

export type MeetingStatus = 'completed' | 'upcoming' | 'pending' | 'cancelled';
export type CalendarEventStatus =
  | 'completed'
  | 'upcoming'
  | 'pending'
  | 'cancelled';
export type MatchedMentorStatus = 'Active' | 'Completed' | 'Cancelled';
export type SessionRequestStatus = 'Pending' | 'Accepted' | 'Rejected';
export type MatchingRequestStatus = 'Accepted' | 'Pending' | 'Rejected';
export type NotificationStatus = 'read' | 'unread';

export interface MeetingEvent {
  id: string;
  type: 'individual' | 'group';
  title: string;
  subject: string;
  startTime: string; // 24-hour format: "07:00", "14:30"
  endTime: string; // 24-hour format: "09:00", "16:00"
  status: MeetingStatus;
  mentees: { name: string; status: SessionRequestStatus }[];
  link?: string;
  location?: string;
  description: string;
  cancelReason?: string;
}

export interface Meeting {
  id: string;
  date: string;
  day: string;
  month: string;
  year: number;
  events?: MeetingEvent[];
}

export interface CalendarEvent {
  id: string;
  meetingId: string; // Reference to Meeting
  eventId: string; // Reference to MeetingEvent within the Meeting
  day: string;
  time: string;
  endTime?: string; // End time for the event (e.g., "09:30")
}

export interface Mentor {
  id: string;
  name: string;
  faculty: string;
  supportArea: string;
  avatar?: string;
  email?: string;
  department?: string;
  description?: string;
  officeHours?: string[];
  mentoringMethod?: string;
}

export interface Mentee {
  id: string;
  name: string;
  faculty: string;
  goals: string;
  avatar?: string;
  email: string;
  studentId: string;
  description: string;
}

export interface MatchedMentee extends Mentee {
  status: MatchedMentorStatus;
  supportArea: string;
}

export interface MatchedMentor extends Mentor {
  status: MatchedMentorStatus;
  email: string;
  department: string;
  description: string;
  officeHours: string[];
  mentoringMethod: string;
}

export interface MatchingRequestMentor extends Mentee {
  desiredArea: string;
  status: MatchingRequestStatus;
}

export interface SessionRequest {
  id: string;
  title: string;
  mentorId: string;
  mentorName: string;
  submitTime: string;
  status: SessionRequestStatus;
}

export interface ReceivedSessionRequest {
  id: number;
  type: 'Open Session' | 'Reschedule';
  mentee: string;
  submitTime: string;
  status: SessionRequestStatus;
  date: string;
  time: string;
  location: string;
  description: string;
  proposedTimes: string[];
  proposedLocations: string[];
}

export interface Notification {
  id: string;
  type:
    | 'session_request'
    | 'reschedule_request'
    | 'matching_request'
    | 'session_reminder'
    | 'session_cancelled'
    | 'feedback_request'
    | 'general';
  title: string;
  message: string;
  status: NotificationStatus;
  timestamp: string;
  relatedId?: string; // ID of related meeting, mentee, or request
  fromId?: string; // ID of the user (mentee or system)
  from?: string; // Name of person who triggered the notification
  actionRequired?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  studentId: string;
  email: string;
  faculty: string;
  description: string;
  goals: string;
  avatar?: string;
}

export interface SessionFeedback {
  id: string;
  date: string;
  time: string;
  topic: string;
  problem: string;
  mentorFeedback: boolean;
  menteesFeedback: {
    menteeID: string;
    score?: 1 | 2 | 3 | 4 | 5; // Mentee rates mentor (5-star)
    comment?: string;
  }[];
  mentorEvaluations?: {
    menteeID: string;
    comment?: string;
  }[];
}

export interface AvailabilityEvent {
  id: string;
  mentorId?: string;
  day: string;
  time: string;
  endTime?: string;
  type: 'fixed' | 'flexible';
  validFrom: string;
  validTo: string;
  duration?: number; // Duration in hours (e.g., 1, 1.5, 2) - deprecated, use endTime instead
}

export interface Document {
  id: string;
  title: string;
  uploadDate: string;
  type: string;
}

// ============================================
// MOCK DATA - MENTORS (Master List)
// ============================================

export const mockMentors: Mentor[] = [
  {
    id: 'M001',
    name: 'Pham Khanh Duy',
    faculty: 'Computer Science & Engineering',
    supportArea: 'Math Modelling, Security',
  },
  {
    id: 'M002',
    name: 'Tang Hong Ai',
    faculty: 'Computer Science & Engineering',
    supportArea: 'Math Modelling, Security',
  },
  {
    id: 'M003',
    name: 'Nguyen Tran Yen Nhi',
    faculty: 'Computer Science & Engineering',
    supportArea: 'Math Modelling, Security',
  },
  {
    id: 'M004',
    name: 'Tran Van An',
    faculty: 'Computer Science & Engineering',
    supportArea: 'Web Development, Database Design',
  },
  {
    id: 'M005',
    name: 'Nguyen Thi Mai',
    faculty: 'Computer Science & Engineering',
    supportArea: 'Machine Learning, Data Science',
  },
  {
    id: 'M006',
    name: 'Hoang Minh Tuan',
    faculty: 'Computer Science & Engineering',
    supportArea: 'Cloud Computing, DevOps',
  },
  {
    id: 'M007',
    name: 'Pham Thu Huong',
    faculty: 'Computer Science & Engineering',
    supportArea: 'Mobile Development, UX Design',
  },
  {
    id: 'M008',
    name: 'Le Quang Huy',
    faculty: 'Computer Science & Engineering',
    supportArea: 'AI, Computer Vision',
  },
  {
    id: 'M009',
    name: 'Nguyen Van Binh',
    faculty: 'Computer Science & Engineering',
    supportArea: 'Blockchain, Distributed Systems',
  },
  {
    id: 'M010',
    name: 'Tran Thi Lan',
    faculty: 'Computer Science & Engineering',
    supportArea: 'Cybersecurity, Network Security',
  },
  {
    id: 'M011',
    name: 'Dang Van Khoa',
    faculty: 'Computer Science & Engineering',
    supportArea: 'Full-stack Development, React',
  },
  {
    id: 'M012',
    name: 'Vu Thi Ngoc',
    faculty: 'Computer Science & Engineering',
    supportArea: 'Data Engineering, Big Data',
  },
  {
    id: 'M013',
    name: 'Bui Minh Duc',
    faculty: 'Computer Science & Engineering',
    supportArea: 'Software Architecture, Design Patterns',
  },
  {
    id: 'M014',
    name: 'Do Thi Thanh',
    faculty: 'Computer Science & Engineering',
    supportArea: 'Natural Language Processing, Chatbots',
  },
  {
    id: 'M015',
    name: 'Ngo Van Hung',
    faculty: 'Computer Science & Engineering',
    supportArea: 'Game Development, Unity',
  },
];

// ============================================
// MOCK DATA - MENTEES (Master List)
// ============================================

export const mockMentees: Mentee[] = [
  {
    id: 'MT001',
    name: 'Le Thi Hoa',
    faculty: 'Computer Science & Engineering',
    goals: 'Improve coding skills and learn about web development.',
    description:
      'A passionate learner eager to enhance web development skills.',
    email: 'le.hoa@university.edu',
    studentId: '23CSE001',
  },
  {
    id: 'MT002',
    name: 'Tran Van Binh',
    faculty: 'Computer Science & Engineering',
    goals: 'Gain insights into machine learning and AI applications.',
    description: 'Interested in exploring AI and machine learning concepts.',
    email: 'tran.binh@university.edu',
    studentId: '23CSE002',
  },
  {
    id: 'MT003',
    name: 'Nguyen Thi Lan',
    faculty: 'Computer Science & Engineering',
    goals: 'Understand cloud computing and DevOps practices.',
    description: 'Keen to learn about cloud infrastructure and DevOps tools.',
    email: 'nguyen.lan@university.edu',
    studentId: '23CSE003',
  },
  {
    id: 'MT004',
    name: 'Pham Van Long',
    faculty: 'Computer Science & Engineering',
    goals: 'Develop skills in mobile app development and UX design.',
    description: 'Aspiring mobile developer with a focus on user experience.',
    email: 'pham.long@university.edu',
    studentId: '23CSE004',
  },
  {
    id: 'MT005',
    name: 'Hoang Thi Mai',
    faculty: 'Computer Science & Engineering',
    goals: 'Learn about cybersecurity and network security fundamentals.',
    description:
      'Interested in protecting systems and data from cyber threats.',
    email: 'hoang.mai@university.edu',
    studentId: '23CSE005',
  },
  {
    id: 'MT006',
    name: 'Vu Van Tuan',
    faculty: 'Computer Science & Engineering',
    goals: 'Explore blockchain technology and distributed systems.',
    description:
      'Eager to understand blockchain applications and architecture.',
    email: 'vu.tuan@university.edu',
    studentId: '23CSE006',
  },
  {
    id: 'MT007',
    name: 'Nguyen Van An',
    faculty: 'Computer Science & Engineering',
    goals: 'Gain practical experience in software development.',
    description:
      'Aspiring software developer with a focus on full-stack development.',
    email: 'nguyen.an@university.edu',
    studentId: '23CSE007',
  },
  {
    id: 'MT008',
    name: 'Le Thi Kim',
    faculty: 'Computer Science & Engineering',
    goals: 'Learn about data science and machine learning.',
    description: 'Aspiring data scientist with a passion for analytics.',
    email: 'le.kim@university.edu',
    studentId: '23CSE008',
  },
  {
    id: 'MT009',
    name: 'Tran Minh Khoa',
    faculty: 'Computer Science & Engineering',
    goals: 'Understand advanced algorithms and data structures.',
    description: 'Enthusiastic about solving complex computational problems.',
    email: 'tran.khoa@university.edu',
    studentId: '23CSE009',
  },
  {
    id: 'MT010',
    name: 'Pham Thi Huong',
    faculty: 'Computer Science & Engineering',
    goals: 'Master software testing and quality assurance.',
    description: 'Dedicated to ensuring software reliability and performance.',
    email: 'pham.huong@university.edu',
    studentId: '23CSE010',
  },
];

// ============================================
// MOCK DATA - MATCHED MENTEES (Subset with Status)
// ============================================

export const mockMatchedMentees: MatchedMentee[] = [
  {
    ...mockMentees[0],
    status: 'Cancelled',
    supportArea: 'Web Development, UX Design',
  },
  {
    ...mockMentees[1],
    status: 'Completed',
    supportArea: 'Machine Learning, Data Science',
  },
  {
    ...mockMentees[2],
    status: 'Active',
    supportArea: 'Cloud Computing, DevOps',
  },
  {
    ...mockMentees[3],
    status: 'Active',
    supportArea: 'Mobile App Development, UX Design',
  },
  {
    ...mockMentees[4],
    status: 'Active',
    supportArea: 'Cybersecurity, Network Security',
  },
  {
    ...mockMentees[5],
    status: 'Active',
    supportArea: 'Blockchain, Distributed Systems',
  },
  {
    ...mockMentees[6],
    status: 'Active',
    supportArea: 'Full-stack Development, React',
  },
];

// ============================================
// MOCK DATA - EXPLORE MENTORS (Subset)
// ============================================

// Export all mentors for exploration (you can filter this based on logic)
export const mockExploreMentors: Mentor[] = mockMentors;

// ============================================
// MOCK DATA - MATCHED MENTORS (Subset with Status)
// ============================================

export const mockMatchedMentors: MatchedMentor[] = [
  {
    ...mockMentors[0], // M001 - Pham Khanh Duy
    status: 'Active',
    email: 'pham.duy@university.edu',
    department: 'Computer Science',
    description:
      'Passionate about guiding students in applied mathematics and system modelling. Experienced in security research and mathematical optimization.',
    officeHours: [
      'Monday 7 AM - 9 AM',
      'Tuesday 7 AM - 9 AM',
      'Friday 7 AM - 9 AM',
    ],
    mentoringMethod:
      'Online consultation, collaborative projects, and hands-on exercises with a focus on practical problem-solving.',
  },
  {
    ...mockMentors[1], // M002 - Le Phan Khai Vinh
    status: 'Completed',
    email: 'le.vinh@university.edu',
    department: 'Computer Science',
    description:
      'Specializing in mathematical modelling and security protocols. Dedicated to helping students master complex theoretical concepts.',
    officeHours: ['Wednesday 10 AM - 12 PM', 'Thursday 2 PM - 4 PM'],
    mentoringMethod:
      'One-on-one sessions, group workshops, and project-based learning.',
  },
  {
    ...mockMentors[2], // M003 - Nguyen Tran Yen Nhi
    status: 'Cancelled',
    email: 'nguyen.nhi@university.edu',
    department: 'Computer Science',
    description:
      'Expert in mathematical modelling and security. Focuses on building strong foundational knowledge through structured mentoring.',
    officeHours: ['Monday 3 PM - 5 PM', 'Friday 1 PM - 3 PM'],
    mentoringMethod:
      'Structured curriculum-based mentoring with regular assessments.',
  },
  {
    ...mockMentors[4], // M005 - Nguyen Thi Mai
    status: 'Active',
    email: 'nguyen.mai@university.edu',
    department: 'Software Engineering',
    description:
      'Experienced in web development and modern JavaScript frameworks. Passionate about teaching practical software engineering skills.',
    officeHours: ['Tuesday 9 AM - 11 AM', 'Thursday 3 PM - 5 PM'],
    mentoringMethod:
      'Real-world project collaboration, code reviews, and agile development practices.',
  },
  {
    ...mockMentors[6], // M007 - Pham Thu Huong
    status: 'Active',
    email: 'pham.huong@university.edu',
    department: 'Computer Science',
    description:
      'Specializing in machine learning and data science. Committed to helping students understand AI concepts through practical applications.',
    officeHours: [
      'Monday 1 PM - 3 PM',
      'Wednesday 2 PM - 4 PM',
      'Friday 10 AM - 12 PM',
    ],
    mentoringMethod:
      'Interactive learning with real datasets, research paper discussions, and ML project guidance.',
  },
];

// ============================================
// MOCK DATA - MATCHING REQUESTS (Subset with Status & Desired Area)
// ============================================

export const mockMatchingRequests: MatchingRequestMentor[] = [
  {
    ...mockMentees[0], // MT001 - Pham Khanh Duy (Cancelled - can request again)
    desiredArea: 'Math Modelling, Career Development',
    status: 'Pending',
  },
  {
    ...mockMentees[1], // MT002 - Le Thi Hoa (Completed - can request again)
    desiredArea: 'Data Science, Machine Learning',
    status: 'Accepted',
  },
  {
    ...mockMentees[7], // MT008 - Le Quang Huy (Not yet matched)
    desiredArea: 'Artificial Intelligence, Deep Learning',
    status: 'Pending',
  },
  {
    ...mockMentees[8], // MT009 - Tran Minh Khoa (Not yet matched)
    desiredArea: 'Database Design, SQL Optimization',
    status: 'Rejected',
  },
  {
    ...mockMentees[9], // MT010 - Nguyen Thi Linh (Not yet matched)
    desiredArea: 'Software Testing, Quality Assurance',
    status: 'Pending',
  },
];
// ============================================

export const mockMeetings: Meeting[] = [
  // === October ===
  {
    id: 'MT001',
    date: 'Mon 27',
    day: 'Monday',
    month: 'October',
    year: 2025,
    events: [
      {
        id: 'ME001',
        type: 'individual',
        title: 'Career Development - Session 1',
        subject: 'Resume Building & Interview Preparation',
        startTime: '10:00',
        endTime: '13:45',
        status: 'completed',
        mentees: [{ name: 'Pham Khanh Duy', status: 'Accepted' }],
        link: 'https://meet.google.com/mentor-a-session',
        description:
          'Discussion on resume building, interview preparation, and personal skill development.',
      },
    ],
  },
  {
    id: 'MT002',
    date: 'Wed 29',
    day: 'Wednesday',
    month: 'October',
    year: 2025,
    events: [
      {
        id: 'ME002',
        type: 'group',
        title: 'Calculus - Session 1',
        subject: 'Final Exam Review & Problem Solving',
        startTime: '15:00',
        endTime: '17:00',
        status: 'upcoming',
        mentees: [
          { name: 'Le Phan Khai Vinh', status: 'Accepted' },
          { name: 'Tran Van An', status: 'Pending' },
          { name: 'Nguyen Tran Yen Nhi', status: 'Rejected' },
        ],
        link: 'https://meet.google.com/mentor-b-session',
        description:
          'Comprehensive review of key calculus concepts and problem-solving techniques in preparation for the final exam.',
      },
    ],
  },
  {
    id: 'MT003',
    date: 'Fri 31',
    day: 'Friday',
    month: 'October',
    year: 2025,
    events: [
      {
        id: 'ME003',
        type: 'individual',
        title: 'Project Management - Session 1',
        subject: 'Milestone Planning & Progress Review',
        startTime: '16:00',
        endTime: '18:00',
        status: 'pending',
        mentees: [{ name: 'Nguyen Tran Yen Nhi', status: 'Accepted' }],
        location: 'Room A5.12, Building A',
        description: 'Project milestone discussion and next steps planning.',
      },
    ],
  },

  // === November ===
  {
    id: 'MT004',
    date: 'Mon 10',
    day: 'Monday',
    month: 'November',
    year: 2025,
    events: [
      {
        id: 'ME004',
        type: 'group',
        title: 'Computer Networks - Session 1',
        subject: 'Career Paths in Networking & Infrastructure',
        startTime: '10:00',
        endTime: '13:00',
        status: 'upcoming',
        mentees: [
          { name: 'Nguyen Thi Mai', status: 'Accepted' },
          { name: 'Hoang Minh Tuan', status: 'Rejected' },
        ],
        link: 'https://meet.google.com/mentor-c-session',
        description:
          'Guidance on career paths in computer networking and infrastructure.',
      },
      {
        id: 'ME005',
        type: 'individual',
        title: 'Data Science - Session 1',
        subject: 'Introduction to Machine Learning',
        startTime: '14:00',
        endTime: '15:30',
        status: 'upcoming',
        mentees: [{ name: 'Le Thi Hoa', status: 'Accepted' }],
        link: 'https://meet.google.com/mentor-d-session',
        description:
          'Introduction to machine learning algorithms and practical applications.',
      },
    ],
  },
  {
    id: 'MT005',
    date: 'Wed 12',
    day: 'Wednesday',
    month: 'November',
    year: 2025,
    events: [
      {
        id: 'ME006',
        type: 'group',
        title: 'Web Development - Session 1',
        subject: 'React Hooks & State Management',
        startTime: '09:00',
        endTime: '11:30',
        status: 'upcoming',
        mentees: [
          { name: 'Tran Van Binh', status: 'Accepted' },
          { name: 'Pham Van Long', status: 'Accepted' },
        ],
        link: 'https://meet.google.com/mentor-e-session',
        description:
          'Deep dive into React hooks, state management, and component patterns.',
      },
    ],
  },
  {
    id: 'MT006',
    date: 'Fri 14',
    day: 'Friday',
    month: 'November',
    year: 2025,
    events: [
      {
        id: 'ME007',
        type: 'individual',
        title: 'Cloud Computing - Session 1',
        subject: 'AWS Deployment & Infrastructure',
        startTime: '13:00',
        endTime: '14:30',
        status: 'pending',
        mentees: [{ name: 'Nguyen Thi Lan', status: 'Pending' }],
        location: 'Computer Lab 5',
        description:
          'Hands-on session for deploying applications to AWS cloud infrastructure.',
      },
    ],
  },
];

// ============================================
// MOCK DATA - CALENDAR EVENTS
// ============================================

// Generate calendar events from mockMeetings
export const mockCalendarEvents: CalendarEvent[] = mockMeetings.flatMap(
  (meeting, meetingIndex) =>
    meeting.events?.map((event, eventIndex) => ({
      id: `CE${String(meetingIndex + 1).padStart(3, '0')}${String(eventIndex + 1).padStart(1, '0')}`,
      meetingId: meeting.id,
      eventId: event.id,
      day: meeting.day,
      time: event.startTime,
      endTime: event.endTime,
    })) || [],
);

// ============================================
// MOCK DATA - MENTOR AVAILABILITY EVENTS
// ============================================

export const mockMentorAvailabilityEvents: AvailabilityEvent[] = [
  {
    id: 'AE001',
    mentorId: 'M001',
    type: 'fixed',
    day: 'Monday',
    time: '07:00',
    endTime: '09:00',
    validFrom: '2025-11-01',
    validTo: '2025-12-31',
  },
  {
    id: 'AE002',
    mentorId: 'M001',
    type: 'fixed',
    day: 'Monday',
    time: '14:00',
    endTime: '16:00',
    validFrom: '2025-11-01',
    validTo: '2025-12-31',
  },
  {
    id: 'AE003',
    mentorId: 'M002',
    type: 'flexible',
    day: 'Tuesday',
    time: '10:00',
    endTime: '12:00',
    validFrom: '2025-11-01',
    validTo: '2025-11-30',
  },
  {
    id: 'AE004',
    mentorId: 'M003',
    type: 'fixed',
    day: 'Wednesday',
    time: '09:00',
    endTime: '11:00',
    validFrom: '2025-11-01',
    validTo: '2025-12-31',
  },
  {
    id: 'AE005',
    mentorId: 'M003',
    type: 'flexible',
    day: 'Wednesday',
    time: '15:00',
    endTime: '17:00',
    validFrom: '2025-11-01',
    validTo: '2025-11-30',
  },
  {
    id: 'AE006',
    mentorId: 'M005',
    type: 'fixed',
    day: 'Thursday',
    time: '08:00',
    endTime: '10:00',
    validFrom: '2025-11-01',
    validTo: '2025-12-31',
  },
  {
    id: 'AE007',
    mentorId: 'M005',
    type: 'flexible',
    day: 'Thursday',
    time: '13:00',
    endTime: '15:00',
    validFrom: '2025-11-01',
    validTo: '2025-11-30',
  },
  {
    id: 'AE008',
    mentorId: 'M007',
    type: 'fixed',
    day: 'Friday',
    time: '09:00',
    endTime: '11:00',
    validFrom: '2025-11-01',
    validTo: '2025-12-31',
  },
  {
    id: 'AE009',
    mentorId: 'M007',
    type: 'flexible',
    day: 'Friday',
    time: '14:00',
    endTime: '16:00',
    validFrom: '2025-11-01',
    validTo: '2025-11-30',
  },
  {
    id: 'AE010',
    mentorId: 'M007',
    type: 'fixed',
    day: 'Saturday',
    time: '10:00',
    endTime: '12:00',
    validFrom: '2025-11-01',
    validTo: '2025-12-31',
  },
];

// ============================================
// MOCK DATA - SESSION REQUESTS (Sent)
// ============================================

export const mockSentSessionRequests: SessionRequest[] = [
  {
    id: 'SR001',
    title: 'Open session Request',
    mentorId: 'M001',
    mentorName: 'NAK',
    submitTime: 'February 30, 2025',
    status: 'Pending',
  },
  {
    id: 'SR002',
    title: 'Reschedule Request',
    mentorId: 'M002',
    mentorName: 'NAK',
    submitTime: 'February 30, 2025',
    status: 'Accepted',
  },
  {
    id: 'SR003',
    title: 'Open session Request',
    mentorId: 'M003',
    mentorName: 'NAK',
    submitTime: 'February 30, 2025',
    status: 'Rejected',
  },
];

// ============================================
// MOCK DATA - SESSION REQUESTS (Received)
// ============================================

export const mockReceivedSessionRequests: SessionRequest[] = [
  {
    id: 'RR001',
    title: 'Session Invitation',
    mentorId: 'M001',
    mentorName: 'NAK',
    submitTime: 'February 30, 2025',
    status: 'Pending',
  },
  {
    id: 'RR002',
    title: 'Reschedule Request',
    mentorId: 'M002',
    mentorName: 'NAK',
    submitTime: 'February 30, 2025',
    status: 'Accepted',
  },
  {
    id: 'RR003',
    title: 'Session Invitation',
    mentorId: 'M003',
    mentorName: 'NAK',
    submitTime: 'February 30, 2025',
    status: 'Rejected',
  },
];

// ============================================
// MOCK DATA - SESSION REQUESTS (Received for Mentors)
// ============================================

export const mockMentorReceivedSessionRequests: ReceivedSessionRequest[] = [
  {
    id: 1,
    type: 'Open Session',
    mentee: 'Le Thi Hoa',
    submitTime: 'October 28, 2025',
    status: 'Pending',
    date: 'Friday, November 5, 2025',
    time: '2PM - 3PM',
    location: 'Online: http://google-meet.com',
    description: 'Need help with Data Structures - Trees and Graphs',
    proposedTimes: [
      'Friday, November 5, 2025 - 2PM - 3PM',
      'Saturday, November 6, 2025 - 10AM - 11AM',
    ],
    proposedLocations: ['Online: Google Meet', 'Offline: Library Study Room'],
  },
  {
    id: 2,
    type: 'Reschedule',
    mentee: 'Tran Van Binh',
    submitTime: 'October 29, 2025',
    status: 'Pending',
    date: 'Monday, November 1, 2025',
    time: '9AM - 10AM',
    location: 'Offline: Building A, Room 205',
    description: 'Machine Learning - Neural Networks Implementation',
    proposedTimes: [
      'Tuesday, November 2, 2025 - 3PM - 4PM',
      'Wednesday, November 3, 2025 - 2PM - 3PM',
    ],
    proposedLocations: ['Online: Zoom Meeting', 'Offline: Canteen Area'],
  },
  {
    id: 3,
    type: 'Open Session',
    mentee: 'Nguyen Thi Lan',
    submitTime: 'October 27, 2025',
    status: 'Accepted',
    date: 'Thursday, November 4, 2025',
    time: '4PM - 5PM',
    location: 'Online: Microsoft Teams',
    description: 'Cloud Computing - AWS Deployment Strategies',
    proposedTimes: [
      'Thursday, November 4, 2025 - 4PM - 5PM',
      'Friday, November 5, 2025 - 3PM - 4PM',
    ],
    proposedLocations: ['Online: Microsoft Teams', 'Offline: Computer Lab 3'],
  },
  {
    id: 4,
    type: 'Reschedule',
    mentee: 'Pham Van Long',
    submitTime: 'October 26, 2025',
    status: 'Accepted',
    date: 'Wednesday, October 27, 2025',
    time: '10AM - 11AM',
    location: 'Offline: Study Hall B',
    description: 'Mobile Development - React Native Navigation',
    proposedTimes: [
      'Friday, October 29, 2025 - 1PM - 2PM',
      'Saturday, October 30, 2025 - 11AM - 12PM',
    ],
    proposedLocations: ['Online: Google Meet', 'Offline: Starbucks Campus'],
  },
  {
    id: 5,
    type: 'Open Session',
    mentee: 'Hoang Thi Mai',
    submitTime: 'October 25, 2025',
    status: 'Rejected',
    date: 'Monday, November 1, 2025',
    time: '8AM - 9AM',
    location: 'Offline: Main Library',
    description: 'Cybersecurity - Penetration Testing Basics',
    proposedTimes: [
      'Monday, November 1, 2025 - 8AM - 9AM',
      'Tuesday, November 2, 2025 - 7AM - 8AM',
    ],
    proposedLocations: ['Offline: Main Library', 'Online: Discord'],
  },
  {
    id: 6,
    type: 'Reschedule',
    mentee: 'Vu Van Tuan',
    submitTime: 'October 30, 2025',
    status: 'Rejected',
    date: 'Sunday, November 7, 2025',
    time: '6PM - 7PM',
    location: 'Online: Skype',
    description: 'Blockchain - Smart Contract Development',
    proposedTimes: [
      'Monday, November 8, 2025 - 5PM - 6PM',
      'Tuesday, November 9, 2025 - 4PM - 5PM',
    ],
    proposedLocations: ['Online: Google Meet', 'Offline: Tech Hub'],
  },
];

// ============================================
// MOCK DATA - NOTIFICATIONS (MENTOR)
// ============================================

export const mockNotifications: Notification[] = [
  {
    id: 'MN001',
    type: 'session_request',
    title: 'New Session Request',
    message:
      'Le Thi Hoa requested a session for Data Science - Machine Learning on Nov 12 at 14:00',
    status: 'unread',
    timestamp: new Date('2025-11-09T16:45:00').toISOString(),
    relatedId: 'SR012',
    fromId: 'MT001',
    from: 'Le Thi Hoa',
    actionRequired: true,
  },
  {
    id: 'MN002',
    type: 'session_request',
    title: 'New Session Request',
    message:
      'Tran Van Binh requested a session for Web Development - React on Nov 15 at 10:00',
    status: 'unread',
    timestamp: new Date('2025-11-09T14:20:00').toISOString(),
    relatedId: 'SR013',
    fromId: 'MT002',
    from: 'Tran Van Binh',
    actionRequired: true,
  },
  {
    id: 'MN003',
    type: 'matching_request',
    title: 'New Matching Request',
    message:
      'Le Quang Huy sent you a matching request for Artificial Intelligence mentorship',
    status: 'unread',
    timestamp: new Date('2025-11-09T11:30:00').toISOString(),
    relatedId: 'MR008',
    from: 'Le Quang Huy',
    actionRequired: true,
  },
  {
    id: 'MN004',
    type: 'reschedule_request',
    title: 'Reschedule Request',
    message:
      'Pham Khanh Duy requested to reschedule session from Nov 11 to Nov 13',
    status: 'unread',
    timestamp: new Date('2025-11-08T15:10:00').toISOString(),
    relatedId: 'ME001',
    from: 'Pham Khanh Duy',
    actionRequired: true,
  },
  {
    id: 'MN005',
    type: 'session_reminder',
    title: 'Upcoming Session Reminder',
    message:
      'You have a session with Nguyen Thi Lan tomorrow at 13:00 - Cloud Computing',
    status: 'read',
    timestamp: new Date('2025-11-08T18:00:00').toISOString(),
    relatedId: 'ME007',
    from: 'System',
    actionRequired: false,
  },
  {
    id: 'MN006',
    type: 'feedback_request',
    title: 'Feedback Pending',
    message:
      'Please provide feedback for your completed session with Pham Khanh Duy',
    status: 'read',
    timestamp: new Date('2025-11-07T17:30:00').toISOString(),
    relatedId: 'ME001',
    from: 'System',
    actionRequired: true,
  },
  {
    id: 'MN007',
    type: 'session_cancelled',
    title: 'Session Cancelled',
    message: 'Vu Van Tuan cancelled the session scheduled for Nov 10',
    status: 'read',
    timestamp: new Date('2025-11-06T10:15:00').toISOString(),
    relatedId: 'ME003',
    from: 'Vu Van Tuan',
    actionRequired: false,
  },
  {
    id: 'MN008',
    type: 'matching_request',
    title: 'Matching Request Accepted',
    message: 'Nguyen Thi Linh accepted your counter-offer for mentorship',
    status: 'read',
    timestamp: new Date('2025-11-05T14:45:00').toISOString(),
    relatedId: 'MR010',
    from: 'Nguyen Thi Linh',
    actionRequired: false,
  },
  {
    id: 'MN009',
    type: 'matching_request',
    title: 'Matching Request Declined',
    message: 'Tran Minh Khoa declined your matching request',
    status: 'read',
    timestamp: new Date('2025-11-04T09:30:00').toISOString(),
    relatedId: 'MR009',
    from: 'Tran Minh Khoa',
    actionRequired: false,
  },
  {
    id: 'MN010',
    type: 'general',
    title: 'New Mentee Matched',
    message: 'You have been matched with a new mentee: Pham Van Long',
    status: 'read',
    timestamp: new Date('2025-11-03T11:00:00').toISOString(),
    from: 'System',
    actionRequired: false,
  },
  {
    id: 'MN011',
    type: 'session_reminder',
    title: 'Session Starting Soon',
    message:
      'Your session with Tran Van Binh starts in 30 minutes - Web Development',
    status: 'read',
    timestamp: new Date('2025-11-02T08:30:00').toISOString(),
    relatedId: 'ME006',
    from: 'System',
    actionRequired: false,
  },
  {
    id: 'MN012',
    type: 'reschedule_request',
    title: 'Reschedule Request Approved',
    message: 'Le Thi Hoa approved your reschedule request for Nov 15',
    status: 'read',
    timestamp: new Date('2025-11-01T16:20:00').toISOString(),
    relatedId: 'ME005',
    from: 'Le Thi Hoa',
    actionRequired: false,
  },
  {
    id: 'MN013',
    type: 'session_request',
    title: 'Session Request Accepted',
    message: 'You accepted the session request from Hoang Thi Mai for Nov 11',
    status: 'read',
    timestamp: new Date('2025-10-31T16:15:00').toISOString(),
    relatedId: 'SR014',
    from: 'Hoang Thi Mai',
    actionRequired: false,
  },
];

// ============================================
// MOCK DATA - USER PROFILE
// ============================================

export const mockUserProfile: UserProfile = {
  id: 'U001',
  name: 'Le Phan Khai Vinh',
  studentId: '23xxxxx',
  email: 'kysutailanh@gmail.com',
  faculty: 'Computer Science & Engineering',
  description:
    'I am a passionate student who loves exploring new technologies and solving real-world problems through coding. In my free time, I enjoy contributing to open-source projects and collaborating with like-minded individuals. I am eager to connect with mentors who can guide me in my learning journey and help me grow both personally and professionally.',
  goals:
    'To improve my software engineering skills and contribute to impactful open-source projects. I aim to learn best practices in coding, project management, and collaboration from experienced mentors. Additionally, I want to expand my network within the tech community and gain insights into the latest industry trends and technologies.',
};

// ============================================
// MOCK DATA - SESSION FEEDBACK
// ============================================

export const mockSessionFeedback: SessionFeedback[] = [
  {
    id: 'SF001',
    date: '2024-10-05',
    time: '10:00 AM',
    topic: 'Calculus Review',
    problem: 'Difficulty understanding integration by parts.',
    mentorFeedback: true,
    menteesFeedback: [
      {
        menteeID: 'MT001',
        score: 4,
        comment: 'Clear explanation, helped a lot.',
      },
      {
        menteeID: 'MT003',
      },
      {
        menteeID: 'MT005',
        score: 5,
        comment: 'Very patient and thorough.',
      },
    ],
    mentorEvaluations: [
      {
        menteeID: 'MT001',
        comment: 'Good participation and understanding.',
      },
    ],
  },
  {
    id: 'SF002',
    date: '2024-10-07',
    time: '2:00 PM',
    topic: 'Machine Learning Basics',
    problem: 'Confused about overfitting vs underfitting.',
    mentorFeedback: true,
    menteesFeedback: [
      { menteeID: 'MT006', score: 5, comment: 'Great examples and visuals.' },
    ],
    mentorEvaluations: [
      {
        menteeID: 'MT006',
        comment: 'Excellent grasp of concepts.',
      },
    ],
  },
  {
    id: 'SF003',
    date: '2024-10-08',
    time: '4:00 PM',
    topic: 'Web Development Workflow',
    problem: 'Unclear git branching strategy for teams.',
    mentorFeedback: false,
    menteesFeedback: [
      {
        menteeID: 'MT004',
      },
      {
        menteeID: 'MT002',
      },
    ],
    mentorEvaluations: [
      {
        menteeID: 'MT004',
      },
      {
        menteeID: 'MT002',
      },
    ],
  },
  {
    id: 'SF004',
    date: '2024-10-11',
    time: '11:00 AM',
    topic: 'Cloud Deployment',
    problem: 'Trouble deploying containerized apps.',
    mentorFeedback: true,
    menteesFeedback: [
      {
        menteeID: 'MT006',
        score: 4,
        comment: 'Step-by-step was very helpful.',
      },
    ],
    mentorEvaluations: [
      {
        menteeID: 'MT006',
        comment: 'Excellent problem-solving skills.',
      },
    ],
  },
  {
    id: 'SF005',
    date: '2024-10-12',
    time: '3:30 PM',
    topic: 'Data Structures',
    problem: 'Difficulty choosing appropriate data structures.',
    mentorFeedback: false,
    menteesFeedback: [
      {
        menteeID: 'MT003',
        score: 3,
        comment: 'Good overview, want more examples.',
      },
    ],
    mentorEvaluations: [
      {
        menteeID: 'MT003',
        comment: 'Needs more practice with implementations.',
      },
    ],
  },
  {
    id: 'SF006',
    date: '2024-10-15',
    time: '9:00 AM',
    topic: 'Career Roadmap',
    problem: 'Uncertain about next steps after graduation.',
    mentorFeedback: true,
    menteesFeedback: [
      {
        menteeID: 'MT005',
        score: 5,
        comment: 'Very motivating and clear plan.',
      },
    ],
    mentorEvaluations: [
      {
        menteeID: 'MT005',
        comment: 'Very motivated and clear goals.',
      },
    ],
  },
  {
    id: 'SF007',
    date: '2024-10-18',
    time: '1:00 PM',
    topic: 'Security Fundamentals',
    problem: 'How to start learning practical security skills.',
    mentorFeedback: true,
    menteesFeedback: [
      {
        menteeID: 'MT002',
        score: 5,
        comment: 'Recommended labs were excellent.',
      },
      { menteeID: 'MT001', score: 4 },
    ],
    mentorEvaluations: [
      {
        menteeID: 'MT002',
        comment: 'Very engaged and asked great questions.',
      },
      { menteeID: 'MT001' },
    ],
  },
  {
    id: 'SF008',
    date: '2024-10-20',
    time: '5:00 PM',
    topic: 'UX & Mobile Design',
    problem: 'Identifying user pain points for an app idea.',
    mentorFeedback: false,
    menteesFeedback: [
      {
        menteeID: 'MT004',
        score: 4,
        comment: 'Practical tips for user interviews.',
      },
    ],
    mentorEvaluations: [
      {
        menteeID: 'MT004',
        comment: 'Creative thinking and good implementation.',
      },
    ],
  },
  {
    id: 'SF009',
    date: '2024-10-22',
    time: '10:30 AM',
    topic: 'Research Paper Reading',
    problem: 'How to efficiently read and extract value from papers.',
    mentorFeedback: true,
    menteesFeedback: [
      {
        menteeID: 'MT007',
        score: 4,
        comment: 'Good strategy on skimming and deep reads.',
      },
    ],
    mentorEvaluations: [
      {
        menteeID: 'MT007',
        comment: 'Good analytical skills.',
      },
    ],
  },
  {
    id: 'SF010',
    date: '2024-10-25',
    time: '2:15 PM',
    topic: 'Database Design',
    problem: 'Normalization vs denormalization trade-offs.',
    mentorFeedback: true,
    menteesFeedback: [
      {
        menteeID: 'MT003',
        score: 5,
        comment: 'Examples clarified real trade-offs.',
      },
    ],
    mentorEvaluations: [
      {
        menteeID: 'MT003',
        comment: 'Perfect understanding of concepts.',
      },
    ],
  },
  {
    id: 'SF011',
    date: '2024-10-27',
    time: '11:45 AM',
    topic: 'Project Management',
    problem: 'Splitting tasks among team members effectively.',
    mentorFeedback: false,
    menteesFeedback: [
      {
        menteeID: 'MT001',
      },
      {
        menteeID: 'MT005',
      },
    ],
    mentorEvaluations: [
      {
        menteeID: 'MT001',
      },
      {
        menteeID: 'MT005',
      },
    ],
  },
  {
    id: 'SF012',
    date: '2024-10-29',
    time: '4:30 PM',
    topic: 'AI Ethics',
    problem: 'Understanding bias mitigation strategies.',
    mentorFeedback: true,
    menteesFeedback: [
      {
        menteeID: 'MT007',
        score: 5,
        comment: 'Insightful discussion and resources.',
      },
      { menteeID: 'MT006', score: 4 },
    ],
    mentorEvaluations: [
      {
        menteeID: 'MT007',
        comment: 'Thoughtful insights on ethics.',
      },
      { menteeID: 'MT006' },
    ],
  },
  {
    id: 'SF013',
    date: '2024-10-30',
    time: '2:00 PM',
    topic: 'React Advanced Patterns',
    problem: 'Understanding hooks and state management.',
    mentorFeedback: false,
    menteesFeedback: [
      {
        menteeID: 'MT001',
      },
      {
        menteeID: 'MT002',
      },
    ],
    mentorEvaluations: [
      {
        menteeID: 'MT001',
      },
      {
        menteeID: 'MT002',
      },
    ],
  },
  {
    id: 'SF014',
    date: '2024-10-31',
    time: '10:00 AM',
    topic: 'Database Optimization',
    problem: 'Query performance issues.',
    mentorFeedback: false,
    menteesFeedback: [
      {
        menteeID: 'MT003',
      },
      {
        menteeID: 'MT004',
      },
      {
        menteeID: 'MT005',
      },
    ],
    mentorEvaluations: [
      {
        menteeID: 'MT003',
      },
      {
        menteeID: 'MT004',
      },
      {
        menteeID: 'MT005',
      },
    ],
  },
];

// ============================================
// MOCK DATA - DOCUMENTS
// ============================================

export const mockDocuments: Document[] = [
  {
    id: 'DOC001',
    title: 'Calculus Review Notes.pdf',
    uploadDate: '2024-09-15',
    type: 'PDF',
  },
  {
    id: 'DOC002',
    title: 'Machine Learning Basics.pptx',
    uploadDate: '2024-09-20',
    type: 'PowerPoint',
  },
  {
    id: 'DOC003',
    title: 'Web Development Best Practices.docx',
    uploadDate: '2024-10-01',
    type: 'Word',
  },
  {
    id: 'DOC004',
    title: 'Database Design Tutorial.pdf',
    uploadDate: '2024-10-10',
    type: 'PDF',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getMeetingById = (meetingId: string): Meeting | undefined => {
  return mockMeetings.find((m) => m.id === meetingId);
};

export const getEventFromMeeting = (
  meetingId: string,
  eventId: string,
): MeetingEvent | undefined => {
  const meeting = getMeetingById(meetingId);
  return meeting?.events?.find((e) => e.id === eventId);
};

export const getPopulatedCalendarEvent = (
  calendarEvent: CalendarEvent,
): {
  calendarEvent: CalendarEvent;
  meeting: Meeting | undefined;
  event: MeetingEvent | undefined;
  mentee: Mentee | undefined;
} => {
  const meeting = getMeetingById(calendarEvent.meetingId);
  const event = getEventFromMeeting(
    calendarEvent.meetingId,
    calendarEvent.eventId,
  );
  // For mentor view, we don't have a single mentee (might be multiple or none)
  // So we return undefined for mentee - the component can access meeting.events.mentees
  const mentee = undefined;

  return {
    calendarEvent,
    meeting,
    event,
    mentee,
  };
};

export const getPopulatedCalendarEvents = () => {
  return mockCalendarEvents.map((ce) => getPopulatedCalendarEvent(ce));
};

export const getMenteeById = (menteeId: string): Mentee | undefined => {
  return mockMentees.find((m) => m.id === menteeId);
};

// ============================================
// UTILITY CONSTANTS
// ============================================

export const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

export const statusColors = {
  // Meeting statuses
  completed: 'bg-green-100 text-green-700 border-green-200',
  upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  canceled: 'bg-gray-100 text-gray-600 border-gray-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200',

  // Matched mentor statuses
  Active: 'bg-green-100 text-green-700 border-green-300',
  Completed: 'bg-amber-100 text-amber-700 border-amber-300',
  Cancelled: 'bg-gray-100 text-gray-600 border-gray-300',

  // Session request statuses
  Pending: 'border-amber-400 text-amber-700 bg-amber-100',
  Accepted: 'border-green-400 text-green-700 bg-green-50',
  Rejected: 'border-rose-400 text-rose-700 bg-rose-50',
};

export const calendarStatusColors = {
  completed: 'bg-green-200 border-green-400',
  upcoming: 'bg-blue-200 border-blue-400',
  pending: 'bg-yellow-200 border-yellow-400',
  cancelled: 'bg-gray-300 border-gray-400',
};

export const matchingRequestStatusColors: Record<
  MatchingRequestStatus,
  string
> = {
  Accepted: 'bg-green-100 text-green-700 border-green-300',
  Rejected: 'bg-rose-100 text-rose-700 border-rose-300',
  Pending: 'bg-orange-100 text-orange-700 border-orange-300',
};
