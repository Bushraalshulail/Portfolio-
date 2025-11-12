import { MapPin, Star, Wifi, Car, Waves, Dumbbell, Users, Clock } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import ImageWithFallback from './ImageWithFallback';
import { useLanguage } from '../context/LanguageContext.jsx';

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

export function GymCard({ gym, onViewDetails }) {
  const { lang, t } = useLanguage();
  
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
    return facilityIcons[facilityName] || Dumbbell;
  };
  
  const displayedFacilities = gym.facilities ? gym.facilities.slice(0, 3) : [];
  const remainingFacilitiesCount = gym.facilities ? Math.max(0, gym.facilities.length - 3) : 0;
  
  // Debug logging for images
  if (gym.image) {
    console.log(`GymCard [${gym.id}]: Loading image for ${gym.nameEnglish}:`, gym.image);
  }
  
  // If we're using logo_url as the main image, don't show it again as a small overlay
  // The small overlay should only appear if we had a separate facility photo
  const showLogoOverlay = gym.logo && gym.image && gym.logo !== gym.image;
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 gradient-mint-card rounded-2xl flex flex-col h-full">
      <div className="relative bg-white flex-shrink-0">
        <ImageWithFallback
          src={gym.image}
          alt={gym.nameArabic}
          className="w-full h-48 object-contain p-4"
        />
        {/* Only show small logo overlay if it's different from the main image */}
        {showLogoOverlay && (
          <div className="absolute top-4 right-4 bg-white rounded-lg p-2 shadow-lg">
            <img 
              src={gym.logo} 
              alt={`${gym.nameEnglish} logo`}
              className="h-12 w-auto object-contain"
            />
          </div>
        )}
      </div>
      
      <CardContent className="p-6 flex flex-col flex-1 min-h-0 justify-between">
        <div className="flex-shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {gym.gender && (
                  <div className="flex items-center">
                    <Users className={`h-4 w-4 text-teal-600 ${lang === 'ar' ? 'ml-1' : 'mr-1'}`} />
                    <span className="text-xs text-teal-700 font-medium">
                      {(gym.gender === 'Male' || gym.gender === 'Men') ? t('male') : 
                       (gym.gender === 'Female' || gym.gender === 'Women') ? t('female') : 
                       gym.gender === 'Mixed' ? t('mixed') : gym.gender}
                    </span>
                  </div>
                )}
                <div className="flex items-center text-teal-600">
                  <MapPin className={`h-4 w-4 ${lang === 'ar' ? 'ml-1' : 'mr-1'}`} />
                  <span className="text-sm">{gym.location}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-teal-900 mb-1">{gym.nameArabic}</h3>
              <p className="text-sm text-teal-600">{gym.nameEnglish}</p>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-amber-400 fill-current" />
              <span className="mr-1 text-sm text-teal-700">{gym.rating}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4" dir="rtl">
            {displayedFacilities.map((facility, index) => {
              const facilityName = getName(facility);
              const Icon = getFacilityIcon(facilityName);
              // Use facility id if available, otherwise use index
              const key = typeof facility === 'object' && facility?.id ? facility.id : index;
              
              return (
                <div key={key} className="flex items-center bg-teal-50 px-3 py-1 rounded-full">
                  <Icon className={`h-3 w-3 text-teal-600 ${lang === 'ar' ? 'ml-1' : 'mr-1'}`} />
                  <span className="text-xs text-teal-700">{facilityName}</span>
                </div>
              );
            })}
            {remainingFacilitiesCount > 0 && (
              <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-xs text-gray-600">
                  {lang === 'ar' ? `+${remainingFacilitiesCount} المزيد` : `+${remainingFacilitiesCount} more`}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-auto flex-shrink-0">
          <Button 
            onClick={() => onViewDetails(gym)}
            className="w-full gradient-dark-mint hover:shadow-lg rounded-xl transition-all duration-200"
          >
            {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
