import { Search, Filter, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Listbox } from '@headlessui/react';
import { useLanguage } from '../context/LanguageContext.jsx';

export function SearchBar({ onSearch, onFilterToggle, isFilterOpen }) {
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const dropdownRef = useRef(null);
  const filterButtonRef = useRef(null);
  const listboxOptionsRef = useRef(null);
  
  // Gender options
  const GENDER_OPTIONS = lang === 'ar' 
    ? { men: 'رجال', women: 'سيدات' }
    : { men: 'Male', women: 'Female' };

  // District translations (Arabic to English)
  const DISTRICT_TRANSLATIONS = {
    "اشبيلية": "Ishbiliyah",
    "اشبيليا": "Ishbiliyah",
    "البديعة": "Al Badiah",
    "البديعة 2": "Al Badiah 2",
    "التعاون": "Al Taawun",
    "الدائري الغربي - شبرا": "Shubra (Western Ring Road)",
    "شبرا": "Shubra",
    "الربوة": "Al Rabwah",
    "الروابي": "Al Rawabi",
    "السلام": "As Salam",
    "السليمانية": "As Sulaymaniyah",
    "السويدي": "As Suwaidi",
    "الشافعي المنار": "Al Manar (Ash Shafii)",
    "الشفا": "Ash Shafa",
    "الصحافة": "As Sahafah",
    "الصفوة": "As Safwah",
    "العليا": "Al Olaya",
    "الغدير": "Al Ghadir",
    "المونسية": "Al Munsiyah",
    "المجمعة": "Al Majma'ah",
    "المزاحمية": "Al Muzahimiyah",
    "المصيف": "Al Masif",
    "الملك فيصل": "Al Malek Faisal",
    "المنصورة": "Al Mansurah",
    "النخيل": "Al Nakhil",
    "الندوة": "Al Nadwah",
    "الندى": "Al Nada",
    "الواحه": "Al Waha",
    "الياسمين": "Al Yasmin",
    "حطين": "Hittin",
    "طويق": "Tuwaiq",
    "مدينة الملك عبد العزيز للعلوم والتقنية": "KACST",
    "مرسية": "Murcia",
    "لبن": "Laban",
    "الوادي": "Al Wadi",
    "عرقة": "Irqah",
    "المحمدية": "Al Muhammadiyah",
    "الحمراء": "Al Hamra",
    "الخليج": "Al Khaleej",
    "الربيع": "Ar Rabi",
    "الرحمانية": "Ar Rahmaniyah",
    "العزيزية": "Al Aziziyah",
    "الفلاح": "Al Falah",
    "المعذر": "Al Ma'thar",
    "النزهة": "An Nuzhah",
    "النسيم": "An Naseem",
    "النسيم الغربي": "West Naseem",
    "النسيم الشرقي": "East Naseem",
    "النفل": "An Nafl",
    "اليرموك": "Al Yarmuk",
    "خريص": "Khurais",
    "ظهرة البديعة": "Dhaharat Al Badiah",
    "عكاظ": "Ukaz",
    "الزهراء": "Az Zahra",
    "الجزيرة": "Al Jazirah",
    "الدار البيضاء": "Ad Dar Al Bayda",
    "الدفاع": "Ad Difa",
    "الرمال 2": "Ar Rimāl 2",
    "العارض": "Al Arid",
    "القدس": "Al Quds",
    "المروج": "Al Muruj",
    "القادسية": "Al Qadisiyah",
    "الاندلس": "Al Andalus",
    "الازدهار": "Al Izdihar",
    "الرائد": "Ar Raid",
    "الفيحاء": "Al Fayha",
    "الملز": "Al Malaz",
    "بدر": "Badr",
    "العريجاء": "Al Uraija",
    "الشفا - بدر": "Ash Shafa - Badr",
    "نمار": "Namar",
    "السعادة": "As Saadah",
    "النهضة": "An Nahdah",
    "الريان": "Ar Rayyan",
    "القيروان": "Al Qirawan",
    "رياض نجد": "Riyadh Najd",
    "جامعة الاميرة نورة": "Princess Nourah University",
    'الملقا': 'Al-Malqa',
    'النرجس': 'Al-Narjis',
    'الواحة': 'Al-Wahah',
    'جامعة الأميرة نورة': 'Princess Nourah University',
    'قرطبة': 'Qurtubah',
    'الربوة (الربوة بلازا)': 'Al Rabwah (Rabwa Plaza)',
    'الروضة': 'Al Rawdah',
    'الشفاء': 'Al Shifa',
    'العقيق': 'Al Aqeeq',
    'المروة ديراب': 'Al Marwah - Dirab',
    'حي القيروان': 'Al Qirawan',
    'التخصصي': 'Al Takhassusi',
    'الحزم': 'Al Hazm'
  };
  

  // Function to translate district name based on current language
  const translateDistrict = (district) => {
    if (!district) return district;
    if (lang === 'ar') {
      return district; // Return Arabic name as-is
    } else {
      // Return English translation if available, otherwise return original
      return DISTRICT_TRANSLATIONS[district] || district;
    }
  };

  // Close filter popup on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isFilterOpen &&
        dropdownRef.current &&
        filterButtonRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !filterButtonRef.current.contains(event.target)
      ) {
        onFilterToggle();
      }
    };

    if (isFilterOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);

  }, [isFilterOpen, onFilterToggle]);

  // Prevent body scroll lock when filter is open
  useEffect(() => {
    if (isFilterOpen) {
      // Ensure body can still scroll
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // Remove any scroll lock classes Headless UI might add
      document.body.classList.remove('overflow-hidden');
      document.documentElement.classList.remove('overflow-hidden');
    }
  }, [isFilterOpen]);

  const normalizeDistrict = (name) => {
    return name
      .replace(/\s+/g, ' ')       // إزالة مسافات إضافية
      .replace(/أ/g, 'ا')          // توحيد الألف
      .replace(/إ/g, 'ا')
      .replace(/آ/g, 'ا')
      .trim();
  };
  
  // Fetch districts dynamically
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/districts")
      .then(res => res.json())
      .then(data => {
        const normalized = data.map(normalizeDistrict);
        const unique = Array.from(new Set(normalized));
        const sorted = unique.sort((a, b) => {
          return translateDistrict(a).localeCompare(
            translateDistrict(b),
            lang === 'ar' ? 'ar' : 'en'
          );
        });
        setDistricts(sorted);
      })
      .catch(() => setDistricts([]));
  }, [lang]);

  const handleSearch = () => {
    onSearch(query, selectedLocation, selectedGender);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    onSearch(query, selectedLocation, gender);
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    onSearch(query, location, selectedGender);
  };

  const handleClearFilters = () => {
    setSelectedGender("");
    setSelectedLocation("");
    onSearch(query, "", "");
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-9" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="relative w-full">

        {/* Search Bar */}
        <div
          className="w-full h-16 rounded-3xl shadow-lg flex items-center gap-3 p-5"
          style={{ background: "linear-gradient(to right, #f0fdfa, #e6fffa)" }}
        >
          <button
            onClick={handleSearch}
            className="h-12 px-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex-shrink-0 flex items-center gap-2"
            style={{ background: "linear-gradient(to right, #0d9488, #0f766e)" }}
          >
            <Search className="h-4 w-4 text-white" />
            <span className="text-white font-semibold text-sm">{t('search')}</span>
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full h-12 text-base rounded-2xl border border-teal-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-100 bg-white text-gray-800 placeholder:text-gray-400 outline-none ${lang === 'ar' ? 'pr-10 pl-12' : 'pl-10 pr-12'}`}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        {/* Filter Button */}
        <div className="relative mt-4 flex justify-start w-full" dir="ltr">
          <button
            ref={filterButtonRef}
            data-filter-button
            onClick={onFilterToggle}
            className="inline-flex items-center text-teal-600 border border-teal-300 px-3 py-2 rounded-xl hover:bg-teal-50 transition-colors"
          >
            <Filter className={`h-5 w-5 ${lang === 'ar' ? 'ml-2' : 'mr-2'}`} />
            <span className="text-sm">{t('filter')}</span>
          </button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div
              ref={dropdownRef}
              className="absolute bg-white border border-gray-200 rounded-xl shadow-xl p-6"
              style={{ top: "110%", left: "0", width: "240px", zIndex: 9999 }}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
              <div className="space-y-5">
                <h3 className="text-base font-semibold text-gray-700 text-center">{t('filter')}</h3>

                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-3">{t('gymType')}</label>
                  <div className="space-y-3">
                    {['men','women'].map(type => (
                      <label key={type} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={GENDER_OPTIONS[type]}
                          checked={selectedGender === GENDER_OPTIONS[type]}
                          onChange={(e) => handleGenderChange(e.target.value)}
                          className={lang === 'ar' ? 'ml-3' : 'mr-3'} 
                          style={{ accentColor: '#0d9488' }}
                        />
                        <span className="text-sm text-gray-700">{t(type)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* District Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-3">{t('region')}</label>
                  <Listbox value={selectedLocation} onChange={handleLocationChange}>
                    <div className="relative">
                      <Listbox.Button className="w-full h-12 px-4 rounded-2xl border border-teal-300 bg-white text-sm text-gray-700 shadow-md flex justify-between items-center cursor-pointer hover:bg-teal-50 transition-all duration-200">
                        <span>{selectedLocation ? translateDistrict(selectedLocation) : t('chooseRegion')}</span>
                        <ChevronDown className="w-4 h-4 text-teal-600" />
                      </Listbox.Button>

                      <Listbox.Options
                        ref={(node) => {
                          listboxOptionsRef.current = node;
                          if (node) {
                            node.style.maxHeight = '180px';
                            node.style.overflowY = 'auto';
                            node.style.overflowX = 'hidden';
                          }
                        }}
                        className="absolute mt-2 w-full bg-white shadow-xl rounded-2xl border border-teal-200 z-[9999] py-2"
                        style={{ 
                          maxHeight: '180px',
                          overflowY: 'auto',
                          overflowX: 'hidden',
                          display: 'block'
                        }}
                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                      >
                        <Listbox.Option
                          value=""
                          className="px-4 py-2 text-sm text-gray-700 cursor-pointer rounded-lg hover:bg-teal-50"
                        >
                          {t('chooseRegion')}
                        </Listbox.Option>

                        {districts.map((district) => (
                          <Listbox.Option
                            key={district}
                            value={district}
                            className="px-4 py-2 text-sm text-gray-700 cursor-pointer rounded-lg hover:bg-teal-50"
                          >
                            {translateDistrict(district)}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>

                <button
                  onClick={handleClearFilters}
                  className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  {t('clearFilters')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
