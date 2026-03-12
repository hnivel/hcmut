import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useSignIn } from '@/hooks/auth/useSignIn';
import { useSignUp } from '@/hooks/auth/useSignUp';
import type { LoginRequest } from '@/hooks/auth/auth.interface';
import { Eye, EyeOff, User, Car, BriefcaseBusiness } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const LogInForm: React.FC = () => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'driver' | 'restaurant_owner'>(
    'customer',
  );
  const [phone, setPhone] = useState('');
  const [recommendedCustomerId, setRecommendedCustomerId] = useState('');
  const { handleSignIn } = useSignIn();
  const { handleSignUp } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tab === 'signin') {
      const loginRequest: LoginRequest = { email, password };
      const { success, message } = await handleSignIn(loginRequest);
      toast[success ? 'success' : 'error'](message);
    } else {
      const signUpRequest = {
        name,
        email,
        password,
        confirmPassword,
        role,
        phone,
        recommendedCustomerId:
          role === 'customer' ? recommendedCustomerId : undefined,
      };
      const { success, message } = await handleSignUp(signUpRequest);
      toast[success ? 'success' : 'error'](message);
    }
  };

  const roleOptions = [
    {
      value: 'customer',
      label: 'Customer',
      description: 'Order food from restaurants',
      icon: User,
    },
    {
      value: 'driver',
      label: 'Driver',
      description: 'Deliver orders to customers',
      icon: Car,
    },
    {
      value: 'restaurant_owner',
      label: 'Restaurant Owner',
      description: 'Manage your restaurant',
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <Card className='w-full max-w-md shadow-lg'>
      <Toaster position='top-center' />

      <div className='flex border-b'>
        <button
          onClick={() => setTab('signin')}
          className={`w-1/2 cursor-pointer py-4 text-center font-semibold transition-colors ${
            tab === 'signin'
              ? 'border-b-2 border-orange-600 text-orange-600'
              : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setTab('signup')}
          className={`w-1/2 cursor-pointer py-4 text-center font-semibold transition-colors ${
            tab === 'signup'
              ? 'border-b-2 border-orange-600 text-orange-600'
              : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          Sign Up
        </button>
      </div>

      <CardContent className='p-6'>
        <form onSubmit={handleSubmit} className='space-y-4 text-left'>
          {tab === 'signup' && (
            <>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-stone-700'>
                  Full Name <span className='text-red-500'>*</span>
                </label>
                <Input
                  type='text'
                  placeholder='John Doe'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-stone-700'>
                  Role <span className='text-red-500'>*</span>
                </label>
                <Select
                  value={role}
                  onValueChange={(value: any) => setRole(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select your role' />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className='flex items-center gap-4'>
                          <option.icon className='h-5 w-5' />
                          <div className='flex flex-col text-left'>
                            <span className='font-medium'>{option.label}</span>
                            <span className='text-xs text-stone-500'>
                              {option.description}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-stone-700'>
                  Phone Number
                </label>
                <Input
                  type='tel'
                  placeholder='+1 (555) 123-4567'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {role === 'customer' && (
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-stone-700'>
                    Referral Code (Optional)
                  </label>
                  <Input
                    type='text'
                    placeholder='Enter referral code'
                    value={recommendedCustomerId}
                    onChange={(e) => setRecommendedCustomerId(e.target.value)}
                  />
                  <p className='text-xs text-stone-500'>
                    Have a referral code? Enter it to get special benefits!
                  </p>
                </div>
              )}
            </>
          )}

          <div className='space-y-2'>
            <label className='text-sm font-medium text-stone-700'>
              Email <span className='text-red-500'>*</span>
            </label>
            <Input
              type='email'
              placeholder='john@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-stone-700'>
              Password <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='pr-10'
                required
              />
              <button
                type='button'
                className='absolute top-1/2 right-3 -translate-y-1/2 text-stone-500 hover:text-stone-700'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {tab === 'signup' && (
            <div className='space-y-2'>
              <label className='text-sm font-medium text-stone-700'>
                Confirm Password <span className='text-red-500'>*</span>
              </label>
              <Input
                type='password'
                placeholder='••••••••'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <Button type='submit' className='w-full bg-orange-500 hover:bg-orange-400' size='lg'>
            {tab === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>

          {tab === 'signin' && (
            <p className='text-center text-sm text-stone-600'>
              Don't have an account?{' '}
              <button
                type='button'
                onClick={() => setTab('signup')}
                className='font-medium text-orange-600 hover:underline'
              >
                Sign up
              </button>
            </p>
          )}

          {tab === 'signup' && (
            <p className='text-center text-sm text-stone-600'>
              Already have an account?{' '}
              <button
                type='button'
                onClick={() => setTab('signin')}
                className='font-medium text-orange-600 hover:underline'
              >
                Sign in
              </button>
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default LogInForm;
