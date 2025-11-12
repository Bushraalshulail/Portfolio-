import { NavLink, Link } from 'react-router-dom';
import { Dumbbell, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Navigation() {
  const { user } = useAuth();
  const { t, toggleLang, lang } = useLanguage();
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-sm border-b border-teal-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" dir="rtl">
        {/* Right side: Logo only (remove text 'الرئيسية') */}
        <div className="flex items-center gap-4">
          <Link to="/" className="inline-flex items-center gap-2 select-none">
            <Dumbbell className="h-6 w-6 text-teal-600" />
            <span className="text-teal-900 font-semibold">GymFinder Riyadh</span>
          </Link>
        </div>
        {/* Left side: Greeting or auth actions + language toggle */}
        <div className="flex items-center gap-3 text-teal-700">
          {user ? <span className="text-sm">{t('helloNada')}</span> : null}
          <button onClick={toggleLang} className="px-3 py-1 text-sm border border-teal-200 rounded-lg hover:bg-teal-50" aria-label="Toggle language">
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>
          {!user && (
            <>
              <Link to="/auth" className="px-4 py-2 text-sm text-teal-600 hover:bg-teal-50 rounded-xl transition-colors">تسجيل الدخول</Link>
              <Link to="/auth" className="px-4 py-2 text-sm text-white rounded-xl transition-colors gradient-dark-mint hover:shadow-lg">إنشاء حساب</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}


