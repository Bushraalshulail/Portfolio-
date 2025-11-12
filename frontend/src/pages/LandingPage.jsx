import { Link } from 'react-router-dom';
import { Star, MapPin, Search, Dumbbell } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import heroImage from '../assets/e426b0c61f3eca5846906b9ed97ccb5b797027f4.png';

export default function LandingPage() {
  const { lang } = useLanguage();

  const features = [
    {
      icon: Star,
      titleAr: 'تقييمات موثوقة',
      titleEn: 'Trusted Ratings',
      descriptionAr: 'اطلع على تقييمات المستخدمين الحقيقية',
      descriptionEn: 'View real user ratings and reviews',
      bgColor: 'bg-white/70 backdrop-blur-sm',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      borderColor: 'border-teal-200'
    },
    {
      icon: MapPin,
      titleAr: 'مواقع دقيقة',
      titleEn: 'Accurate Locations',
      descriptionAr: 'اكتشف الأندية الرياضية في جميع أنحاء الرياض',
      descriptionEn: 'Discover gyms across all areas of Riyadh',
      bgColor: 'bg-white/70 backdrop-blur-sm',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      borderColor: 'border-teal-200'
    },
    {
      icon: Search,
      titleAr: 'ابحث بسهولة',
      titleEn: 'Easy Search',
      descriptionAr: 'ابحث عن النادي المثالي باستخدام معايير متعددة',
      descriptionEn: 'Find your perfect gym using multiple criteria',
      bgColor: 'bg-white/70 backdrop-blur-sm',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      borderColor: 'border-teal-200'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Page Background with Image - Fixed behind everything */}
      <div className="fixed inset-0 w-full h-full z-0 bg-teal-900">
        <img 
          src={heroImage} 
          alt="Gym Background" 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
        {/* Dark Overlay for better text readability - Lighter to show more image */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal-900/45 via-teal-800/40 to-emerald-900/45"></div>
      </div>

      <Navbar />
      
      {/* Top Border Line */}
      <div className="w-full h-1 bg-teal-800 relative z-30"></div>
        
      {/* Main Content - Overlay on Background */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center pt-24 pb-24">
        {/* Hero Section - Centered vertically in the middle of the page */}
        <section className="flex items-center justify-center px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-6xl mx-auto w-full text-center">
            {/* Site Name - GymFinder Riyadh */}
            <div className="flex items-center justify-center mb-6">
              <Dumbbell className={`h-10 w-10 sm:h-12 sm:w-12 text-white ${lang === 'ar' ? 'ml-3' : 'mr-3'}`} />
              <h2 
                className="font-bold text-white text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                style={{ lineHeight: "1.1", letterSpacing: "1px", textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
              >
                GymFinder Riyadh
              </h2>
            </div>

            {/* Main Heading - White Text */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-2xl" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
              {lang === 'ar' ? (
                'اكتشف أفضل الأندية الرياضية في الرياض'
              ) : (
                'Discover the Best Gyms in Riyadh'
              )}
            </h1>

            {/* Subheading - White Text */}
            <p className="text-lg sm:text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
              {lang === 'ar' ? (
                'اعثر على النادي الرياضي المثالي الذي يناسب أهدافك الرياضية ويلبي جميع احتياجاتك'
              ) : (
                'Find the perfect gym that matches your fitness goals and meets all your needs'
              )}
            </p>

            {/* CTA Button */}
            <div className="mb-6">
              <Link
                to="/home"
                className="inline-flex items-center justify-center h-12 px-6 text-base font-bold text-teal-900 bg-white/70 backdrop-blur-sm hover:bg-white/95 rounded-md transition-all duration-200 border-2 border-teal-300 shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                {lang === 'ar' ? 'ابدأ البحث الآن' : 'Start Searching Now'}
              </Link>
            </div>
          </div>
        </section>

        {/* Features Cards Section - At the Bottom with minimal spacing */}
        <section className="relative px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Three Feature Cards - At Bottom with Colored Backgrounds */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`${feature.bgColor} ${feature.borderColor} border-2 rounded-2xl p-6 lg:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2`}
                  >
                    {/* Icon */}
                    <div className="flex justify-center mb-5">
                      <div className={`${feature.iconBg} rounded-full p-3 lg:p-4 shadow-lg`}>
                        <Icon className={`h-7 w-7 lg:h-8 lg:w-8 ${feature.iconColor}`} />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl lg:text-2xl font-bold text-teal-800 mb-3 text-center">
                      {lang === 'ar' ? feature.titleAr : feature.titleEn}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-teal-700 leading-relaxed text-center text-sm lg:text-base">
                      {lang === 'ar' ? feature.descriptionAr : feature.descriptionEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
      
      {/* Bottom Border Line */}
      <div className="w-full h-1 bg-teal-800 relative z-30"></div>

      <div className="relative z-40">
        <Footer />
      </div>
    </div>
  );
}

