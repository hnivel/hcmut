import api from '../api';
import type {
  DeliveryAddress,
  PaymentMethod,
  UserProfile,
  CreateAddressDto,
  UpdateAddressDto,
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
  UpdateProfileDto,
} from './profile.interface';

export const profileService = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get<UserProfile>('/users');
    if (!response.data.name) {
      response.data.name =
        response.data.firstName + ' ' + response.data.lastName;
    }
    return response.data;
  },

  // Update profile
  updateProfile: async (data: UpdateProfileDto) => {
    const response = await api.patch<UserProfile>('/users', data);
    return response.data;
  },

  // Get all delivery addresses
  getAddresses: async () => {
    const response = await api.get<DeliveryAddress[]>('/addresses');
    return response.data;
  },

  // Get address by ID
  getAddressById: async (addressId: string) => {
    const response = await api.get<DeliveryAddress>(`/addresses/${addressId}`);
    return response.data;
  },

  // Add delivery address
  addAddress: async (data: CreateAddressDto) => {
    const response = await api.post<DeliveryAddress>('/addresses', data);
    return response.data;
  },

  // Update delivery address
  updateAddress: async (addressId: string, data: UpdateAddressDto) => {
    const response = await api.patch<DeliveryAddress>(
      `/addresses/${addressId}`,
      data,
    );
    return response.data;
  },

  // Delete delivery address
  deleteAddress: async (addressId: string) => {
    const response = await api.delete(`/addresses/${addressId}`);
    return response.data;
  },

  // Get payment methods
  getPaymentMethods: async () => {
    const response = await api.get<PaymentMethod[]>('/users/payment-methods');
    return response.data;
  },

  // Get payment method by ID
  getPaymentMethodById: async (paymentId: string) => {
    const response = await api.get<PaymentMethod>(
      `/profile/payment-methods/${paymentId}`,
    );
    return response.data;
  },

  // Add payment method
  addPaymentMethod: async (data: CreatePaymentMethodDto) => {
    const response = await api.post<PaymentMethod>(
      '/users/payment-methods',
      data,
    );
    return response.data;
  },

  // Update payment method
  updatePaymentMethod: async (
    paymentId: string,
    data: UpdatePaymentMethodDto,
  ) => {
    const response = await api.put<PaymentMethod>(
      `/profile/payment-methods/${paymentId}`,
      data,
    );
    return response.data;
  },

  // Delete payment method
  deletePaymentMethod: async (paymentId: string) => {
    const response = await api.delete(`/users/payment-methods/${paymentId}`);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/profile/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};
