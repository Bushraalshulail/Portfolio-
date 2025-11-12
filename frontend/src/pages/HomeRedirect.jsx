import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LandingPage from './LandingPage.jsx';

export default function HomeRedirect() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in, redirect to home (gyms page)
    if (user) {
      navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  // If user is logged in, don't render anything (will redirect)
  if (user) {
    return null;
  }

  // Show LandingPage if user is not logged in
  return <LandingPage />;
}
