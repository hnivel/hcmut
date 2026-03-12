import Login from '@/pages/login/Login';
import Dashboard from '@/pages/dashboard/Dashboard';
import PrivateRoutes from './PrivateRoutes';
import type { RouteObject } from 'react-router-dom';
import NotificationPage from '@/pages/notifications/NotificationPage';
import MatchedMentors from '@/pages/matched-mentors/MatchedMentors';
import MatchedMentorDetail from '@/pages/matched-mentors/MatchedMentorDetail';
import ExploreMentor from '@/pages/explore-mentors/ExploreMentor';
import MentorProfile from '@/pages/mentor-profile/MentorProfile';
import MatchingRequests from '@/pages/matching-requests/MatchingRequests';
import SentSessionRequests from '@/pages/sent-session-requests/SentSessionRequests';
import ReceivedRequests from '@/pages/received-session-requests/ReceivedSessionRequests';
import Profile from '@/pages/profile/Profile';
import MentorDashboard from '@/pages/mentor/MentorDashboard';
import MentorMatchedMentees from '@/pages/mentor/MentorMatchedMentees';
import MentorAvailability from '@/pages/mentor/MentorAvailability';
import { MatchedMenteeDetail } from '@/pages/mentor/MentorMatchedMentees';
import MentorMatchingRequest from '@/pages/mentor/MentorMatchingRequest';
import { MenteeProfile } from '@/pages/mentor/MentorMatchingRequest';
import MentorReceivedSessionRequests from '@/pages/mentor/MentorReceivedSessionRequests';
import MentorFeedback from '@/pages/mentor/MentorFeedback';
import Reports from '@/pages/reports/Reports';
import UnauthenticatedGateway from '@/pages/auth/UnauthenticatedGateway';

export const AppRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/auth',
    element: <UnauthenticatedGateway />,
  },
  {
    path: '/',
    element: (
      <PrivateRoutes>
        <Dashboard />
      </PrivateRoutes>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoutes>
        <Dashboard />
      </PrivateRoutes>
    ),
  },
  {
    path: '/notifications',
    element: (
      <PrivateRoutes>
        <NotificationPage />
      </PrivateRoutes>
    ),
  },
  {
    path: 'matching/matched-mentors',
    element: (
      <PrivateRoutes>
        <MatchedMentors />
      </PrivateRoutes>
    ),
  },
  {
    path: 'matching/matched-mentors/:id',
    element: (
      <PrivateRoutes>
        <MatchedMentorDetail />
      </PrivateRoutes>
    ),
  },
  {
    path: 'matching/explore-mentors',
    element: (
      <PrivateRoutes>
        <ExploreMentor />
      </PrivateRoutes>
    ),
  },
  {
    path: 'mentors/profile/:id',
    element: (
      <PrivateRoutes>
        <MentorProfile />
      </PrivateRoutes>
    ),
  },
  {
    path: 'matching/requests',
    element: (
      <PrivateRoutes>
        <MatchingRequests />
      </PrivateRoutes>
    ),
  },
  {
    path: 'session/sent-requests',
    element: (
      <PrivateRoutes>
        <SentSessionRequests />
      </PrivateRoutes>
    ),
  },
  {
    path: 'session/received-requests',
    element: (
      <PrivateRoutes>
        <ReceivedRequests />
      </PrivateRoutes>
    ),
  },
  {
    path: 'profile',
    element: (
      <PrivateRoutes>
        <Profile />
      </PrivateRoutes>
    ),
  },
  // Mentor Routes
  {
    path: 'mentor/matched-mentees',
    element: (
      <PrivateRoutes>
        <MentorMatchedMentees />
      </PrivateRoutes>
    ),
  },
  {
    path: 'mentor/matched-mentees/:id',
    element: (
      <PrivateRoutes>
        <MatchedMenteeDetail />
      </PrivateRoutes>
    ),
  },
  {
    path: 'mentor/my-availability/',
    element: (
      <PrivateRoutes>
        <MentorAvailability />
      </PrivateRoutes>
    ),
  },
  {
    path: 'mentor/matching-requests',
    element: (
      <PrivateRoutes>
        <MentorMatchingRequest />
      </PrivateRoutes>
    ),
  },
  {
    path: 'mentor/matching-requests/:id',
    element: (
      <PrivateRoutes>
        <MenteeProfile />
      </PrivateRoutes>
    ),
  },
  {
    path: 'mentor/received-requests',
    element: (
      <PrivateRoutes>
        <MentorReceivedSessionRequests />
      </PrivateRoutes>
    ),
  },
  {
    path: 'mentor/feedback',
    element: (
      <PrivateRoutes>
        <MentorFeedback />
      </PrivateRoutes>
    ),
  },
  // Reports (Faculty/Academic)
  {
    path: 'reports',
    element: (
      <PrivateRoutes>
        <Reports />
      </PrivateRoutes>
    ),
  },
];
