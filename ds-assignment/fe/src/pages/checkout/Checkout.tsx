import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '@/services/orders/order.tsx';
import type { OrderWithDetails } from '@/services/orders/order.interface';
import { profileService } from '@/services/profile/profile.tsx';
import Sidebar from '@/components/layouts/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  MapPin,
  CreditCard,
  Tag,
  Plus,
  Check,
  X,
  Trash2,
  ShoppingBag,
  Wallet,
  User,
  Phone,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Address {
  address_id: string;
  customer_id: string;
  recipientName: string;
  phone: string;
  longitude: number;
  latitude: number;
  details: string;
}

interface PaymentMethod {
  payment_id: string;
  customer_id: string;
  type: 'CASH' | 'E_WALLET' | 'BANK_CARD';
  // Reference ID to the specific payment type table
  type_reference_id?: string; // cash_id, e_wallet_id, or bank_card_id
  // For UI display only - fetched from related tables
  provider?: string; // e_wallet
  wallet_number?: string; // e_wallet
  bank_name?: string; // bank_card
  card_number?: string; // bank_card
  expiry_date?: string; // bank_card
}

interface Promotion {
  id: string;
  code: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minOrder?: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: '',
    phone: '',
    details: '',
    longitude: 106.7017, // Default to HCM city center
    latitude: 10.7756,
  });

  // Payment Methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null,
  );
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    type: 'BANK_CARD' as 'CASH' | 'E_WALLET' | 'BANK_CARD',
    // E-Wallet fields
    provider: '',
    wallet_number: '',
    // Bank Card fields
    bank_name: '',
    card_number: '',
    expiry_date: '',
  });

  // Promotions
  const [availablePromotions] = useState<Promotion[]>([
    {
      id: '1',
      code: 'WELCOME10',
      description: '10% off for new customers',
      discount: 10,
      type: 'percentage',
      minOrder: 50000,
    },
    {
      id: '2',
      code: 'SAVE20K',
      description: '₫20,000 off orders above ₫100,000',
      discount: 20000,
      type: 'fixed',
      minOrder: 100000,
    },
    {
      id: '3',
      code: 'FREESHIP',
      description: 'Free delivery',
      discount: 15000,
      type: 'fixed',
      minOrder: 0,
    },
  ]);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null,
  );
  const [promoCode, setPromoCode] = useState('');

  // Preview delivery fee between 10 and 20 (same unit as backend)
  const [previewDeliveryFee] = useState(() => {
    const min = 10;
    const max = 20;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  });

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await profileService.getAddresses();
      const mapped: Address[] = data.map((addr: any) => ({
        address_id: addr.address_id,
        customer_id: addr.customer_id,
        recipientName: addr.recipient_name,
        phone: addr.phone,
        longitude: Number(addr.longitude),
        latitude: Number(addr.latitude),
        details: addr.details,
      }));
      setAddresses(mapped);
      if (mapped.length > 0) {
        setSelectedAddressId(mapped[0].address_id);
      }
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
      if (data.length > 0) {
        setSelectedPaymentId(data[0].payment_id);
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
      setPaymentMethods([]);
      toast.error('Unable to load payment methods.');
    }
  };

  const loadCheckoutData = async () => {
    try {
      setLoading(true);
      const cartData = await orderService.getCart();
      console.log('Cart data loaded:', cartData);
      setCart(cartData);

      // Load addresses and payment methods from API
      await Promise.all([loadAddresses(), loadPaymentMethods()]);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleAddAddress = async () => {
    if (!newAddress.recipientName || !newAddress.phone || !newAddress.details) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      const created = await profileService.addAddress({
        recipientName: newAddress.recipientName.trim(),
        phone: newAddress.phone.trim(),
        details: newAddress.details.trim(),
        longitude: Number(newAddress.longitude) || 106.7017,
        latitude: Number(newAddress.latitude) || 10.7756,
      });
      const updated = [...addresses, created];
      setAddresses(updated);
      setSelectedAddressId(created.address_id);
      setNewAddress({
        recipientName: '',
        phone: '',
        details: '',
        longitude: 106.7017,
        latitude: 10.7756,
      });
      setShowAddressForm(false);
      toast.success('Address added successfully');
    } catch (error) {
      console.error('Failed to add address:', error);
      toast.error('Failed to add address. Please try again.');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await profileService.deleteAddress(id);
      const updated = addresses.filter((a) => a.address_id !== id);
      setAddresses(updated);
      if (selectedAddressId === id && updated.length > 0) {
        setSelectedAddressId(updated[0].address_id);
      }
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Failed to delete address:', error);
      toast.error('Failed to delete address. Please try again.');
    }
  };

  const handleAddPayment = async () => {
    // Validate based on payment type
    if (
      newPayment.type === 'E_WALLET' &&
      (!newPayment.provider || !newPayment.wallet_number)
    ) {
      alert('Please fill in all required fields');
      return;
    }
    if (
      newPayment.type === 'BANK_CARD' &&
      (!newPayment.bank_name ||
        !newPayment.card_number ||
        !newPayment.expiry_date)
    ) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const created = await profileService.addPaymentMethod({
        type: newPayment.type,
        provider:
          newPayment.type === 'E_WALLET'
            ? newPayment.provider || undefined
            : undefined,
        wallet_number:
          newPayment.type === 'E_WALLET'
            ? newPayment.wallet_number || undefined
            : undefined,
        bank_name:
          newPayment.type === 'BANK_CARD'
            ? newPayment.bank_name || undefined
            : undefined,
        card_number:
          newPayment.type === 'BANK_CARD'
            ? newPayment.card_number || undefined
            : undefined,
        expiry_date:
          newPayment.type === 'BANK_CARD'
            ? newPayment.expiry_date || undefined
            : undefined,
      });

      const updated = [...paymentMethods, created];
      setPaymentMethods(updated);
      setSelectedPaymentId(created.payment_id);
      setNewPayment({
        type: 'BANK_CARD',
        provider: '',
        wallet_number: '',
        bank_name: '',
        card_number: '',
        expiry_date: '',
      });
      setShowPaymentForm(false);
      toast.success('Payment method added successfully');
    } catch (error) {
      console.error('Failed to add payment method:', error);
      toast.error('Failed to add payment method. Please try again.');
    }
  };

  const handleDeletePayment = async (id: string) => {
    try {
      await profileService.deletePaymentMethod(id);
      const updated = paymentMethods.filter((p) => p.payment_id !== id);
      setPaymentMethods(updated);
      if (selectedPaymentId === id && updated.length > 0) {
        setSelectedPaymentId(updated[0].payment_id);
      }
      toast.success('Payment method deleted successfully');
    } catch (error) {
      console.error('Failed to delete payment method:', error);
      toast.error('Failed to delete payment method. Please try again.');
    }
  };

  const handleApplyPromotion = () => {
    const promo = availablePromotions.find(
      (p) => p.code.toLowerCase() === promoCode.toLowerCase(),
    );
    if (promo) {
      const subtotal = cart?.subtotal || 0;
      if (promo.minOrder && subtotal < promo.minOrder) {
        alert(`Minimum order value is ${formatPrice(promo.minOrder)}`);
        return;
      }
      setSelectedPromotion(promo);
      setPromoCode('');
    } else {
      alert('Invalid promotion code');
    }
  };

  const calculateDiscount = () => {
    if (!selectedPromotion) return 0;
    const subtotal = cart?.subtotal || 0;
    if (selectedPromotion.type === 'percentage') {
      return (subtotal * selectedPromotion.discount) / 100;
    }
    return selectedPromotion.discount;
  };

  const calculateTotal = () => {
    const subtotal = cart?.subtotal || 0;
    const delivery = previewDeliveryFee;
    const discount = calculateDiscount();
    return Math.max(0, subtotal + delivery - discount);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }
    if (!selectedPaymentId) {
      toast.error('Please select a payment method');
      return;
    }

    try {
      setLoading(true);

      // Call checkout API to convert cart (IN_CART) to placed order
      const order = await orderService.checkout(
        selectedAddressId,
        selectedPaymentId,
      );

      toast.success(`Order placed successfully! Order ID: ${order.order_id}`);

      // Navigate to orders page
      navigate('/orders');
    } catch (error: any) {
      console.error('Failed to place order:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Failed to place order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItemNote = async (itemId: string, note: string) => {
    if (!cart) return;

    try {
      await orderService.updateCartItem(itemId, { note });

      setCart({
        ...cart,
        items: cart.items?.map((item) =>
          item.item_id === itemId ? { ...item, note } : item,
        ),
      });
    } catch (error) {
      console.error('Failed to update item note:', error);
      toast.error('Failed to update item note. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />
        <main className='ml-64 flex-1'>
          <div className='container mx-auto max-w-7xl px-4 py-6 text-left'>
            <div className='animate-pulse space-y-4'>
              <div className='h-8 w-1/3 rounded bg-gray-200' />
              <div className='h-64 rounded-lg bg-gray-200' />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />

      <main className='ml-64 flex-1 pb-8'>
        <div className='container mx-auto max-w-6xl px-4 py-6 text-left'>
          {/* Header */}
          <div className='mb-6'>
            <h1 className='mb-2 text-3xl font-bold text-gray-900'>Checkout</h1>
            <p className='text-gray-600'>Complete your order</p>
          </div>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* Left Column - Order Details */}
            <div className='space-y-6 lg:col-span-2'>
              {/* Delivery Address */}
              <Card className='p-6'>
                <div className='mb-4 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <MapPin className='text-orange-500' size={24} />
                    <h2 className='text-xl font-bold'>Delivery Address</h2>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setShowAddressForm(!showAddressForm)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>

                {showAddressForm && (
                  <div className='mb-4 rounded-lg border bg-gray-50 p-4'>
                    <input
                      type='text'
                      placeholder='Recipient Name'
                      value={newAddress.recipientName}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          recipientName: e.target.value,
                        })
                      }
                      className='mb-2 w-full rounded-lg border p-2'
                    />
                    <input
                      type='tel'
                      placeholder='Phone Number (e.g., 0901234567)'
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          phone: e.target.value,
                        })
                      }
                      className='mb-2 w-full rounded-lg border p-2'
                    />

                    {/* Google Maps Embedded with Search */}
                    <div className='mb-2 rounded-lg border bg-white p-4'>
                      <div className='mb-3'>
                        <label className='mb-2 block text-left text-sm font-medium text-gray-700'>
                          Your Location on Google Maps
                        </label>
                        <p className='mb-3 text-left text-sm text-gray-600'>
                          Search for your address in the map below.
                        </p>

                        {/* Embedded Google Maps with Search */}
                        <div className='overflow-hidden rounded-lg border-2 border-gray-300'>
                          <iframe
                            width='100%'
                            height='450'
                            frameBorder='0'
                            style={{ border: 0 }}
                            referrerPolicy='no-referrer-when-downgrade'
                            src={`https://www.google.com/maps/embed/v1/place?key=<GOOGLE_API_KEY>&q=${encodeURIComponent(newAddress.details || 'Ho Chi Minh City, Vietnam')}&zoom=15`}
                            allowFullScreen
                            title='Google Maps Location Picker'
                          />
                        </div>
                      </div>

                      {/* Manual Coordinate Input */}
                      <div className='mt-4 space-y-2'>
                        <textarea
                          placeholder='Full Address (e.g., 136/48 Trần Quang Diệu, Phường 6, Quận 3, TP.HCM)'
                          value={newAddress.details}
                          onChange={(e) => {
                            const value = e.target.value;
                            setNewAddress({
                              ...newAddress,
                              details: value,
                            });
                          }}
                          className='w-full rounded-lg border p-2'
                          rows={2}
                        />

                        <div className='grid grid-cols-2 gap-2'>
                          <input
                            type='number'
                            step='any'
                            placeholder='Latitude (e.g., 10.7769)'
                            value={newAddress.latitude || ''}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                latitude: parseFloat(e.target.value) || 0,
                              })
                            }
                            className='w-full rounded-lg border p-2'
                          />
                          <input
                            type='number'
                            step='any'
                            placeholder='Longitude (e.g., 106.6959)'
                            value={newAddress.longitude || ''}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                longitude: parseFloat(e.target.value) || 0,
                              })
                            }
                            className='w-full rounded-lg border p-2'
                          />
                        </div>
                      </div>

                      {/* Selected Location Preview */}
                      {newAddress.details &&
                        newAddress.latitude !== 0 &&
                        newAddress.longitude !== 0 && (
                          <div className='mt-3 rounded-lg bg-green-50 p-3'>
                            <div className='flex items-start gap-2'>
                              <Check
                                className='mt-0.5 text-green-600'
                                size={20}
                              />
                              <div className='flex-1'>
                                <p className='mt-1 text-sm text-green-700'>
                                  {newAddress.details}
                                </p>
                                <p className='mt-1 text-xs text-green-600'>
                                  {newAddress.latitude.toFixed(6)},{' '}
                                  {newAddress.longitude.toFixed(6)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>

                    <div className='flex gap-2'>
                      <Button size='sm' onClick={handleAddAddress}>
                        Save
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setShowAddressForm(false);
                          setNewAddress({
                            recipientName: '',
                            phone: '',
                            details: '',
                            longitude: 106.7017,
                            latitude: 10.7756,
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className='space-y-3'>
                  {addresses.map((addr) => (
                    <div
                      key={addr.address_id}
                      onClick={() => setSelectedAddressId(addr.address_id)}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition ${
                        selectedAddressId === addr.address_id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className='flex items-start justify-between'>
                        <div className='flex-1 space-y-2'>
                          {/* Recipient Name */}
                          <div className='flex items-center gap-2'>
                            <User
                              className='flex-shrink-0 text-gray-600'
                              size={16}
                            />
                            <span className='text-sm font-medium text-gray-500'>
                              Recipient:
                            </span>
                            <span className='font-semibold text-gray-900'>
                              {addr.recipientName}
                            </span>
                            {selectedAddressId === addr.address_id && (
                              <Check
                                className='ml-auto text-orange-500'
                                size={20}
                              />
                            )}
                          </div>

                          {/* Phone */}
                          <div className='flex items-center gap-2'>
                            <Phone
                              className='flex-shrink-0 text-gray-600'
                              size={16}
                            />
                            <span className='text-sm font-medium text-gray-500'>
                              Phone:
                            </span>
                            <span className='text-sm text-gray-900'>
                              {addr.phone}
                            </span>
                          </div>

                          {/* Address */}
                          <div className='flex items-start gap-2'>
                            <MapPin
                              className='mt-0.5 flex-shrink-0 text-gray-600'
                              size={16}
                            />
                            <span className='text-sm font-medium text-gray-500'>
                              Address:
                            </span>
                            <span className='text-sm text-gray-900'>
                              {addr.details}
                            </span>
                          </div>

                          {/* Coordinates */}
                          {addr.longitude != null &&
                            addr.latitude != null &&
                            (addr.longitude !== 0 || addr.latitude !== 0) && (
                              <div className='flex items-center gap-2'>
                                <MapPin
                                  className='flex-shrink-0 text-gray-600'
                                  size={16}
                                />
                                <span className='text-sm font-medium text-gray-500'>
                                  Coordinates:
                                </span>
                                <span className='text-sm text-gray-700'>
                                  {addr.latitude.toFixed(6)},{' '}
                                  {addr.longitude.toFixed(6)}
                                </span>
                              </div>
                            )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(addr.address_id);
                          }}
                          className='ml-4 flex-shrink-0 text-red-500 hover:text-red-700'
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Payment Method */}
              <Card className='p-6'>
                <div className='mb-4 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <CreditCard className='text-orange-500' size={24} />
                    <h2 className='text-xl font-bold'>Payment Method</h2>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setShowPaymentForm(!showPaymentForm)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>

                {showPaymentForm && (
                  <div className='mb-4 rounded-lg border bg-gray-50 p-4'>
                    <select
                      value={newPayment.type}
                      onChange={(e) =>
                        setNewPayment({
                          ...newPayment,
                          type: e.target.value as
                            | 'CASH'
                            | 'E_WALLET'
                            | 'BANK_CARD',
                        })
                      }
                      className='mb-2 w-full rounded-lg border p-2'
                    >
                      <option value='BANK_CARD'>Credit/Debit Card</option>
                      <option value='E_WALLET'>E-Wallet</option>
                      <option value='CASH'>Cash on Delivery</option>
                    </select>

                    {newPayment.type === 'BANK_CARD' && (
                      <>
                        <input
                          type='text'
                          placeholder='Bank Name'
                          value={newPayment.bank_name}
                          onChange={(e) =>
                            setNewPayment({
                              ...newPayment,
                              bank_name: e.target.value,
                            })
                          }
                          className='mb-2 w-full rounded-lg border p-2'
                        />
                        <input
                          type='text'
                          placeholder='Card Number'
                          value={newPayment.card_number}
                          onChange={(e) =>
                            setNewPayment({
                              ...newPayment,
                              card_number: e.target.value,
                            })
                          }
                          className='mb-2 w-full rounded-lg border p-2'
                        />
                        <input
                          type='text'
                          placeholder='Expiry Date (MM/YY)'
                          value={newPayment.expiry_date}
                          onChange={(e) =>
                            setNewPayment({
                              ...newPayment,
                              expiry_date: e.target.value,
                            })
                          }
                          className='mb-2 w-full rounded-lg border p-2'
                        />
                      </>
                    )}

                    {newPayment.type === 'E_WALLET' && (
                      <>
                        <input
                          type='text'
                          placeholder='Provider (e.g., MoMo, ZaloPay)'
                          value={newPayment.provider}
                          onChange={(e) =>
                            setNewPayment({
                              ...newPayment,
                              provider: e.target.value,
                            })
                          }
                          className='mb-2 w-full rounded-lg border p-2'
                        />
                        <input
                          type='text'
                          placeholder='Wallet Number/Phone'
                          value={newPayment.wallet_number}
                          onChange={(e) =>
                            setNewPayment({
                              ...newPayment,
                              wallet_number: e.target.value,
                            })
                          }
                          className='mb-2 w-full rounded-lg border p-2'
                        />
                      </>
                    )}

                    <div className='flex gap-2'>
                      <Button size='sm' onClick={handleAddPayment}>
                        Save
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setShowPaymentForm(false);
                          setNewPayment({
                            type: 'BANK_CARD',
                            provider: '',
                            wallet_number: '',
                            bank_name: '',
                            card_number: '',
                            expiry_date: '',
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className='space-y-3'>
                  {paymentMethods.map((payment) => (
                    <div
                      key={payment.payment_id}
                      onClick={() => setSelectedPaymentId(payment.payment_id)}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition ${
                        selectedPaymentId === payment.payment_id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          {payment.type === 'CASH' ? (
                            <Wallet className='text-green-600' size={24} />
                          ) : (
                            <CreditCard className='text-purple-600' size={24} />
                          )}
                          <div>
                            <div className='flex items-center gap-2'>
                              <span className='font-semibold'>
                                {payment.type === 'CASH'
                                  ? 'Cash on Delivery'
                                  : payment.type === 'E_WALLET'
                                    ? `${payment.provider} E-Wallet`
                                    : `${payment.bank_name} Card`}
                              </span>
                              {selectedPaymentId === payment.payment_id && (
                                <Check className='text-orange-500' size={20} />
                              )}
                            </div>
                            {payment.type === 'E_WALLET' &&
                              payment.provider && (
                                <p className='text-sm text-gray-500'>
                                  {payment.provider} - {payment.wallet_number}
                                </p>
                              )}
                            {payment.type === 'BANK_CARD' &&
                              payment.bank_name && (
                                <p className='text-sm text-gray-500'>
                                  {payment.bank_name} - {payment.card_number}
                                </p>
                              )}
                          </div>
                        </div>
                        {payment.payment_id !== '1' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePayment(payment.payment_id);
                            }}
                            className='text-red-500 hover:text-red-700'
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Promotions */}
              <Card className='p-6'>
                <div className='mb-4 flex items-center gap-2'>
                  <Tag className='text-orange-500' size={24} />
                  <h2 className='text-xl font-bold'>Promotions</h2>
                </div>

                <div className='mb-4 flex gap-2'>
                  <input
                    type='text'
                    placeholder='Enter promotion code'
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className='flex-1 rounded-lg border p-2'
                  />
                  <Button
                    onClick={handleApplyPromotion}
                    className='bg-orange-500 hover:bg-orange-600'
                  >
                    Apply
                  </Button>
                </div>

                {selectedPromotion && (
                  <div className='mb-4 rounded-lg border-2 border-orange-500 bg-orange-50 p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-left font-semibold text-orange-800'>
                          {selectedPromotion.code}
                        </p>
                        <p className='text-sm text-orange-700'>
                          {selectedPromotion.description}
                        </p>
                        <p className='mt-1 text-left text-sm font-medium text-orange-800'>
                          Discount: {formatPrice(calculateDiscount())}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedPromotion(null)}
                        className='text-orange-700 hover:text-orange-900'
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                )}

                <div className='space-y-2'>
                  <p className='text-sm font-medium text-gray-700'>
                    Available Promotions:
                  </p>
                  {availablePromotions.map((promo) => (
                    <div
                      key={promo.id}
                      onClick={() => {
                        setPromoCode(promo.code);
                        handleApplyPromotion();
                      }}
                      className='cursor-pointer rounded-lg border bg-white p-3 hover:border-orange-500 hover:bg-orange-50'
                    >
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-left font-medium text-orange-600'>
                            {promo.code}
                          </p>
                          <p className='text-left text-sm text-gray-600'>
                            {promo.description}
                          </p>
                        </div>
                        <Button
                          variant='outline'
                          size='sm'
                          className='border-orange-500 text-orange-600 hover:bg-orange-50'
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className='lg:col-span-1'>
              <Card className='sticky top-6 p-6'>
                <h2 className='mb-4 text-xl font-bold'>Order Summary</h2>

                <div className='mb-4 space-y-3'>
                  {cart.items.map((item) => (
                    <div
                      key={item.item_id}
                      className='flex flex-col gap-1 text-sm'
                    >
                      <div className='flex justify-between gap-2'>
                        <div className='flex-1'>
                          <p className='text-left font-medium'>
                            {item.item_name}
                          </p>
                          <p className='text-left text-gray-500'>
                            {formatPrice(item.price || 0)} × {item.quantity}
                          </p>
                        </div>
                        <p className='font-medium whitespace-nowrap'>
                          {formatPrice((item.price || 0) * item.quantity)}
                        </p>
                      </div>

                      <textarea
                        className='mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none'
                        placeholder='Add a note for this item (e.g. no onions, extra spicy)'
                        value={item.note || ''}
                        onChange={(e) =>
                          handleUpdateItemNote(item.item_id, e.target.value)
                        }
                        rows={2}
                      />
                    </div>
                  ))}
                </div>

                <div className='space-y-2 border-t pt-4'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Subtotal</span>
                    <span>{formatPrice(cart.subtotal || 0)}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Delivery Fee</span>
                    <span>{formatPrice(previewDeliveryFee)}</span>
                  </div>
                  {selectedPromotion && (
                    <div className='flex justify-between text-sm text-green-600'>
                      <span>Discount ({selectedPromotion.code})</span>
                      <span>-{formatPrice(calculateDiscount())}</span>
                    </div>
                  )}
                  <div className='flex justify-between border-t pt-2'>
                    <span className='text-lg font-bold'>Total</span>
                    <span className='text-2xl font-bold text-orange-600'>
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>

                <Button
                  className='mt-6 w-full bg-orange-500 hover:bg-orange-600'
                  size='lg'
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddressId || !selectedPaymentId}
                >
                  Place Order
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
