import bfitLogo from '../assets/d3b1028a47668228bf858f8c032536fe7a0134c6.png';
import xfitLogo from '../assets/72f93611e4890f2a567791be4cd02e667d2f15b3.png';
import nineRoundLogo from '../assets/e01f820f13caf643937ea24c26cbd4b99eee56d0.png';
import faresAcademyLogo from '../assets/858277a8e736fc21ccaf930f527dbaaabc75d2c0.png';
import bodyMastersLogo from '../assets/844fa08546a6c8c21febfd95755427c686db4d1d.png';
import gymNationLogo from '../assets/56d8c44b277797ddcaa54778ac3d675fe51ac9ed.png';
import bodyMotionsLogo from '../assets/58fc0da8fda1e94fa82cbd53a16df51577d001d8.png';
import fitnessTimeLogo from '../assets/d48b0df0ec6cd8cb8e2d66c61cee3f7e4187723a.png';
import puregym from '../assets/puregym.jpg';

// تعريف مصفوفة الاندية
export const mockGyms = [
  {
    id: "1",
    nameArabic: "نادي وقت اللياقة",
    nameEnglish: "Fitness Time",
    location: "حي الملقا، الرياض",
    rating: 4.5,
    image: fitnessTimeLogo,
    facilities: ["مسبح سباحة", "واي فاي مجاني", "موقف سيارات", "تدريب شخصي", "تمارين جماعية", "ساونا"],
    equipment: ["أجهزة كارديو", "أوزان حرة", "أجهزة قوة", "تدريب وظيفي"],
    hours: "5:00 صباحاً - 12:00 منتصف الليل",
    description: "نادي رياضي متطور مع أحدث المعدات والمدربين المحترفين في قلب الرياض.",
    phone: "+966 11 123 4567",
    website: "www.waqtfitness.com.sa",
    gender: "مختلط"
  },

  {
    id: "2",
    nameArabic: "أكاديمية فارس",
    nameEnglish: "Fares Academy",
    location: "حي النرجس، الرياض",
    rating: 4.3,
    image: faresAcademyLogo,
    facilities: ["وصول 24/7", "واي فاي مجاني", "موقف سيارات", "تدريب شخصي", "غرفة بخار"],
    equipment: ["أجهزة كارديو", "أوزان حرة", "أجهزة قوة", "منطقة تمارين جماعية"],
    hours: "24 ساعة",
    description: "أكاديمية تدريب شاملة تقدم برامج متخصصة للتطوير البدني والرياضي.",
    phone: "+966 11 234 5678",
    website: "www.faresacademy.com.sa",
    gender: "رجال"
  },
  
   {
    id: "3",
    nameArabic: "إكس فت",
    nameEnglish: "XFit",
    location: "حي العليا، الرياض",
    rating: 4.7,
    image: xfitLogo,
    facilities: ["مسبح سباحة", "واي فاي مجاني", "موقف سيارات", "تمارين جماعية", "تدريب شخصي", "ساونا", "غرفة بخار"],
    equipment: ["أجهزة كارديو متطورة", "أوزان حرة", "أجهزة قوة", "معدات استوديو"],
    hours: "6:00 صباحاً - 11:00 مساءً",
    description: "نادي رياضي عصري مع مرافق متكاملة وتجربة تدريب فريدة.",
    phone: "+966 11 345 6789",
    website: "www.xfit.com.sa",
    gender: "مختلط"
  },
  {
    id: "4",
    nameArabic: "بي فت",
    nameEnglish: "B-Fit",
    location: "حي المربع، الرياض",
    rating: 4.2,
    image: bfitLogo,
    facilities: ["واي فاي مجاني", "موقف سيارات", "تدريب شخصي", "تمارين جماعية"],
    equipment: ["أوزان حرة", "أجهزة قوة", "تدريب وظيفي", "أجهزة كارديو"],
    hours: "5:00 صباحاً - 11:00 مساءً",
    description: "نادي رياضي يركز على القوة مع معدات متخصصة لرياضة كمال الأجسام.",
    phone: "+966 11 456 7890",
    website: "www.befit.com.sa",
    gender: "رجال"
  },
  {
    id: "5",
    nameArabic: "ناين راوند",
    nameEnglish: "9 Round",
    location: "حي النخيل، الرياض",
    rating: 4.6,
    image: nineRoundLogo,
    facilities: ["مسبح سباحة", "وصول 24/7", "واي فاي مجاني", "موقف سيارات", "تدريب شخصي", "تمارين جماعية"],
    equipment: ["أجهزة كارديو", "أوزان حرة", "أجهزة قوة", "معدات استوديو", "تدريب وظيفي"],
    hours: "24 ساعة",
    description: "نادي لياقة فاخر يقدم مرافق متميزة وبرامج تدريب مخصصة.",
    phone: "+966 11 567 8901",
    website: "www.9round.com.sa",
    gender: "مختلط"
  },
  {
    id: "6",
    nameArabic: "بودي ماسترز",
    nameEnglish: "Body Masters",
    location: "حي الصحافة، الرياض",
    rating: 4.1,
    image: bodyMastersLogo,
    facilities: ["واي فاي مجاني", "موقف سيارات", "تمارين جماعية", "تدريب شخصي"],
    equipment: ["أجهزة كارديو", "أوزان حرة", "تدريب وظيفي", "أجهزة قوة"],
    hours: "6:00 صباحاً - 10:00 مساءً",
    description: "نادي رياضي بأسعار معقولة مع معدات حديثة وأجواء ودية.",
    phone: "+966 11 678 9012",
    website: "www.bodymasters.com.sa",
    gender: "رجال"
  },
  {
    id: "7",
    nameArabic: "بودي موشنز",
    nameEnglish: "Body Motions",
    location: "حي الازدهار، الرياض",
    rating: 4.4,
    image: bodyMotionsLogo,
    facilities: ["مسبح سباحة", "واي فاي مجاني", "موقف سيارات", "ساونا", "غرفة بخار", "تدريب شخصي"],
    equipment: ["أجهزة كارديو حديثة", "أوزان حرة", "أجهزة قوة", "منطقة يوغا"],
    hours: "5:30 صباحاً - 11:30 مساءً",
    description: "نادي نسائي متكامل يقدم تجربة تدريب مميزة ومرافق حديثة.",
    phone: "+966 11 789 0123",
    website: "www.bodymotions.com.sa",
    gender: "نساء"
  },
  {
    id: "8",
    nameArabic: "بيور جيم",
    nameEnglish: "PureGym",
    location: "حي الياسمين، الرياض",
    rating: 4.4,
    image: puregym,
    facilities: ["مسبح سباحة", "واي فاي مجاني", "موقف سيارات", "ساونا", "غرفة بخار", "تدريب شخصي"],
    equipment: ["أجهزة كارديو حديثة", "أوزان حرة", "أجهزة قوة", "منطقة يوغا"],
    hours: "5:30 صباحاً - 11:30 مساءً",
    description: "نادي رياضي شامل يهدف إلى تحقيق اللياقة البدنية المثالية.",
    phone: "+966 11 789 0123",
    website: "www.puregymarabia.com.sa",
    gender: "مختلط"
  },
  {
    id: "9",
    nameArabic: "جيمينيشن",
    nameEnglish: "GymNation",
    location: "حي الورود، الرياض",
    rating: 4.8,
    image: gymNationLogo,
    facilities: ["وصول 24/7", "مسبح سباحة", "واي فاي مجاني", "موقف سيارات", "ساونا", "غرفة بخار", "تدريب شخصي", "تمارين جماعية"],
    equipment: ["أجهزة كارديو متطورة", "أوزان حرة احترافية", "أجهزة قوة", "معدات كروس فت", "تدريب وظيفي"],
    hours: "24 ساعة",
    description: "أحد أفضل الأندية الرياضية في الرياض مع مرافق عالمية ومعدات حديثة.",
    phone: "+966 11 890 1234",
    website: "www.gymnation.com.sa",
    gender: "مختلط"
  }

]
