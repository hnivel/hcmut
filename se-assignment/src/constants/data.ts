// ============================================
// TYPES & INTERFACES
// ============================================

export type MeetingStatus = 'completed' | 'upcoming' | 'pending' | 'cancelled';
export type CalendarEventStatus = 'completed' | 'pending' | 'cancelled';
export type MatchedMentorStatus = 'Active' | 'Completed' | 'Cancelled';
export type SessionRequestStatus = 'Pending' | 'Accepted' | 'Rejected';
export type MatchingRequestStatus = 'Accepted' | 'Pending' | 'Rejected';
export type NotificationStatus = 'read' | 'unread';
export type CalendarType = 'availability' | 'sessionSchedule';

export interface MeetingEvent {
  id: string;
  type: 'individual' | 'group';
  title: string;
  subject: string;
  startTime: string; // 24-hour format: "07:00", "14:30"
  endTime: string; // 24-hour format: "09:00", "16:00"
  status: MeetingStatus;
  mentorId: string; // Reference to Mentor by ID
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

export interface MatchedMentor extends Mentor {
  status: MatchedMentorStatus;
  email: string;
  department: string;
  description: string;
  officeHours: string[];
  mentoringMethod: string;
}

export interface MatchingRequestMentor extends Mentor {
  yourDesiredArea: string;
  status: MatchingRequestStatus;
}

export interface SessionRequest {
  id: string;
  title: string;
  mentorId: string;
  mentorName: string;
  submitTime: string;
  status: SessionRequestStatus;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  proposedTimes?: string[];
  proposedLocations?: string[];
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
  relatedId?: string; // ID of related meeting, mentor, or request
  fromId?: string; // ID of the user (mentor) who triggered the notification
  from?: string; // Name of person who triggered the notification
  actionRequired?: boolean;
}

export interface UserProfile {
  id: string;
  role: 'mentee' | 'mentor';
  name: string;
  studentId?: string;
  email: string;
  faculty: string;
  department?: string;
  description?: string;
  goals?: string;
  avatar?: string;
  mentoringMethod?: string;
  supportArea?: string;
}

export interface SessionFeedback {
  id: string;
  mentorId: string;
  date: string;
  time: string;
  topic: string;
  problem: string;
  mentorFeedback: { comment: string };
  menteeFeedback: { rating: -1 | 1 | 2 | 3 | 4 | 5; comment: string };
}
export interface AvailabilityEvent {
  id: string;
  mentorId?: string;
  type: 'fixed' | 'flexible';
  day: string;
  time: string;
  endTime?: string;
  validFrom: string;
  validTo: string;
}

export interface Document {
  id: string;
  mentorId?: string;
  title: string;
  uploadDate: string;
  type: string;
}

// ============================================
// Mentors
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
// Explore Mentors
// ============================================

// Exclude mentors that are already matched (M001, M002, M003, M005, M007)
export const mockExploreMentors: Mentor[] = mockMentors.filter(
  (mentor) => !['M001', 'M002', 'M003', 'M005', 'M007'].includes(mentor.id),
);

// ============================================
// Matched Mentors
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
    ...mockMentors[1], // M002 - Tang Hong Ai
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
  {
    ...mockMentors[7], // M008 - Le Quang Huy (added to matched mentors because matching request status was Accepted)
    status: 'Active',
    email: 'le.huy@university.edu',
    department: 'Computer Science',
    description:
      'Focused on AI and computer vision applications with practical project mentoring and model deployment strategies.',
    officeHours: ['Tuesday 10 AM - 12 PM', 'Thursday 1 PM - 3 PM'],
    mentoringMethod:
      'Hands-on experimentation, iterative model improvement, and deployment-focused learning.',
  },
];

// ============================================
// MOCK DATA - MATCHING REQUESTS (Subset with Status & Desired Area)
// ============================================

export const mockMatchingRequests: MatchingRequestMentor[] = [
  // Only include mentors not yet matched; matched mentors moved to mockMatchedMentors.
  {
    ...mockMentors[5], // M006 - Hoang Minh Tuan
    yourDesiredArea: 'Cloud Computing',
    status: 'Pending',
  },
  {
    ...mockMentors[9], // M010 - Tran Thi Lan (new request example)
    yourDesiredArea: 'Cybersecurity',
    status: 'Accepted',
  },
  {
    ...mockMentors[10], // M011 - Dang Van Khoa
    yourDesiredArea: 'AI Ethics',
    status: 'Rejected',
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
        title: 'Math Modelling - Session 1',
        subject: 'Linear Optimization Fundamentals',
        startTime: '08:00',
        endTime: '09:45',
        status: 'completed',
        mentorId: 'M001', // Pham Khanh Duy - Math Modelling, Security
        link: 'https://meet.google.com/mentor-a-session',
        description:
          'Introduction to linear programming and optimization techniques. Covered simplex method, dual problems, and sensitivity analysis with practical examples.',
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
        title: 'Math Modelling - Session 2',
        subject: 'Nonlinear Systems & Applications',
        startTime: '09:00',
        endTime: '11:00',
        status: 'upcoming',
        mentorId: 'M002', // Tang Hong Ai - Math Modelling, Security
        link: 'https://meet.google.com/mentor-b-session',
        description:
          "Group workshop on nonlinear optimization problems. Focus on gradient descent methods, Newton's method, and real-world applications in engineering and economics.",
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
        title: 'Math Modelling - Session 3',
        subject: 'Dynamic Programming & Decision Models',
        startTime: '12:00',
        endTime: '15:00',
        status: 'pending',
        mentorId: 'M001', // Pham Khanh Duy - Math Modelling, Security
        location: 'Room A5.12, Building A',
        description:
          'Exploring dynamic programming techniques for sequential decision-making. Review of Bellman equations, optimal control theory, and applications to resource allocation problems.',
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
        type: 'individual',
        title: 'Machine Learning - Session 1',
        subject: 'Neural Networks Architecture',
        startTime: '14:00',
        endTime: '16:00',
        status: 'upcoming',
        mentorId: 'M005', // Nguyen Thi Mai - Machine Learning, Data Science
        link: 'https://meet.google.com/mentor-ml-session',
        description:
          'Deep dive into neural network architectures including feedforward, convolutional, and recurrent networks. Discussion on activation functions, backpropagation, and hyperparameter tuning strategies.',
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
];

// ============================================
// MOCK DATA - SESSION REQUESTS (Sent)
// ============================================

export const mockSentSessionRequests: SessionRequest[] = [
  {
    id: 'SR001',
    title: 'Open Session',
    mentorId: 'M001',
    mentorName: 'Pham Khanh Duy',
    submitTime: 'October 31, 2025',
    status: 'Pending',
    date: 'Friday, November 12, 2025',
    time: '14:00 - 15:00',
    location: 'Online: Google Meet',
    description:
      'Request for assistance with Database Design - SQL query optimization and indexing strategies for large datasets.',
    proposedTimes: [
      'Friday, November 12, 2025 - 14:00 - 15:00',
      'Saturday, November 13, 2025 - 10:00 - 11:00',
      'Monday, November 15, 2025 - 15:00 - 16:00',
    ],
    proposedLocations: [
      'Online: Google Meet',
      'Offline: Library Study Room 4',
      'Online: Zoom',
    ],
  },
  {
    id: 'SR002',
    title: 'Reschedule Request',
    mentorId: 'M002',
    mentorName: 'Tang Hong Ai',
    submitTime: 'October 30, 2025',
    status: 'Accepted',
    date: 'Tuesday, November 2, 2025',
    time: '11:00 - 12:00',
    location: 'Offline: Building C, Room 301',
    description:
      'Software Engineering - Design Patterns and SOLID principles. Need to reschedule due to conflicting exam schedule.',
    proposedTimes: [
      'Thursday, November 4, 2025 - 13:00 - 14:00',
      'Friday, November 5, 2025 - 14:00 - 15:00',
    ],
    proposedLocations: ['Online: Microsoft Teams', 'Offline: Innovation Lab'],
  },
  {
    id: 'SR003',
    title: 'Open Session',
    mentorId: 'M003',
    mentorName: 'Nguyen Tran Yen Nhi',
    submitTime: 'October 29, 2025',
    status: 'Rejected',
    date: 'Wednesday, November 10, 2025',
    time: '09:00 - 10:00',
    location: 'Offline: Computer Lab 5',
    description:
      'Artificial Intelligence - Reinforcement Learning algorithms. Looking to understand Q-learning and policy gradients.',
    proposedTimes: [
      'Wednesday, November 10, 2025 - 09:00 - 10:00',
      'Thursday, November 11, 2025 - 16:00 - 17:00',
      'Friday, November 12, 2025 - 11:00 - 12:00',
    ],
    proposedLocations: [
      'Offline: Computer Lab 5',
      'Online: Discord',
      'Offline: AI Research Lab',
    ],
  },
  {
    id: 'SR005',
    title: 'Reschedule Request',
    mentorId: 'M005',
    mentorName: 'Nguyen Thi Mai',
    submitTime: 'October 28, 2025',
    status: 'Accepted',
    date: 'Friday, October 29, 2025',
    time: '13:00 - 14:00',
    location: 'Offline: Main Auditorium',
    description:
      'Operating Systems - Process scheduling and memory management. Reschedule needed due to medical appointment.',
    proposedTimes: [
      'Monday, November 1, 2025 - 11:00 - 12:00',
      'Tuesday, November 2, 2025 - 15:00 - 16:00',
    ],
    proposedLocations: ['Online: Microsoft Teams', 'Offline: Study Hall A'],
  },
];

// ============================================
// MOCK DATA - SESSION REQUESTS (Received)
// ============================================

export const mockReceivedSessionRequests: SessionRequest[] = [
  {
    id: 'RR001',
    title: 'Reschedule Request',
    mentorId: 'M001',
    mentorName: 'Pham Khanh Duy',
    submitTime: 'October 28, 2025',
    status: 'Pending',
    date: 'Friday, November 5, 2025',
    time: '14:00 - 15:00',
    location: 'Online: Google Meet',
    description:
      'Need help with Math Modelling - Advanced Optimization Techniques. Would like to review mathematical optimization and modelling strategies.',
    proposedTimes: [
      'Friday, November 5, 2025 - 14:00 - 15:00',
      'Saturday, November 6, 2025 - 10:00 - 11:00',
      'Monday, November 8, 2025 - 15:00 - 16:00',
    ],
    proposedLocations: [
      'Online: Google Meet',
      'Offline: Library Study Room 2',
      'Online: Zoom',
    ],
  },
  {
    id: 'RR003',
    title: 'Session Invitation',
    mentorId: 'M005',
    mentorName: 'Nguyen Thi Mai',
    submitTime: 'October 27, 2025',
    status: 'Accepted',
    date: 'Thursday, November 4, 2025',
    time: '16:00 - 17:00',
    location: 'Online: Microsoft Teams',
    description:
      'Machine Learning - Neural Networks Implementation. Looking forward to discussing deep learning architectures and optimization techniques.',
    proposedTimes: [
      'Thursday, November 4, 2025 - 16:00 - 17:00',
      'Friday, November 5, 2025 - 15:00 - 16:00',
    ],
    proposedLocations: ['Online: Microsoft Teams', 'Offline: Computer Lab 3'],
  },
  {
    id: 'RR004',
    title: 'Reschedule Request',
    mentorId: 'M007',
    mentorName: 'Pham Thu Huong',
    submitTime: 'October 26, 2025',
    status: 'Accepted',
    date: 'Wednesday, October 27, 2025',
    time: '10:00 - 11:00',
    location: 'Offline: Study Hall B',
    description:
      'Mobile Development - React Native Navigation. Need to reschedule to review navigation patterns and state management in React Native applications.',
    proposedTimes: [
      'Friday, October 29, 2025 - 13:00 - 14:00',
      'Saturday, October 30, 2025 - 11:00 - 12:00',
    ],
    proposedLocations: ['Online: Google Meet', 'Offline: Campus Starbucks'],
  },
  {
    id: 'RR005',
    title: 'Session Invitation',
    mentorId: 'M001',
    mentorName: 'Pham Khanh Duy',
    submitTime: 'October 25, 2025',
    status: 'Rejected',
    date: 'Monday, November 1, 2025',
    time: '08:00 - 09:00',
    location: 'Offline: Main Library',
    description:
      'Security - Penetration Testing Basics. Introduction to ethical hacking techniques and security vulnerability assessment.',
    proposedTimes: [
      'Monday, November 1, 2025 - 08:00 - 09:00',
      'Tuesday, November 2, 2025 - 07:00 - 08:00',
      'Wednesday, November 3, 2025 - 09:00 - 10:00',
    ],
    proposedLocations: [
      'Offline: Main Library',
      'Online: Discord',
      'Offline: Security Lab',
    ],
  },
  {
    id: 'RR006',
    title: 'Session Invitation',
    mentorId: 'M005',
    mentorName: 'Nguyen Thi Mai',
    submitTime: 'October 30, 2025',
    status: 'Pending',
    date: 'Friday, November 12, 2025',
    time: '11:00 - 12:00',
    location: 'Online: Google Meet',
    description:
      'Data Science - Advanced Analytics Patterns. Discussion on data preprocessing, feature engineering, and model evaluation techniques.',
    proposedTimes: [
      'Friday, November 12, 2025 - 11:00 - 12:00',
      'Saturday, November 13, 2025 - 14:00 - 15:00',
      'Monday, November 15, 2025 - 16:00 - 17:00',
    ],
    proposedLocations: [
      'Online: Google Meet',
      'Offline: Innovation Hub',
      'Online: Zoom',
    ],
  },
];

// ============================================
// MOCK DATA - NOTIFICATIONS
// ============================================

// ============================================
// MOCK DATA - NOTIFICATIONS (MENTEE)
// ============================================

export const mockNotifications: Notification[] = [
  {
    id: 'N001',
    type: 'session_request',
    title: 'Session Request Accepted',
    message:
      'Pham Khanh Duy accepted your session request for Math Modelling on Oct 27 at 07:00',
    status: 'unread',
    timestamp: new Date('2025-11-09T15:30:00').toISOString(),
    relatedId: 'ME001',
    fromId: 'M001',
    from: 'Pham Khanh Duy',
    actionRequired: false,
  },
  {
    id: 'N002',
    type: 'matching_request',
    // A mentee initiates matching; notifications to mentee should reflect updates from mentor side.
    // Correcting incorrect phrasing where mentor supposedly "sent" a request.
    title: 'Matching Request Approved',
    message:
      'Your matching request to Nguyen Thi Mai (Machine Learning) has been approved',
    status: 'read',
    timestamp: new Date('2025-11-09T10:15:00').toISOString(),
    relatedId: 'M005',
    // System-generated update; no specific sender
    fromId: undefined,
    from: 'System',
    actionRequired: false,
  },
  {
    id: 'N003',
    type: 'session_reminder',
    title: 'Upcoming Session Reminder',
    message:
      'You have a session with Tang Hong Ai tomorrow at 09:00 - Math Modelling',
    status: 'unread',
    timestamp: new Date('2025-11-09T18:00:00').toISOString(),
    relatedId: 'ME002',
    fromId: 'M002',
    from: 'Tang Hong Ai',
    actionRequired: false,
  },
  {
    id: 'N004',
    type: 'reschedule_request',
    title: 'Reschedule Request',
    message:
      'Pham Khanh Duy requested to reschedule your session from Nov 15 to Nov 16',
    status: 'read',
    timestamp: new Date('2025-11-08T14:20:00').toISOString(),
    relatedId: 'MT003',
    fromId: 'M001',
    from: 'Pham Khanh Duy',
    actionRequired: true,
  },
  {
    id: 'N005',
    type: 'session_cancelled',
    title: 'Session Cancelled',
    message:
      'Your session with Pham Khanh Duy on Oct 31 has been cancelled due to mentor unavailability',
    status: 'read',
    timestamp: new Date('2025-11-07T11:45:00').toISOString(),
    relatedId: 'ME003',
    fromId: 'M001',
    from: 'Pham Khanh Duy',
    actionRequired: false,
  },
  {
    id: 'N006',
    type: 'feedback_request',
    title: 'Feedback Request',
    message:
      'Please provide feedback for your completed session with Tang Hong Ai',
    status: 'unread',
    timestamp: new Date('2025-11-06T16:30:00').toISOString(),
    relatedId: 'ME002',
    fromId: 'M002',
    from: 'Tang Hong Ai',
    actionRequired: true,
  },
  {
    id: 'N007',
    type: 'matching_request',
    title: 'Matching Request Approved',
    message: 'Your matching request with Tran Van An has been approved',
    status: 'read',
    timestamp: new Date('2025-11-05T09:10:00').toISOString(),
    relatedId: 'M004',
    fromId: 'M004',
    from: 'Tran Van An',
    actionRequired: false,
  },
  {
    id: 'N008',
    type: 'session_request',
    title: 'Session Request Declined',
    message:
      'Nguyen Tran Yen Nhi declined your session request for Nov 10 - Time slot not available',
    status: 'read',
    timestamp: new Date('2025-11-04T13:25:00').toISOString(),
    relatedId: 'SR003',
    fromId: 'M003',
    from: 'Nguyen Tran Yen Nhi',
    actionRequired: false,
  },
  {
    id: 'N009',
    type: 'general',
    title: 'New Learning Materials',
    message:
      'New resources for Machine Learning fundamentals have been shared by your mentor',
    status: 'read',
    timestamp: new Date('2025-11-03T10:00:00').toISOString(),
    fromId: 'M005',
    from: 'Nguyen Thi Mai',
    actionRequired: false,
  },
  {
    id: 'N010',
    type: 'session_reminder',
    title: 'Session Starting Soon',
    message:
      'Your session with Pham Khanh Duy starts in 1 hour - Math Modelling',
    status: 'read',
    timestamp: new Date('2025-10-27T09:00:00').toISOString(),
    relatedId: 'ME001',
    fromId: 'M001',
    from: 'Pham Khanh Duy',
    actionRequired: false,
  },
];

// ============================================
// MOCK DATA - USER PROFILE
// ============================================

export const mockUserProfile: UserProfile[] = [
  {
    id: 'U001',
    role: 'mentee',
    name: 'Le Phan Khai Vinh',
    studentId: '2313914',
    email: 'vinhlpk@hcmut.edu.vn',
    faculty: 'Computer Science & Engineering',
    description:
      'I am a passionate student who loves exploring new technologies and solving real-world problems through coding. In my free time, I enjoy contributing to open-source projects and collaborating with like-minded individuals. I am eager to connect with mentors who can guide me in my learning journey and help me grow both personally and professionally.',
    goals:
      'To improve my software engineering skills and contribute to impactful open-source projects. I aim to learn best practices in coding, project management, and collaboration from experienced mentors. Additionally, I want to expand my network within the tech community and gain insights into the latest industry trends and technologies.',
  },
  {
    id: 'U002',
    role: 'mentor',
    name: 'Pham Khanh Duy',
    email: 'giantkd@hcmut.edu.vn',
    faculty: 'Computer Science & Engineering',
    department: 'Computer Science',
    description:
      'Experienced mentor specializing in mathematical modelling and security. Passionate about guiding students to achieve their academic and career goals through personalized mentoring and practical insights.',
    mentoringMethod:
      'I prefer a mix of online consultations and hands-on projects to provide practical learning experiences. Regular check-ins and feedback sessions help ensure mentees stay on track and achieve their objectives.',
    supportArea: 'Math Modelling, Security',
  },
];

// ============================================
// MOCK DATA - SESSION FEEDBACK
// ============================================

export const mockSessionFeedback: SessionFeedback[] = [
  {
    id: '#0923',
    mentorId: 'M001',
    date: 'Friday, September 23, 2025',
    time: '7 AM - 9 AM',
    topic: 'Math Modelling - Chapter X',
    problem: 'Problem: abc',
    mentorFeedback: { comment: '' },
    menteeFeedback: { rating: -1, comment: '' },
  },
  {
    id: '#0909',
    mentorId: 'M001',
    date: 'Friday, September 9, 2025',
    time: '7 AM - 9 AM',
    topic: 'Math Modelling - Chapter X',
    problem: 'Problem: mnqp',
    mentorFeedback: {
      comment: 'Great progress made on understanding the concepts.',
    },
    menteeFeedback: { rating: -1, comment: '' },
  },
  {
    id: '#0815',
    mentorId: 'M002',
    date: 'Tuesday, August 15, 2025',
    time: '10 AM - 12 PM',
    topic: 'Security Protocols - Advanced Concepts',
    problem: 'Problem: Understanding encryption algorithms',
    mentorFeedback: { comment: '' },
    menteeFeedback: { rating: 4, comment: 'Good mentor, explained well.' },
  },
  {
    id: '#0801',
    mentorId: 'M005',
    date: 'Friday, August 1, 2025',
    time: '9 AM - 11 AM',
    topic: 'React State Management',
    problem: 'Problem: Implementing Redux in large applications',
    mentorFeedback: {
      comment: 'Provided useful resources on Redux and state management.',
    },
    menteeFeedback: { rating: 5, comment: 'Excellent mentor, very helpful!' },
  },
];

export const mockDocuments: Document[] = [
  {
    id: 'D001',
    mentorId: 'M001',
    title: 'Guide to Mathematical Modelling',
    uploadDate: '2024-10-01',
    type: 'PDF',
  },
  {
    id: 'D002',
    mentorId: 'M002',
    title: 'Security Best Practices',
    uploadDate: '2024-10-05',
    type: 'PDF',
  },
  {
    id: 'D003',
    mentorId: 'M005',
    title: 'React for Beginners',
    uploadDate: '2024-10-10',
    type: 'eBook',
  },
  {
    id: 'D004',
    mentorId: 'M003',
    title: 'Advanced Optimization Problems',
    uploadDate: '2024-10-15',
    type: 'PDF',
  },
  {
    id: 'D005',
    mentorId: 'M007',
    title: 'ML Notebook: CNN Architectures',
    uploadDate: '2024-10-18',
    type: 'Notebook',
  },
];

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
  fixed: 'bg-purple-200 border-purple-400',
  flexible: 'bg-blue-200 border-blue-400',
};

export const matchingRequestStatusColors: Record<
  MatchingRequestStatus,
  string
> = {
  Accepted: 'bg-green-100 text-green-700 border-green-300',
  Rejected: 'bg-rose-100 text-rose-700 border-rose-300',
  Pending: 'bg-orange-100 text-orange-700 border-orange-300',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getMentorById = (mentorId: string): Mentor | undefined => {
  return mockMentors.find((m) => m.id === mentorId);
};

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
  mentor: Mentor | undefined;
} => {
  const meeting = getMeetingById(calendarEvent.meetingId);
  const event = getEventFromMeeting(
    calendarEvent.meetingId,
    calendarEvent.eventId,
  );
  const mentor = event ? getMentorById(event.mentorId) : undefined;

  return {
    calendarEvent,
    meeting,
    event,
    mentor,
  };
};

export const getPopulatedCalendarEvents = () => {
  return mockCalendarEvents.map((ce) => getPopulatedCalendarEvent(ce));
};
