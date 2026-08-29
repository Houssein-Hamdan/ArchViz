import client from '../services/client';

export const otpService = {
  // Step 1: Send OTP
  sendOtp: async (email) => {
    const response = await client.post('/auth/send-otp', { email });
    return response.data;
  },

  // Step 2: Verify OTP
  verifyOtp: async (email, otp) => {
    const response = await client.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  // Step 3: Complete Registration
  completeRegistration: async (email, name, password, tempToken) => {
    const response = await client.post('/auth/complete-registration', {
      email,
      name,
      password,
      password_confirmation: password,
      temp_token: tempToken,
    });
    return response.data;
  },

  // Resend OTP
  resendOtp: async (email) => {
    const response = await client.post('/auth/resend-otp', { email });
    return response.data;
  },
};