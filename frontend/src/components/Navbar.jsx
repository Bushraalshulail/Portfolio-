import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, User, LogOut, Settings } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const isAuth = location.pathname === '/auth';
  const isForgotPassword = location.pathname === '/forgot-password';
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, right: 0 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Update menu position when opened or window changes
  useEffect(() => {
    if (menuOpen && buttonRef.current) {
      const updatePosition = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setMenuPosition({
            top: rect.bottom + 8,
            left: lang === 'ar' ? undefined : rect.left,
            right: lang === 'ar' ? window.innerWidth - rect.right : undefined,
          });
        }
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [menuOpen, lang]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [menuOpen]);

  const handleAccountInfo = () => {
    setMenuOpen(false);
    navigate('/dashboard');
  };

  const handleManagement = () => {
    setMenuOpen(false);
    // Get token from user if available
    const token = user?.token || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);
    
    if (token) {
      // Auto-login with token
      window.location.href = `http://127.0.0.1:8000/admin/auto-login?token=${encodeURIComponent(token)}`;
    } else {
      // Fallback to login page
      window.location.href = 'http://127.0.0.1:8000/admin/login';
    }
  };

  // Check if user is admin or superadmin
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  const handleLogout = async () => {
    setMenuOpen(false);
    
    // If user is admin, also clear admin cookie by calling logout endpoint
    if (isAdmin) {
      try {
        await fetch('http://127.0.0.1:8000/admin/logout', {
          method: 'GET',
          credentials: 'include', // Include cookies in request
        });
      } catch (error) {
        console.error('Error clearing admin cookie:', error);
      }
    }
    
    // Clear frontend authentication
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Backdrop overlay when menu is open */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-[9998]"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <header className="fixed top-0 left-0 right-0 z-[9999] bg-white/70 backdrop-blur-sm border-b border-teal-100 shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-[100]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="inline-flex items-center gap-2 select-none hover:opacity-80 transition-opacity">
            <Dumbbell className="h-8 w-8 text-teal-600" />
            <span className="text-teal-900 font-semibold text-xl sm:text-2xl">GymFinder Riyadh</span>
          </Link>
        </div>
        
        {/* User menu or auth actions + language toggle */}
        <div className="flex items-center gap-4 text-teal-700">
          {user ? (
            <div className="relative z-[101]">
              <button 
                ref={buttonRef}
                onClick={() => setMenuOpen((v) => !v)} 
                className="text-sm hover:bg-teal-50 px-3 h-9 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 text-teal-700 whitespace-nowrap"
              >
                <span>{t('hello')} {user.name}</span>
              </button>
              {menuOpen && typeof document !== 'undefined' && buttonRef.current && createPortal(
                <div 
                  ref={menuRef}
                  className="fixed w-48 bg-white border border-teal-200 rounded-lg shadow-md py-1"
                  style={{
                    position: 'fixed',
                    top: `${buttonRef.current.getBoundingClientRect().bottom + 8}px`,
                    ...(lang === 'ar' 
                      ? { right: `${window.innerWidth - buttonRef.current.getBoundingClientRect().right}px` }
                      : { left: `${buttonRef.current.getBoundingClientRect().left}px` }
                    ),
                    zIndex: 99999,
                  }}
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                >
                  <button 
                    onClick={handleAccountInfo}
                    className="w-full px-4 py-2.5 block text-gray-800 hover:bg-gray-50 transition-colors text-left text-sm font-normal"
                  >
                    {t('myAccount')}
                  </button>
                  {isAdmin && (
                    <>
                      <div className="border-t border-gray-200"></div>
                      <button 
                        onClick={handleManagement}
                        className="w-full px-4 py-2.5 block text-gray-800 hover:bg-gray-50 transition-colors text-left text-sm font-normal"
                      >
                        {t('management')}
                      </button>
                    </>
                  )}
                  <div className="border-t border-gray-200"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 block text-red-600 hover:bg-red-50 transition-colors text-left text-sm font-normal"
                    style={{ color: '#dc2626' }}
                  >
                    {t('logout')}
                  </button>
                </div>,
                document.body
              )}
            </div>
          ) : (
            <>
              {!isAuth && !isForgotPassword && (
                <Link to="/auth" className="inline-flex items-center justify-center h-9 px-4 text-sm text-white rounded-md transition-colors gradient-dark-mint hover:shadow">{t('loginSignup')}</Link>
              )}
            </>
          )}
          <button onClick={toggleLang} className="inline-flex items-center justify-center h-9 px-3 text-sm border border-teal-200 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Toggle language">
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>
        </div>
        </nav>
      </header>
    </>
  );
}


