import { ArrowLeft, ArrowRight, MapPin, Clock, Phone, Globe, Star, Wifi, Car, Waves, Dumbbell, Users, Home } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import ImageWithFallback from '../components/ImageWithFallback';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useState, useEffect } from 'react';
import { translateText, translateTextSync } from '../services/translationService.js';

// Icon mapping using English names as keys (more reliable)
const facilityIcons = {
  'Swimming Pool': Waves,
  'مسبح سباحة': Waves,
  'Free WiFi': Wifi,
  'واي فاي مجاني': Wifi,
  'Parking': Car,
  'موقف سيارات': Car,
  'Personal Training': Users,
  'تدريب شخصي': Users,
  '24/7 Access': Clock,
  'وصول 24/7': Clock,
  'Cardio Equipment': Dumbbell,
  'أجهزة كارديو': Dumbbell,
  'Free Weights': Dumbbell,
  'أوزان حرة': Dumbbell,
  'Group Classes': Users,
  'تمارين جماعية': Users,
  'Sauna': Waves,
  'ساونا': Waves,
  'Steam Room': Waves,
  'غرفة بخار': Waves,
  'Strength Equipment': Dumbbell,
  'أجهزة قوة': Dumbbell,
  'Functional Training': Dumbbell,
  'تدريب وظيفي': Dumbbell
};

export function GymDetailsPage({ gym, onBack }) {
  // Scroll to top when this page mounts
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const { t, toggleLang, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);
  
  // Translation state
  const [translatedDescription, setTranslatedDescription] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedHours, setTranslatedHours] = useState('');
  const [isTranslatingHours, setIsTranslatingHours] = useState(false);
  
  // Helper function to convert Arabic time abbreviations to English
  const convertTimeAbbreviations = (text) => {
    if (!text) return text;
    // Replace ص with A.M. and م with P.M.
    return text
      .replace(/\s*ص\s*/g, ' A.M.')
      .replace(/\s*م\s*/g, ' P.M.')
      .replace(/\s+/g, ' ') // Clean up extra spaces
      .trim();
  };
  
  // Format website display: show domain and short path (max ~40 chars)
  const formatWebsiteDisplay = (raw) => {
    if (!raw) return '';
    try {
      const href = raw.startsWith('http') ? raw : `https://${raw}`;
      const u = new URL(href);
      // collapse long paths
      let display = u.hostname;
      if (u.pathname && u.pathname !== '/') {
        const path = decodeURIComponent(u.pathname).replace(/\/+$/, '');
        const shortPath = path.length > 24 ? `${path.slice(0, 24)}…` : path;
        display += shortPath;
      }
      return display;
    } catch {
      return raw.length > 40 ? `${raw.slice(0, 37)}…` : raw;
    }
  };
  
  // Helper function to get facility/equipment name based on language
  const getName = (item) => {
    if (typeof item === 'string') {
      // Format string: remove underscores, capitalize words
      return item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    if (typeof item === 'object' && item !== null) {
      const name = lang === 'ar' ? (item.name_ar || item.name_en || '') : (item.name_en || item.name_ar || '');
      // Format English names: remove underscores, capitalize words
      if (lang === 'en' && name.includes('_')) {
        return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
      return name;
    }
    return '';
  };
  
  // Get icon for facility (try both languages)
  const getFacilityIcon = (facilityName) => {
    // Try both formatted and original names
    const cleanName = facilityName.replace(/_/g, ' ');
    return facilityIcons[facilityName] || facilityIcons[cleanName] || Dumbbell;
  };
  
  const facilities = gym.facilities || [];
  const equipment = gym.equipment || [];
  
  // Translate description when language changes or gym changes
  useEffect(() => {
    if (!gym.description) {
      setTranslatedDescription('');
      return;
    }
    
    // If Arabic, show original
    if (lang === 'ar') {
      setTranslatedDescription('');
      return;
    }
    
    // Check cache first (synchronous)
    const cached = translateTextSync(gym.description, lang);
    if (cached !== gym.description) {
      // Found in cache
      setTranslatedDescription(cached);
      setIsTranslating(false);
      return;
    }
    
    // Not in cache, need to translate
    setIsTranslating(true);
    translateText(gym.description, lang)
      .then((translated) => {
        setTranslatedDescription(translated);
        setIsTranslating(false);
      })
      .catch((error) => {
        console.warn('Translation failed:', error);
        setTranslatedDescription(gym.description); // Fallback to original
        setIsTranslating(false);
      });
  }, [gym.description, lang]);
  
  // Translate working hours when language changes or gym changes
  useEffect(() => {
    const hours = gym.hours || gym.openingHours || '';
    if (!hours) {
      setTranslatedHours('');
      return;
    }
    
    // If Arabic, show original
    if (lang === 'ar') {
      setTranslatedHours('');
      return;
    }
    
    // Check cache first (synchronous)
    const cached = translateTextSync(hours, lang);
    if (cached !== hours) {
      // Found in cache, convert time abbreviations
      setTranslatedHours(convertTimeAbbreviations(cached));
      setIsTranslatingHours(false);
      return;
    }
    
    // Not in cache, need to translate
    setIsTranslatingHours(true);
    translateText(hours, lang)
      .then((translated) => {
        // Convert time abbreviations after translation
        const finalTranslation = convertTimeAbbreviations(translated);
        setTranslatedHours(finalTranslation);
        setIsTranslatingHours(false);
      })
      .catch((error) => {
        console.warn('Hours translation failed:', error);
        // Fallback: at least convert the abbreviations
        setTranslatedHours(convertTimeAbbreviations(hours));
        setIsTranslatingHours(false);
      });
      }, [gym.hours, gym.openingHours, lang]);
  
  // Don't render content if user is not logged in (redirecting)
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Additional back button in the top navigation area */}
        <div className="mb-6 flex justify-between items-center">
          <button 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onBack();
            }}
            className="inline-flex items-center bg-white text-teal-600 hover:bg-teal-50 rounded-xl px-4 py-2 border border-teal-200 transition-all duration-200 hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 ml-2" /> {t('backHome')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden rounded-2xl border border-teal-200">
              <div className="relative bg-white">
                <ImageWithFallback src={gym.image} alt={gym.nameArabic} className="w-full h-64 md:h-96 object-contain p-8" />
                {/* Only show small logo overlay if it's different from the main image */}
                {gym.logo && gym.image && gym.logo !== gym.image && (
                  <div className="absolute top-6 right-6 bg-white rounded-xl p-3 shadow-xl">
                    <img src={gym.logo} alt={`${gym.nameEnglish} logo`} className="h-16 w-auto object-contain" />
                  </div>
                )}
              </div>
            </Card>

            <Card className="rounded-2xl border border-teal-200 gradient-mint-card">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl text-teal-900 mb-2">{gym.nameArabic}</h1>
                    <h2 className="text-xl text-teal-600 mb-4">{gym.nameEnglish}</h2>
                    <div className="flex items-center text-teal-600 mb-4 gap-2">
                      <MapPin className="h-5 w-5 flex-shrink-0" />
                      <span>{gym.location}</span>
                    </div>
                    {gym.gender && (
                      <div className="flex items-center text-teal-600 mb-4 gap-2">
                        <Users className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">
                          {(gym.gender === 'Male' || gym.gender === 'Men') ? t('male') : 
                           (gym.gender === 'Female' || gym.gender === 'Women') ? t('female') : 
                           gym.gender === 'Mixed' ? t('mixed') : gym.gender}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-amber-400 fill-current ml-1" />
                      <span className="text-lg text-teal-800">{gym.rating}</span>
                      <span className="text-teal-600 mr-2">(124 {t('rating')})</span>
                    </div>
                  </div>
                </div>

                <Separator className="mb-6" />

                <div>
                  <h3 className="text-lg mb-4 text-teal-800">{t('aboutGym')}</h3>
                  <div className="relative">
                    <p className="text-teal-700 leading-relaxed">
                      {lang === 'ar' ? gym.description : (translatedDescription || gym.description || '')}
                    </p>
                    {isTranslating && lang === 'en' && (
                      <div className="mt-2 text-xs text-teal-500 italic">
                        Translating...
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-teal-200 gradient-mint-card">
              <CardContent className="p-8">
                <h3 className="text-lg mb-6 text-teal-800">
                  {t('facilitiesEquipment')}
                </h3>
                <div className="mb-8">
                  <h4 className="text-md mb-4 text-teal-600">
                    {t('availableFacilities')}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {facilities.map((facility, index) => {
                      const facilityName = getName(facility);
                      const Icon = getFacilityIcon(facilityName);
                      const key = typeof facility === 'object' && facility?.id ? facility.id : index;
                      
                      return (
                        <div key={key} className="flex items-center bg-teal-50 px-4 py-2 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors">
                          <Icon className={`h-4 w-4 text-teal-600 ${lang === 'ar' ? 'ml-2' : 'mr-2'}`} />
                          <span className="text-sm text-teal-700 font-medium">{facilityName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-md mb-4 text-teal-600">
                    {t('availableEquipment')}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {equipment.map((eq, index) => {
                      const equipmentName = getName(eq);
                      const Icon = getFacilityIcon(equipmentName);
                      const key = typeof eq === 'object' && eq?.id ? eq.id : index;
                      
                      return (
                        <div key={key} className="flex items-center bg-teal-50 px-4 py-2 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors">
                          <Icon className={`h-4 w-4 text-teal-600 ${lang === 'ar' ? 'ml-2' : 'mr-2'}`} />
                          <span className="text-sm text-teal-700 font-medium">{equipmentName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl border border-teal-200 gradient-mint-card">
              <CardContent className="p-6">
                <h3 className="text-lg mb-6 text-teal-800">{t('contactInfo')}</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-teal-500">{t('workingHours')}</div>
                      <div className="text-teal-700">
                        {lang === 'ar' 
                          ? (gym.hours || gym.openingHours || '') 
                          : (translatedHours || gym.hours || gym.openingHours || '')}
                      </div>
                      {isTranslatingHours && lang === 'en' && (
                        <div className="text-xs text-teal-500 italic mt-1">
                          Translating...
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-teal-500">{t('phoneNumber')}</div>
                      <a 
                        href={`tel:${gym.phone}`}
                        className="text-teal-700 hover:text-teal-800 hover:underline transition-colors cursor-pointer" 
                        dir="ltr"
                      >
                        {gym.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-teal-500">{t('website')}</div>
                      <a 
                        href={gym.website.startsWith('http') ? gym.website : `https://${gym.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-800 hover:underline transition-colors cursor-pointer break-words" 
                        dir="ltr"
                      >
                        {formatWebsiteDisplay(gym.website)}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-teal-200 gradient-mint-card">
              <CardContent className="p-6">
                <h3 className="text-lg mb-4 text-teal-800">{t('location')}</h3>
                <div className="bg-teal-100 rounded-xl h-48 flex items-center justify-center">
                  <div className="text-center">
                    <span className="block text-teal-500">{t('interactiveMap')}</span>
                    <span className="block text-sm text-teal-400">{t('comingSoon')}</span>
                  </div>
                </div>
                <Button className="w-full mt-4 gradient-dark-mint rounded-xl cursor-pointer"
                onClick={() => {
                  const encodedLocation = encodeURIComponent(gym.location);
                  window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
                }}
                >{t('getDirections')}
                </Button>
              </CardContent>
            </Card>

            
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
  
}
