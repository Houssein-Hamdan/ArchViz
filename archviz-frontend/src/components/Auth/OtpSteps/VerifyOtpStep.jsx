import { useState, useEffect } from 'react';
import { Loader, RotateCcw, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { otpService } from '../../../services/otpService';

export default function VerifyOtpStep({ email, expiresIn, onOtpVerified, onBack, onResend }) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(expiresIn);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }

    setIsLoading(true);
    try {
      const response = await otpService.verifyOtp(email, otp);

      if (response.status === 'success') {
        toast.success('OTP verified!');
        onOtpVerified(email, response.temp_token);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to verify OTP';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await otpService.resendOtp(email);
      toast.success('New OTP sent!');
      setTimeLeft(900); // 15 minutes
      setCanResend(false);
      setOtp('');
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-50">
          ✨ Enter Verification Code
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We sent a code to <span className="font-semibold">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              6-Digit Code
            </label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl font-mono tracking-widest"
              />
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Code expires in:
            </p>
            <p className={`text-lg font-bold ${
              timeLeft < 300
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-600 dark:text-green-400'
            }`}>
              {formatTime(timeLeft)}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </button>

          {/* Resend Button */}
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="w-full text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium py-2 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Resend Code
            </button>
          ) : (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              You can resend code in {formatTime(timeLeft)}
            </p>
          )}

          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium py-2"
          >
            ← Back
          </button>
        </form>
      </div>
    </div>
  );
}