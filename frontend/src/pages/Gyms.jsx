import { useState, useEffect } from 'react';
import { GymCard } from '../components/GymCard';
import { SearchBar } from '../components/SearchBar';
import { gymAPI } from '../config/api';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Gyms() {
  const { lang, t } = useLanguage();
  const [gyms, setGyms] = useState([]);
  const [filteredGyms, setFilteredGyms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log('Fetching gyms from:', gymAPI.getAll);
      const data = await gymAPI.getAll();
      console.log('Received data:', data?.length, 'gyms');
      
      // Handle empty array or invalid response
      if (!data || !Array.isArray(data)) {
        console.error('Invalid response from API:', data);
        setError('استجابة غير صالحة من الخادم');
        setGyms([]);
        setFilteredGyms([]);
        return;
      }
      
      // Keep facilities and equipment as objects (don't convert to strings)
      // The display will use language context dynamically
      const formattedGyms = data.map(gym => {
        return {
          id: gym.id,
          name_ar: gym.name_ar || '',
          name_en: gym.name_en || '',
          district: gym.district || '',
          description: gym.description || '',
          rating: gym.rating || 0,
          facilities: gym.facilities || [], // Keep as objects with name_ar and name_en
          equipment: gym.equipment || [], // Keep as objects with name_ar and name_en
          phone: gym.phone || '',
          website: gym.website || '',
          opening_hours: gym.opening_hours || '',
          gender: gym.gender || '',
          logo_url: gym.logo_url || null, // Add logo_url from API
          logo: gym.logo_url || null, // Map to logo for GymCard
          image: gym.logo_url || null // Map to image for GymCard
        };
      });
      
      console.log('Formatted gyms:', formattedGyms.length);
      
      // Debug: Log gyms with logo URLs
      const gymsWithLogos = formattedGyms.filter(g => g.logo_url);
      console.log(`Gyms with logo URLs: ${gymsWithLogos.length}`);
      if (gymsWithLogos.length > 0) {
        console.log('Sample gyms with logos:', gymsWithLogos.slice(0, 3).map(g => ({
          id: g.id,
          name: g.name_en,
          logo_url: g.logo_url
        })));
      }
      
      setGyms(formattedGyms);
      setFilteredGyms(formattedGyms);
    } catch (error) {
      console.error('Error fetching gyms:', error);
      setError(`حدث خطأ في تحميل الأندية: ${error.message || 'تأكد من تشغيل الخادم'}`);
      setGyms([]);
      setFilteredGyms([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Map filter gender values to database values
  const mapGenderFilterToDb = (filterGender) => {
    if (!filterGender) return null;
    const trimmed = filterGender.trim();
    const genderLower = trimmed.toLowerCase();
    
    // Map Arabic values (Arabic strings don't change with toLowerCase, so check original)
    if (trimmed === 'رجال' || genderLower === 'men' || genderLower === 'male') {
      return 'Male';
    }
    if (trimmed === 'سيدات' || genderLower === 'women' || genderLower === 'female') {
      return 'Female';
    }
    if (trimmed === 'مختلط' || genderLower === 'mixed') {
      return 'Mixed';
    }
    
    // If already in correct format, return as is
    if (genderLower === 'male' || genderLower === 'female' || genderLower === 'mixed') {
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    }
    
    return trimmed;
  };

  const handleSearch = (query, location, gender) => {
    let filtered = gyms;
    
    // Filter by search query
    if (query?.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(gym => {
        // Search in both Arabic and English names of facilities/equipment
        const facilitiesText = gym.facilities 
          ? gym.facilities.map(f => {
              const facility = typeof f === 'object' ? f : { name_ar: f, name_en: f };
              return `${facility.name_ar || ''} ${facility.name_en || ''}`;
            }).join(' ').toLowerCase()
          : '';
        const equipmentText = gym.equipment
          ? gym.equipment.map(e => {
              const equipment = typeof e === 'object' ? e : { name_ar: e, name_en: e };
              return `${equipment.name_ar || ''} ${equipment.name_en || ''}`;
            }).join(' ').toLowerCase()
          : '';
        
        return (
          (gym.name_ar && gym.name_ar.toLowerCase().includes(q)) ||
          (gym.name_en && gym.name_en.toLowerCase().includes(q)) ||
          (gym.district && gym.district.toLowerCase().includes(q)) ||
          facilitiesText.includes(q) ||
          equipmentText.includes(q)
        );
      });
    }
    
    // Filter by location (district)
    if (location?.trim()) {
      filtered = filtered.filter(gym =>
        gym.district && gym.district.includes(location)
      );
    }
    
    // Filter by gender - map filter value to database value, handle both Male/Men and Female/Women
    if (gender?.trim()) {
      const dbGender = mapGenderFilterToDb(gender);
      filtered = filtered.filter(gym =>
        gym.gender === dbGender || 
        (dbGender === 'Male' && (gym.gender === 'Men' || gym.gender === 'Male')) ||
        (dbGender === 'Female' && (gym.gender === 'Women' || gym.gender === 'Female'))
      );
    }
    
    setFilteredGyms(filtered);
  };

  const handleFilterToggle = () => setIsFilterOpen(!isFilterOpen);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="text-teal-600 mt-4">{t('loadingGyms')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button 
              onClick={fetchGyms}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              {lang === 'ar' ? 'حاول مرة أخرى' : 'Try Again'}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl text-teal-900 mb-6">{t('availableGyms')}</h1>
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} onFilterToggle={handleFilterToggle} isFilterOpen={isFilterOpen} />
      </div>
      <div>
        {filteredGyms.length === 0 ? (
          <div className="text-center text-teal-600 py-12">
            <p className="text-lg">{t('noResultsTitle')}</p>
            <p className="text-sm mt-2">{t('tryDifferent')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredGyms.map((gym) => {
              return (
                <GymCard 
                  key={gym.id} 
                  gym={{
                    id: gym.id,
                    nameArabic: gym.name_ar || '',
                    nameEnglish: gym.name_en || '',
                    location: gym.district || '', // Backend uses 'district' not 'location'
                    description: gym.description || '',
                    rating: gym.rating || 0,
                    facilities: gym.facilities || [], // Keep as objects - GymCard will use lang context
                    equipment: gym.equipment || [], // Keep as objects - GymCard will use lang context
                    phone: gym.phone || '',
                    website: gym.website || '',
                    openingHours: gym.opening_hours || '',
                    gender: gym.gender || '',
                    logo: gym.logo_url || null, // Pass logo URL
                    image: gym.logo_url || null // Pass image URL (same as logo for now)
                  }} 
                  onViewDetails={() => {}} 
                />
              );
            })}
          </div>
        )}
      </div>
      <Footer />
      </div>
    </div>
  );
}


