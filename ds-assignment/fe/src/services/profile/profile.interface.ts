export interface DeliveryAddress {
  address_id: string;
  customer_id: string;
  recipientName: string;
  phone: string;
  longitude: number;
  latitude: number;
  details: string;
}

export interface PaymentMethod {
  payment_id: string;
  customer_id: string;
  type: 'E_WALLET' | 'BANK_CARD' | 'CASH';
  provider?: string;
  wallet_number?: string;
  bank_name?: string;
  card_number?: string;
  expiry_date?: string;
}

export interface CreateAddressDto {
  recipientName: string;
  phone: string;
  longitude: number;
  latitude: number;
  details: string;
}

export interface UpdateAddressDto {
  recipientName?: string;
  phone?: string;
  longitude?: number;
  latitude?: number;
  details?: string;
}

export interface CreatePaymentMethodDto {
  type: 'E_WALLET' | 'BANK_CARD' | 'CASH';
  provider?: string;
  wallet_number?: string;
  bank_name?: string;
  card_number?: string;
  expiry_date?: string;
}

export interface UpdatePaymentMethodDto {
  provider?: string;
  wallet_number?: string;
  bank_name?: string;
  card_number?: string;
  expiry_date?: string;
}

export interface UserProfile {
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  registration_date: string;
  avatar_url?: string;
}

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
}
