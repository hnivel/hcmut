import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AppRoutes } from '@/routes/AppRoutes';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { NotificationProvider } from '@/contexts/notifications/NotificationContext';

const AppRoutesWrapper = () => {
  const routes = useRoutes(AppRoutes);
  return <div className='min-h-screen w-full'>{routes}</div>;
};

const App = () => (
  <AuthProvider>
    <NotificationProvider>
      <BrowserRouter>
        <AppRoutesWrapper />
      </BrowserRouter>
    </NotificationProvider>
  </AuthProvider>
);

export default App;
