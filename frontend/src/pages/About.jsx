import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function About() {
  const { lang, t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-teal-900 mb-4 text-center">{t('aboutUs')}</h1>

          <div className="text-center space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <p className="text-lg text-gray-800 leading-relaxed">
              {t('aboutUsDescription1')}
              <br /><br />
              {t('aboutUsDescription2')}
            </p>

            <p className="text-teal-800 font-extrabold text-lg leading-relaxed">
              {t('aboutUsVision')}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
