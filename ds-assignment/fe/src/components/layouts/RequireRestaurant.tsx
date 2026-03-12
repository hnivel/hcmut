import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layouts/Sidebar';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useRestaurantContext } from '@/hooks/restaurant/useRestaurantContext';

interface RequireRestaurantProps {
  children: ReactNode;
}

export const RequireRestaurant = ({ children }: RequireRestaurantProps) => {
  const navigate = useNavigate();
  const { selectedRestaurant } = useRestaurantContext();

  if (!selectedRestaurant) {
    return (
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />
        <main className='ml-64 flex flex-1 items-center justify-center'>
          <Card className='max-w-md p-8 text-center'>
            <AlertCircle size={48} className='mx-auto mb-4 text-orange-500' />
            <h3 className='mb-2 text-xl font-bold text-gray-900'>
              No Restaurant Selected
            </h3>
            <p className='mb-6 text-gray-600'>
              Please select a restaurant to continue
            </p>
            <button
              onClick={() => navigate('/restaurant/settings')}
              className='rounded-lg bg-blue-500 px-6 py-2 font-medium text-white hover:bg-blue-600'
            >
              Select Restaurant
            </button>
          </Card>
        </main>
      </div>
    );
  }

  return <>{children}</>;
};
