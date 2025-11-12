import { NavLink, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Footer() {
  const { lang, t } = useLanguage();
  
  return (
    <footer className="relative mt-16 border-t border-teal-100 bg-white/70 backdrop-blur-sm shadow-sm" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-teal-700">
      <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/about" className={({ isActive }) => `${isActive ? 'text-teal-900 font-semibold' : 'hover:text-teal-800'}`}>{t('aboutUs')}</NavLink>
        </nav>  
        <div className="text-sm">© {new Date().getFullYear()} GymFinder Riyadh</div> 
      </div>
    </footer>
  );
}


