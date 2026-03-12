import { BrowserRouter, useRoutes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from '@/routes/AppRoutes';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { NotificationProvider } from '@/contexts/notifications/NotificationsContext';
import { RestaurantProvider } from '@/contexts/restaurant/RestaurantProvider';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const AppRoutesWrapper = () => {
  const routes = useRoutes(AppRoutes);
  return <>{routes}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <RestaurantProvider>
          <BrowserRouter>
            <AppRoutesWrapper />
            <Toaster position='top-right' />
          </BrowserRouter>
        </RestaurantProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
