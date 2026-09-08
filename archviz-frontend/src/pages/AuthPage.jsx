import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import { useArchitectureStore } from '../services/useArchitectureStore';

export default function AuthPage() {
  const navigate = useNavigate();
  const { user } = useArchitectureStore();

  const [tab, setTab] = useState('login');

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

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
          onClick={() => setTab('register')}
          className={`px-6 py-2 rounded font-medium transition ${
            tab === 'register'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Register
        </button>

      </div>

      {/* Auth Forms */}
      {tab === 'login' ? (
        <LoginForm />
      ) : (
        <RegisterForm />
      )}

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
        Design your architecture. Share with your team.
      </p>

    </div>
  );
}