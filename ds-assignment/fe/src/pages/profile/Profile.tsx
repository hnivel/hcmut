import { useEffect, useState } from 'react';
import { profileService } from '@/services/profile/profile';
import type {
  UserProfile,
  DeliveryAddress,
  PaymentMethod,
  CreateAddressDto,
  UpdateAddressDto,
} from '@/services/profile/profile.interface';
import Sidebar from '@/components/layouts/Sidebar';
import toast from 'react-hot-toast';
import {
  User,
  MapPin,
  CreditCard,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const initialAddressForm: CreateAddressDto = {
  recipientName: '',
  phone: '',
  details: '',
  longitude: 106.7017,
  latitude: 10.7756,
};

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'profile' | 'addresses' | 'payments'
  >('profile');

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Address modal state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressFormData, setAddressFormData] =
    useState<CreateAddressDto>(initialAddressForm);
  const [savingAddress, setSavingAddress] = useState(false);
  // Simple text-based address input (no Google Maps integration)

  // Payment modal state (reuse Checkout-style structure)
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [savingPayment, setSavingPayment] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState<{
    type: 'CASH' | 'E_WALLET' | 'BANK_CARD';
    provider: string;
    wallet_number: string;
    bank_name: string;
    card_number: string;
    expiry_date: string;
  }>({
    type: 'BANK_CARD',
    provider: '',
    wallet_number: '',
    bank_name: '',
    card_number: '',
    expiry_date: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([loadProfile(), loadAddresses(), loadPaymentMethods()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // No-op effect; address is entered manually now
  useEffect(() => {}, [showAddressForm]);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
      setProfile(null);
      toast.error('Unable to load profile from the server.');
    }
  };

  const loadAddresses = async () => {
    try {
      const data = await profileService.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Failed to load addresses:', error);
      setAddresses([]);
      toast.error('Unable to load delivery addresses.');
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const data = await profileService.getPaymentMethods();
      setPaymentMethods(data);
    } catch (error) {
      console.error('Failed to load payment methods:', error);
      setPaymentMethods([]);
      toast.error('Unable to load payment methods.');
    }
  };

  const handleEditProfile = () => {
    if (!profile) return;
    setEditFormData({
      name: profile.name,
      email: profile.email || '',
      phone: profile.phone || '',
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!editFormData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSavingProfile(true);
    try {
      const updated = await profileService.updateProfile({
        name: editFormData.name.trim(),
        email: editFormData.email.trim() || undefined,
        phone: editFormData.phone.trim() || undefined,
      });
      setProfile(updated);
      toast.success('Profile updated');
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Unable to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const openAddressModal = (address?: DeliveryAddress) => {
    if (address) {
      setEditingAddressId(address.address_id);
      setAddressFormData({
        recipientName: address.recipientName,
        phone: address.phone,
        details: address.details,
        longitude: Number(address.longitude),
        latitude: Number(address.latitude),
      });
    } else {
      setEditingAddressId(null);
      setAddressFormData(initialAddressForm);
    }
    setShowAddressForm(true);
  };

  const handleSaveAddress = async () => {
    if (
      !addressFormData.recipientName ||
      !addressFormData.phone ||
      !addressFormData.details
    ) {
      toast.error('Please fill in recipient name, phone, and address.');
      return;
    }
    setSavingAddress(true);
    const payload: CreateAddressDto = {
      recipientName: addressFormData.recipientName.trim(),
      phone: addressFormData.phone.trim(),
      details: addressFormData.details.trim(),
      longitude: Number(addressFormData.longitude),
      latitude: Number(addressFormData.latitude),
    };
    try {
      if (editingAddressId) {
        const updatePayload: UpdateAddressDto = { ...payload };
        await profileService.updateAddress(editingAddressId, updatePayload);
        toast.success('Address updated');
      } else {
        await profileService.addAddress(payload);
        toast.success('Address added');
      }
      await loadAddresses();
      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressFormData(initialAddressForm);
    } catch (error) {
      console.error('Failed to save address:', error);
      toast.error('Unable to save address.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Delete this address?')) return;
    try {
      await profileService.deleteAddress(addressId);
      toast.success('Address deleted');
      await loadAddresses();
    } catch (error) {
      console.error('Failed to delete address:', error);
      toast.error('Unable to delete address.');
    }
  };

  const openPaymentModal = (payment?: PaymentMethod) => {
    if (payment) {
      setEditingPaymentId(payment.payment_id);
      setPaymentFormData({
        type: payment.type,
        provider: payment.provider || '',
        wallet_number: payment.wallet_number || '',
        bank_name: payment.bank_name || '',
        card_number: payment.card_number || '',
        expiry_date: payment.expiry_date || '',
      });
    } else {
      setEditingPaymentId(null);
      setPaymentFormData({
        type: 'BANK_CARD',
        provider: '',
        wallet_number: '',
        bank_name: '',
        card_number: '',
        expiry_date: '',
      });
    }
    setShowPaymentForm(true);
  };

  const handleSavePayment = async () => {
    if (paymentFormData.type === 'E_WALLET') {
      if (!paymentFormData.provider || !paymentFormData.wallet_number) {
        toast.error('Please fill in provider and wallet number.');
        return;
      }
    }

    if (paymentFormData.type === 'BANK_CARD') {
      if (
        !paymentFormData.bank_name ||
        !paymentFormData.card_number ||
        !paymentFormData.expiry_date
      ) {
        toast.error('Please fill in bank name, card number, and expiry date.');
        return;
      }
    }

    setSavingPayment(true);
    try {
      if (editingPaymentId) {
        await profileService.updatePaymentMethod(editingPaymentId, {
          provider: paymentFormData.provider || undefined,
          wallet_number: paymentFormData.wallet_number || undefined,
          bank_name: paymentFormData.bank_name || undefined,
          card_number: paymentFormData.card_number || undefined,
          expiry_date:
            paymentFormData.type === 'BANK_CARD' && paymentFormData.expiry_date
              ? parseExpiryToISO(paymentFormData.expiry_date)
              : paymentFormData.expiry_date || undefined,
        });
        toast.success('Payment method updated');
      } else {
        await profileService.addPaymentMethod({
          type: paymentFormData.type,
          provider: paymentFormData.provider || undefined,
          wallet_number: paymentFormData.wallet_number || undefined,
          bank_name: paymentFormData.bank_name || undefined,
          card_number: paymentFormData.card_number || undefined,
          expiry_date:
            paymentFormData.type === 'BANK_CARD' && paymentFormData.expiry_date
              ? parseExpiryToISO(paymentFormData.expiry_date)
              : paymentFormData.expiry_date || undefined,
        });
        // Helper to convert MM/YY to ISO-8601 (YYYY-MM-01T00:00:00.000Z)
        function parseExpiryToISO(expiry: string): string | undefined {
          // Accept MM/YY or MM/YYYY
          const match = expiry.match(/^(\d{2})\/(\d{2,4})$/);
          if (!match) return undefined;
          let [_, mm, yy] = match;
          let year = yy.length === 2 ? `20${yy}` : yy;
          // Use first day of month
          return `${year}-${mm}-01T00:00:00.000Z`;
        }
        toast.success('Payment method added');
      }
      await loadPaymentMethods();
      setShowPaymentForm(false);
      setEditingPaymentId(null);
    } catch (error) {
      console.error('Failed to save payment method:', error);
      toast.error('Unable to save payment method.');
    } finally {
      setSavingPayment(false);
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'addresses' as const, label: 'Addresses', icon: MapPin },
    { id: 'payments' as const, label: 'Payment Methods', icon: CreditCard },
  ];

  if (loading) {
    return (
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />
        <main className='ml-64 flex-1'>
          <div className='container mx-auto px-4 py-6 text-left'>
            <div className='animate-pulse space-y-4'>
              <div className='h-8 w-1/4 rounded bg-gray-200' />
              <div className='h-64 rounded bg-gray-200' />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />
      <main className='mt-4 ml-64 flex-1'>
        <div className='container mx-auto max-w-6xl px-4 py-6'>
          <div className='mb-6 text-left'>
            <h1 className='mb-2 text-3xl font-bold text-orange-950'>
              My Profile
            </h1>
            <p className='mt-4 text-gray-600'>
              Manage your account information, addresses, and payment methods
            </p>
          </div>

          <div className='mb-6 flex gap-2 border-b'>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 font-medium transition ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'profile' && profile && (
            <Card className='p-6'>
              <div className='mb-6 flex items-center gap-4'>
                <div className='flex h-20 w-20 items-center justify-center rounded-full bg-orange-500 text-3xl font-bold text-white'>
                  {profile.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className='text-left'>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    {profile.name}
                  </h2>
                  {profile.email && (
                    <p className='text-gray-600'>{profile.email}</p>
                  )}
                  <span className='mt-1 inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700'>
                    {profile.role === 'customer'
                      ? 'Customer'
                      : profile.role === 'restaurant_owner'
                        ? 'Restaurant'
                        : profile.role === 'driver'
                          ? 'Driver'
                          : profile.role}
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='text-left'>
                  <label className='text-sm font-medium text-gray-700'>
                    Full Name
                  </label>
                  <p className='mt-1 text-gray-900'>{profile.name}</p>
                </div>
                <div className='text-left'>
                  <label className='text-sm font-medium text-gray-700'>
                    Email
                  </label>
                  <p className='mt-1 text-gray-900'>{profile.email || 'N/A'}</p>
                </div>
                <div className='text-left'>
                  <label className='text-sm font-medium text-gray-700'>
                    Phone
                  </label>
                  <p className='mt-1 text-gray-900'>{profile.phone || 'N/A'}</p>
                </div>
                <div className='text-left'>
                  <label className='text-sm font-medium text-gray-700'>
                    Member Since
                  </label>
                  <p className='mt-1 text-gray-900'>
                    {profile.registration_date &&
                    !isNaN(Date.parse(profile.registration_date))
                      ? new Date(profile.registration_date).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          },
                        )
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className='mt-6'>
                <Button
                  className='bg-orange-500 hover:bg-orange-600'
                  onClick={handleEditProfile}
                >
                  <Edit size={16} className='mr-2' />
                  Edit Profile
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'profile' && !profile && (
            <Card className='p-6 text-center'>
              <h2 className='text-lg font-semibold text-gray-800'>
                Profile data unavailable
              </h2>
              <p className='mt-2 text-sm text-gray-600'>
                We could not load your profile from the server.
              </p>
              <Button
                className='mt-4 bg-orange-500 hover:bg-orange-600'
                onClick={loadProfile}
              >
                Retry
              </Button>
            </Card>
          )}

          {activeTab === 'addresses' && (
            <div>
              <div className='mb-4 flex items-center justify-between'>
                <p className='text-gray-600'>
                  {addresses.length} saved address
                  {addresses.length !== 1 ? 'es' : ''}
                </p>
                <Button
                  className='bg-orange-500 hover:bg-orange-600'
                  onClick={() => openAddressModal()}
                >
                  <Plus size={16} className='mr-2' />
                  Add New Address
                </Button>
              </div>

              {addresses.length === 0 ? (
                <Card className='p-12 text-center'>
                  <MapPin
                    className='mx-auto mb-4 text-gray-300'
                    size={48}
                    strokeWidth={1}
                  />
                  <h3 className='mb-2 text-lg font-semibold text-gray-700'>
                    No Saved Addresses
                  </h3>
                  <p className='mb-4 text-gray-500'>
                    Add a delivery address to make checkout faster.
                  </p>
                </Card>
              ) : (
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  {addresses.map((address) => (
                    <Card key={address.address_id} className='p-4'>
                      <div className='mb-3 space-y-1'>
                        <div className='flex items-center gap-2'>
                          <label className='text-xs font-semibold text-gray-500'>
                            Recipient Name:
                          </label>
                          <span className='font-semibold text-gray-900'>
                            {address.recipientName}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <label className='text-xs font-semibold text-gray-500'>
                            Phone:
                          </label>
                          <span className='text-sm text-gray-700'>
                            {address.phone}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <label className='text-xs font-semibold text-gray-500'>
                            Address:
                          </label>
                          <span className='text-sm text-gray-700'>
                            {address.details}
                          </span>
                        </div>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => openAddressModal(address)}
                        >
                          <Edit size={14} className='mr-1' />
                          Edit
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='text-red-600 hover:text-red-700'
                          onClick={() =>
                            handleDeleteAddress(address.address_id)
                          }
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div>
              <div className='mb-4 flex items-center justify-between'>
                <p className='text-gray-600'>
                  {paymentMethods.length} payment method
                  {paymentMethods.length !== 1 ? 's' : ''} on this account
                </p>
                <Button
                  className='bg-orange-500 hover:bg-orange-600'
                  onClick={() => openPaymentModal()}
                >
                  <Plus size={16} className='mr-2' />
                  Add New Payment Method
                </Button>
              </div>

              {paymentMethods.length === 0 ? (
                <Card className='p-12 text-center'>
                  <CreditCard
                    className='mx-auto mb-4 text-gray-300'
                    size={48}
                    strokeWidth={1}
                  />
                  <h3 className='mb-2 text-lg font-semibold text-gray-700'>
                    No Payment Methods Found
                  </h3>
                  <p className='mb-4 text-gray-500'>
                    Add payment methods like Cash, E-Wallet, or Bank Card.
                  </p>
                </Card>
              ) : (
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  {paymentMethods.map((payment) => (
                    <Card key={payment.payment_id} className='p-4'>
                      <div className='flex items-start justify-between'>
                        <div className='text-left'>
                          <h3 className='font-semibold text-gray-900'>
                            {payment.type === 'CASH'
                              ? 'Cash on Delivery'
                              : payment.type === 'E_WALLET'
                                ? `${payment.provider || 'E-Wallet'}`
                                : payment.bank_name || 'Bank Card'}
                          </h3>
                          {payment.type === 'E_WALLET' && (
                            <div className='flex items-center gap-2'>
                              <label className='text-xs font-semibold text-gray-500'>
                                Wallet:
                              </label>
                              <span className='text-sm text-gray-700'>
                                {payment.wallet_number || 'N/A'}
                              </span>
                            </div>
                          )}
                          {payment.type === 'BANK_CARD' && (
                            <div className='flex items-center gap-2'>
                              <label className='text-xs font-semibold text-gray-500'>
                                Card:
                              </label>
                              <span className='text-sm text-gray-700'>
                                {payment.card_number || 'N/A'}
                              </span>
                              {payment.expiry_date && (
                                <span className='text-xs text-gray-500'>
                                  Expiry Date: {payment.expiry_date}
                                </span>
                              )}
                            </div>
                          )}
                          <p className='mt-1 text-xs text-gray-500'>
                            ID: {payment.payment_id}
                          </p>
                        </div>
                        <div className='flex gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => openPaymentModal(payment)}
                          >
                            <Edit size={14} className='mr-1' />
                            Edit
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            className='text-red-600 hover:text-red-700'
                            onClick={async () => {
                              if (!confirm('Delete this payment method?')) {
                                return;
                              }
                              try {
                                await profileService.deletePaymentMethod(
                                  payment.payment_id,
                                );
                                toast.success('Payment method deleted');
                                await loadPaymentMethods();
                              } catch (error) {
                                console.error(
                                  'Failed to delete payment method:',
                                  error,
                                );
                                toast.error('Unable to delete payment method.');
                              }
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {isEditingProfile && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <Card className='w-full max-w-md'>
            <div className='flex items-center justify-between border-b p-4'>
              <h2 className='text-xl font-bold text-gray-900'>Edit Profile</h2>
              <button
                onClick={() => setIsEditingProfile(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                <X size={24} />
              </button>
            </div>

            <div className='p-4'>
              <div className='space-y-4'>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Full Name *
                  </label>
                  <input
                    type='text'
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className='w-full rounded-lg border px-3 py-2 focus:border-orange-500 focus:outline-none'
                    placeholder='Enter your full name'
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Email
                  </label>
                  <input
                    type='email'
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                    className='w-full rounded-lg border px-3 py-2 focus:border-orange-500 focus:outline-none'
                    placeholder='Enter your email'
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        phone: e.target.value,
                      })
                    }
                    className='w-full rounded-lg border px-3 py-2 focus:border-orange-500 focus:outline-none'
                    placeholder='Enter your phone number'
                  />
                </div>
              </div>

              <div className='mt-6 flex gap-2'>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className='flex-1 rounded-lg border px-4 py-2 font-medium text-gray-700 hover:bg-gray-50'
                  disabled={savingProfile}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600'
                  disabled={!editFormData.name.trim() || savingProfile}
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showAddressForm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <Card className='max-h-[90vh] w-full max-w-md overflow-y-auto'>
            <div className='flex items-center justify-between border-b p-4'>
              <h2 className='text-xl font-bold text-gray-900'>
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button
                onClick={() => {
                  setShowAddressForm(false);
                  setEditingAddressId(null);
                  setAddressFormData(initialAddressForm);
                }}
                className='text-gray-500 hover:text-gray-700'
              >
                <X size={24} />
              </button>
            </div>

            <div className='p-4'>
              <div className='space-y-4'>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Recipient Name *
                  </label>
                  <input
                    type='text'
                    value={addressFormData.recipientName}
                    onChange={(e) =>
                      setAddressFormData({
                        ...addressFormData,
                        recipientName: e.target.value,
                      })
                    }
                    className='w-full rounded-lg border px-3 py-2 focus:border-orange-500 focus:outline-none'
                    placeholder='Full name of recipient'
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Phone Number *
                  </label>
                  <input
                    type='tel'
                    value={addressFormData.phone}
                    onChange={(e) =>
                      setAddressFormData({
                        ...addressFormData,
                        phone: e.target.value,
                      })
                    }
                    className='w-full rounded-lg border px-3 py-2 focus:border-orange-500 focus:outline-none'
                    placeholder='Contact phone number'
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Address *
                  </label>
                  <input
                    type='text'
                    value={addressFormData.details}
                    onChange={(e) =>
                      setAddressFormData({
                        ...addressFormData,
                        details: e.target.value,
                      })
                    }
                    className='w-full rounded-lg border px-3 py-2 focus:border-orange-500 focus:outline-none'
                    placeholder='Search or enter address'
                  />
                  <p className='mt-1 text-xs text-gray-500'>
                    Enter your full delivery address
                  </p>
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Latitude
                    </label>
                    <input
                      type='number'
                      value={addressFormData.latitude}
                      onChange={(e) =>
                        setAddressFormData({
                          ...addressFormData,
                          latitude: Number(e.target.value),
                        })
                      }
                      className='w-full rounded-lg border px-3 py-2 focus:border-orange-500 focus:outline-none'
                      step='0.000001'
                    />
                  </div>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Longitude
                    </label>
                    <input
                      type='number'
                      value={addressFormData.longitude}
                      onChange={(e) =>
                        setAddressFormData({
                          ...addressFormData,
                          longitude: Number(e.target.value),
                        })
                      }
                      className='w-full rounded-lg border px-3 py-2 focus:border-orange-500 focus:outline-none'
                      step='0.000001'
                    />
                  </div>
                </div>
              </div>

              <div className='mt-6 flex gap-2'>
                <button
                  onClick={() => {
                    setShowAddressForm(false);
                    setEditingAddressId(null);
                    setAddressFormData(initialAddressForm);
                  }}
                  className='flex-1 rounded-lg border px-4 py-2 font-medium text-gray-700 hover:bg-gray-50'
                  disabled={savingAddress}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAddress}
                  className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600'
                  disabled={savingAddress}
                >
                  <Save size={18} />
                  {editingAddressId ? 'Update' : 'Add'} Address
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showPaymentForm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <Card className='max-h-[90vh] w-full max-w-md overflow-y-auto'>
            <div className='flex items-center justify-between border-b p-4'>
              <h2 className='text-xl font-bold text-gray-900'>
                {editingPaymentId
                  ? 'Edit Payment Method'
                  : 'Add New Payment Method'}
              </h2>
              <button
                onClick={() => {
                  setShowPaymentForm(false);
                  setEditingPaymentId(null);
                }}
                className='text-gray-500 hover:text-gray-700'
              >
                <X size={24} />
              </button>
            </div>

            <div className='p-4'>
              <div className='space-y-4'>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Payment Type *
                  </label>
                  <select
                    value={paymentFormData.type}
                    onChange={(e) =>
                      setPaymentFormData({
                        ...paymentFormData,
                        type: e.target.value as
                          | 'CASH'
                          | 'E_WALLET'
                          | 'BANK_CARD',
                      })
                    }
                    className='w-full rounded-lg border px-3 py-2 focus:border-orange-500 focus:outline-none'
                  >
                    <option value='CASH'>Cash on Delivery</option>
                    <option value='E_WALLET'>E-Wallet</option>
                    <option value='BANK_CARD'>Bank Card</option>
                  </select>
                </div>

                {paymentFormData.type === 'E_WALLET' && (
                  <>
                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>
                        Provider *
                      </label>
                      <input
                        type='text'
                        value={paymentFormData.provider}
                        onChange={(e) =>
                          setPaymentFormData({
                            ...paymentFormData,
                            provider: e.target.value,
                          })
                        }
                        className='w-full rounded-lg border px-3 py-2 focus:border-orange-500 focus:outline-none'
                        placeholder='e.g. MoMo, ZaloPay'
                      />
                    </div>
                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>
                        Wallet Number *
                      </label>
                      <input
                        type='text'
                        value={paymentFormData.wallet_number}
                        onChange={(e) =>
                          setPaymentFormData({
                            ...paymentFormData,
                            wallet_number: e.target.value,
                          })
                        }
                        className='w-full rounded-lg border px-3 py-2 focus:border-orange-500 focus:outline-none'
                        placeholder='Enter wallet number'
                      />
                    </div>
                  </>
                )}

                {paymentFormData.type === 'BANK_CARD' && (
                  <>
                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>
                        Bank Name *
                      </label>
                      <input
                        type='text'
                        value={paymentFormData.bank_name}
                        onChange={(e) =>
                          setPaymentFormData({
                            ...paymentFormData,
                            bank_name: e.target.value,
                          })
                        }
                        className='w-full rounded-lg border px-3 py-2 focus:border-orange-500 focus:outline-none'
                        placeholder='Enter bank name'
                      />
                    </div>
                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>
                        Card Number *
                      </label>
                      <input
                        type='text'
                        value={paymentFormData.card_number}
                        onChange={(e) =>
                          setPaymentFormData({
                            ...paymentFormData,
                            card_number: e.target.value,
                          })
                        }
                        className='w-full rounded-lg border px-3 py-2 focus:border-orange-500 focus:outline-none'
                        placeholder='XXXX-XXXX-XXXX-XXXX'
                      />
                    </div>
                    <div>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>
                        Expiry Date *
                      </label>
                      <input
                        type='text'
                        value={paymentFormData.expiry_date}
                        onChange={(e) =>
                          setPaymentFormData({
                            ...paymentFormData,
                            expiry_date: e.target.value,
                          })
                        }
                        className='w-full rounded-lg border px-3 py-2 focus:border-orange-500 focus:outline-none'
                        placeholder='MM/YY'
                      />
                    </div>
                  </>
                )}

                {paymentFormData.type === 'CASH' && (
                  <p className='text-sm text-gray-600'>
                    You will pay with cash when your order is delivered.
                  </p>
                )}
              </div>

              <div className='mt-6 flex gap-2'>
                <button
                  onClick={() => {
                    setShowPaymentForm(false);
                    setEditingPaymentId(null);
                  }}
                  className='flex-1 rounded-lg border px-4 py-2 font-medium text-gray-700 hover:bg-gray-50'
                  disabled={savingPayment}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePayment}
                  className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600'
                  disabled={savingPayment}
                >
                  <Save size={18} />
                  {editingPaymentId ? 'Update' : 'Add'} Payment Method
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
