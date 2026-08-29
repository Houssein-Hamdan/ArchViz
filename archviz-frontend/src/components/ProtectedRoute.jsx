import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArchitectureStore } from '../services/useArchitectureStore';
import { Loader } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { user, isLoading } = useArchitectureStore();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : null;
}