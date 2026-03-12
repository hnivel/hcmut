import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/hooks/auth/useRole';

const RoleBasedRedirect = () => {
  const navigate = useNavigate();
  const { isDriver, isRestaurant } = useRole();

  useEffect(() => {
    if (isDriver) {
      navigate('/driver/deliveries', { replace: true });
    } else if (isRestaurant) {
      navigate('/restaurant/dashboard', { replace: true });
    } else {
      // Default to customer view (Explore)
      navigate('/explore', { replace: true });
    }
  }, [isDriver, isRestaurant, navigate]);

  return <div>Loading...</div>;
};

export default RoleBasedRedirect;
