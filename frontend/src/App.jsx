import { useState, useEffect } from 'react';
import { GymCard } from './components/GymCard';
import { SearchBar } from './components/SearchBar';
import { GymDetailsPage } from './pages/GymDetailsPage';
import { gymAPI } from './config/api';
import { Search, Dumbbell } from 'lucide-react';
import hero from './assets/e426b0c61f3eca5846906b9ed97ccb5b797027f4.png';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { Link } from 'react-router-dom';
import { useLanguage } from './context/LanguageContext.jsx';

export default function App() {
  const { lang, t } = useLanguage();
  const [selectedGym, setSelectedGym] = useState(null);
  const [gyms, setGyms] = useState([]);
  const [filteredGyms, setFilteredGyms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleGymsCount, setVisibleGymsCount] = useState(6);

  // Fetch gyms from API on component mount
  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      const data = await gymAPI.getAll();
      // Keep facilities and equipment as objects (don't convert to strings)
      // The display will use language context dynamically
      const formattedGyms = data.map(gym => {
        return {
          id: gym.id,
          nameArabic: gym.name_ar || '',
          nameEnglish: gym.name_en || '',
          location: gym.district || '', // Backend uses 'district' not 'location'
          description: gym.description || '',
          rating: gym.rating || 0,
          facilities: gym.facilities || [], // Keep as objects with name_ar and name_en
          equipment: gym.equipment || [], // Keep as objects with name_ar and name_en
          phone: gym.phone || '',
          website: gym.website || '',
          openingHours: gym.opening_hours || '',
          hours: gym.opening_hours || '',
          gender: gym.gender || '',
          logo: gym.logo_url || null, // Add logo URL
          image: gym.logo_url || null // Add image URL (same as logo for now)
        };
      });
      
      setGyms(formattedGyms);
      setFilteredGyms(formattedGyms);
    } catch (error) {
      console.error('Error fetching gyms:', error);
      // Fallback to empty array on error
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
          (gym.nameArabic && gym.nameArabic.toLowerCase().includes(q)) ||
          (gym.nameEnglish && gym.nameEnglish.toLowerCase().includes(q)) ||
          (gym.location && gym.location.toLowerCase().includes(q)) ||
          facilitiesText.includes(q) ||
          equipmentText.includes(q)
        );
      });
    }
    
    // Filter by location (district)
    if (location?.trim()) {
      filtered = filtered.filter(gym =>
        gym.location && gym.location.includes(location)
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
    // Reset visible count when search/filter changes
    setVisibleGymsCount(6);
  };

  const handleLoadMore = () => {
    setVisibleGymsCount(prev => prev + 6);
  };

  // Get visible gyms based on the count
  const visibleGyms = filteredGyms.slice(0, visibleGymsCount);
  const hasMoreGyms = filteredGyms.length > visibleGymsCount;

  const handleViewDetails = (gym) => setSelectedGym(gym);
  const handleBack = () => setSelectedGym(null);
  const handleFilterToggle = () => setIsFilterOpen(!isFilterOpen);

  // Keep homepage accessible without requiring login

  if (selectedGym) return <GymDetailsPage gym={selectedGym} onBack={handleBack} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <Navbar />
      <div className="pt-28">
      
      {/* ✅ Hero Section (expanded height/impact) */}
      <div className="relative bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: `url(${hero})` }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: "12rem", paddingBottom: "12rem" }}>

          {/* 🔹 Title */}
          <div className="text-center mt-10 md:mt-16">
            <div className="flex items-center justify-center mb-4">
              <Dumbbell className="h-10 w-10 text-white ml-3" />
              <h1 
                 className="font-bold text-white text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                 style={{ lineHeight: "1.1", letterSpacing: "1px" }}
              >
                 GymFinder Riyadh
              </h1>

            </div>
            <p className="text-white text-lg max-w-3xl mx-auto">
              {t('heroDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} onFilterToggle={handleFilterToggle} isFilterOpen={isFilterOpen} />
        </div>

        {/* ✅ Results Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-teal-900 mb-6">{t('availableGyms')} ({filteredGyms.length})</h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-teal-600">{t('loadingGyms')}</p>
            </div>
          ) : filteredGyms.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Search className="h-16 w-16 text-teal-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-teal-700 mb-2">{t('noResults')}</h3>
                <p className="text-teal-600">{t('tryDifferentSearch')}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {visibleGyms.map((gym) => (
                  <GymCard key={gym.id} gym={gym} onViewDetails={handleViewDetails} />
                ))}
              </div>
              {hasMoreGyms && (
                <div className="text-center py-12">
                  <button
                    onClick={handleLoadMore}
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white gradient-dark-mint hover:shadow-lg rounded-xl transition-all duration-200"
                  >
                    {t('loadMore')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ✅ Contact CTA Section */}
        <div className="text-center py-12 border-t border-teal-200">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-teal-800 mb-4">{t('cantFindGym')}</h3>
            <p className="text-teal-600 mb-6">
              {t('addGymsContinuously')}
            </p>
            <div className="flex justify-center">
              <Link to="/contact" className="border border-teal-300 text-teal-600 px-6 py-3 rounded-xl hover:bg-teal-50 transition-all duration-200">
                {t('contactUs')}
              </Link>
            </div>
          </div>
        </div>

        {/* ✅ Footer content moved to global footer component */}
      </div>
      </div>
      <Footer />
    </div>
  );
}
