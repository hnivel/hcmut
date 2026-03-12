import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layouts/Sidebar';
import { Card } from '@/components/ui/card';
import { Save, MapPin, Info, Image, ArrowLeft } from 'lucide-react';
import { restaurantService } from '@/services/restaurants/restaurant.tsx';
import type { CreateRestaurantDto } from '@/services/restaurants/restaurant.interface';

interface RestaurantFormData {
  name: string;
  description: string;
  phone: string;
  email: string;
  address_details: string;
  image_url: string;
  latitude: number | '';
  longitude: number | '';
  status: 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED';
}

const CreateRestaurant = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    description: '',
    phone: '',
    email: '',
    address_details: '',
    image_url: '',
    latitude: '',
    longitude: '',
    status: 'OPEN',
  });

  const handleChange = (
    field: keyof RestaurantFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      setError('Restaurant name is required');
      return;
    }

    if (!formData.address_details.trim()) {
      setError('Address is required');
      return;
    }

    // Email validator
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email.trim())) {
        setError('Please enter a valid email address.');
        return;
      }
    }

    // Phone validator (Vietnam format: +84 or 0, 9-10 digits)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^(\+84|0)(\d{9,10})$/;
      if (!phoneRegex.test(formData.phone.trim().replace(/\s+/g, ''))) {
        setError('Please enter a valid phone number (Vietnam format).');
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const createData: CreateRestaurantDto = {
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        address_details: formData.address_details.trim(),
        latitude:
          typeof formData.latitude === 'number' ? formData.latitude : undefined,
        longitude:
          typeof formData.longitude === 'number'
            ? formData.longitude
            : undefined,
        status: formData.status,
        // Note: The API will auto-generate restaurant_id and set owner_id from JWT
        // registration_date will be set by the backend
      };

      const createdRestaurant =
        await restaurantService.createRestaurant(createData);
      console.log('Restaurant created successfully:', createdRestaurant);
      // Navigate back to settings to see the new restaurant
      navigate('/restaurant/settings');
    } catch (err: any) {
      console.error('Failed to create restaurant:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to create restaurant',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/restaurant/settings');
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />

      <main className='ml-64 flex-1'>
        <div className='container mx-auto max-w-4xl px-6 py-6 text-left'>
          {/* Header */}
          <div className='mb-6'>
            <button
              onClick={handleCancel}
              className='mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900'
            >
              <ArrowLeft size={20} />
              Back to Restaurant Settings
            </button>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='mb-2 text-3xl font-bold text-gray-900'>
                  Create New Restaurant
                </h1>
                <p className='text-gray-600'>
                  Set up your new restaurant profile
                </p>
              </div>
            </div>
          </div>

          {error && (
            <Card className='mb-6 border-red-200 bg-red-50 p-4'>
              <p className='text-red-700'>{error}</p>
            </Card>
          )}

          {/* Basic Information */}
          <Card className='mb-6 p-6'>
            <div className='mb-4 flex items-center gap-2'>
              <Info className='text-blue-600' size={20} />
              <h2 className='text-lg font-bold text-gray-900'>
                Basic Information
              </h2>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Restaurant Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className='w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none'
                  placeholder='Enter restaurant name'
                  required
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className='w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none'
                  rows={3}
                  placeholder='Tell customers about your restaurant'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className='w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='+84 901 234 567'
                  />
                </div>

                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Email
                  </label>
                  <input
                    type='email'
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className='w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='contact@restaurant.com'
                  />
                </div>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Restaurant Image URL
                </label>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    value={formData.image_url}
                    onChange={(e) => handleChange('image_url', e.target.value)}
                    className='flex-1 rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='https://example.com/image.jpg'
                  />
                  <div className='flex items-center gap-2 rounded-lg border px-3'>
                    <Image className='text-gray-400' size={20} />
                  </div>
                </div>
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt='Restaurant preview'
                    className='mt-2 h-32 w-full rounded-lg object-cover'
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    handleChange(
                      'status',
                      e.target.value as
                        | 'OPEN'
                        | 'CLOSED'
                        | 'TEMPORARILY_CLOSED',
                    )
                  }
                  className='w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none'
                >
                  <option value='OPEN'>Open</option>
                  <option value='CLOSED'>Closed</option>
                  <option value='TEMPORARILY_CLOSED'>Temporarily Closed</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className='mb-6 p-6'>
            <div className='mb-4 flex items-center gap-2'>
              <MapPin className='text-blue-600' size={20} />
              <h2 className='text-lg font-bold text-gray-900'>Location</h2>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Address <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.address_details}
                  onChange={(e) =>
                    handleChange('address_details', e.target.value)
                  }
                  className='w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none'
                  placeholder='123 Nguyen Hue Street, District 1, Ho Chi Minh City'
                  required
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Latitude
                  </label>
                  <input
                    type='number'
                    step='any'
                    value={formData.latitude}
                    onChange={(e) =>
                      handleChange(
                        'latitude',
                        e.target.value ? parseFloat(e.target.value) : '',
                      )
                    }
                    className='w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='10.762622'
                  />
                </div>

                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Longitude
                  </label>
                  <input
                    type='number'
                    step='any'
                    value={formData.longitude}
                    onChange={(e) =>
                      handleChange(
                        'longitude',
                        e.target.value ? parseFloat(e.target.value) : '',
                      )
                    }
                    className='w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='106.660172'
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <Card className='sticky bottom-4 border-2 border-blue-500 bg-blue-50 p-4'>
            <div className='flex items-center justify-between'>
              <p className='font-medium text-gray-900'>
                Ready to create your restaurant?
              </p>
              <div className='flex gap-2'>
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className='rounded-lg border bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className='flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:opacity-50'
                >
                  <Save size={18} />
                  {isSubmitting ? 'Creating...' : 'Create Restaurant'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateRestaurant;
