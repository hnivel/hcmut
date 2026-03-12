import type { User } from '@/services/users/users.interface';

// Mock users database - you can expand this as needed
export const mockUsers: User[] = [
  // Mentees
  {
    userId: 'mentee-001',
    firstName: 'Vinh',
    lastName: 'Le Phan Khai',
    email: 'vinhlpk@hcmut.edu.vn',
    role: 'mentee',
    department: 'Computer Science',
    faculty: 'Engineering',
  },
  {
    userId: 'mentee-002',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@student.edu',
    role: 'mentee',
    department: 'Computer Science',
    faculty: 'Engineering',
  },
  {
    userId: 'mentee-003',
    firstName: 'Carol',
    lastName: 'Davis',
    email: 'carol.davis@student.edu',
    role: 'mentee',
    department: 'Electrical Engineering',
    faculty: 'Engineering',
  },

  // Mentors
  {
    userId: 'mentor-001',
    firstName: 'Duy',
    lastName: 'Pham Khanh',
    email: 'giantkd@hcmut.edu.vn',
    role: 'mentor',
    department: 'Computer Science',
    faculty: 'Engineering',
    supportAreas: ['Data Structures', 'Algorithms', 'Software Engineering'],
  },
  {
    userId: 'mentor-002',
    firstName: 'Prof. Michael',
    lastName: 'Brown',
    email: 'michael.brown@university.edu',
    role: 'mentor',
    department: 'Computer Science',
    faculty: 'Engineering',
    supportAreas: ['Web Development', 'Database Systems', 'System Design'],
  },
  {
    userId: 'mentor-003',
    firstName: 'Dr. Jennifer',
    lastName: 'Garcia',
    email: 'jennifer.garcia@university.edu',
    role: 'mentor',
    department: 'Computer Science',
    faculty: 'Engineering',
    supportAreas: [
      'Machine Learning',
      'Artificial Intelligence',
      'Data Science',
    ],
  },

  // Faculty/Academic Staff
  {
    userId: 'faculty-001',
    firstName: 'Dr. Robert',
    lastName: 'Anderson',
    email: 'robert.anderson@university.edu',
    role: 'faculty',
    department: 'Computer Science',
    faculty: 'Engineering',
  },
  {
    userId: 'faculty-002',
    firstName: 'Prof. Elizabeth',
    lastName: 'Taylor',
    email: 'elizabeth.taylor@university.edu',
    role: 'faculty',
    department: 'Academic Affairs',
    faculty: 'Administration',
  },
  {
    userId: 'faculty-003',
    firstName: 'Khang',
    lastName: 'Pham',
    email: 'khang.pham@hcmut.edu.vn',
    role: 'faculty',
    department: 'Computer Science',
    faculty: 'Engineering',
  }
];

// Mock credentials for easy login (email : password)
export const mockCredentials = {
  // Mentees
  'vinhlpk@hcmut.edu.vn': 'password123',
  'bob.smith@student.edu': 'password123',
  'carol.davis@student.edu': 'password123',

  // Mentors
  'giantkd@hcmut.edu.vn': 'password123',
  'michael.brown@university.edu': 'password123',
  'jennifer.garcia@university.edu': 'password123',

  // Faculty
  'khang.pham@hcmut.edu.vn': 'password123',
  'elizabeth.taylor@university.edu': 'password123',
};

// Helper function to authenticate user
export const authenticateUser = (
  email: string,
  password: string,
): User | null => {
  // Check if credentials are valid
  if (mockCredentials[email as keyof typeof mockCredentials] === password) {
    // Find and return the user
    const user = mockUsers.find((user) => user.email === email);
    return user || null;
  }
  return null;
};

// Helper function to get user by ID
export const getUserById = (userId: string): User | null => {
  return mockUsers.find((user) => user.userId === userId) || null;
};
