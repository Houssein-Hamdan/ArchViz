import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import SendOtpStep from '../components/Auth/OtpSteps/SendOtpStep';
import VerifyOtpStep from '../components/Auth/OtpSteps/VerifyOtpStep';
import CompleteRegistrationStep from '../components/Auth/OtpSteps/CompleteRegistrationStep';
import { useArchitectureStore } from '../services/useArchitectureStore';

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, setUser } = useArchitectureStore();

  const [tab, setTab] = useState('login'); // login, register-otp, verify-otp, complete-registration
  const [otpData, setOtpData] = useState({
    email: null,
    expiresIn: null,
    tempToken: null,
  });

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleOtpSent = (email, expiresIn) => {
    setOtpData({ email, expiresIn, tempToken: null });
    setTab('verify-otp');
  };

  const handleOtpVerified = (email, tempToken) => {
    setOtpData({ email, expiresIn: null, tempToken });
    setTab('complete-registration');
  };

  const handleRegistrationComplete = (user) => {
    setUser(user);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">
          Archviz
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate software architecture diagrams with AI
        </p>
      </div>

      {/* Login/Register Tabs */}
      {tab === 'login' || tab === 'register-otp' ? (
        <>
          <div className="flex gap-2 mb-8 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setTab('login')}
              className={`px-6 py-2 rounded font-medium transition ${
                tab === 'login'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setTab('register-otp')}
              className={`px-6 py-2 rounded font-medium transition ${
                tab === 'register-otp'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          {tab === 'login' ? (
            <LoginForm />
          ) : (
            <SendOtpStep
              onOtpSent={handleOtpSent}
              onBack={() => setTab('login')}
            />
          )}
        </>
      ) : tab === 'verify-otp' ? (
        <VerifyOtpStep
          email={otpData.email}
          expiresIn={otpData.expiresIn}
          onOtpVerified={handleOtpVerified}
          onBack={() => setTab('register-otp')}
          onResend={() => {}} // Handled in component
        />
      ) : tab === 'complete-registration' ? (
        <CompleteRegistrationStep
          email={otpData.email}
          tempToken={otpData.tempToken}
          onRegistrationComplete={handleRegistrationComplete}
          onBack={() => setTab('verify-otp')}
        />
      ) : null}

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
        Design your architecture. Share with your team.
      </p>
    </div>
  );
}