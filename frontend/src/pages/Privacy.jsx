import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Privacy() {
  const { lang, t } = useLanguage();
  
  const privacyContent = {
    ar: {
      title: 'سياسة الخصوصية',
      lastUpdated: 'آخر تحديث',
      section1: {
        title: '1. مقدمة',
        content: 'نحن في GymFinder Riyadh نحترم خصوصيتك ونلتزم بحماية معلوماتك الشخصية. تشرح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك عند استخدام موقعنا.'
      },
      section2: {
        title: '2. المعلومات التي نجمعها',
        personalInfoTitle: 'المعلومات الشخصية:',
        personalInfoItems: ['الاسم والبريد الإلكتروني', 'رقم الهاتف (اختياري)', 'معلومات الملف الشخصي'],
        usageInfoTitle: 'معلومات الاستخدام:',
        usageInfoItems: ['عنوان IP والموقع الجغرافي', 'نوع المتصفح ونظام التشغيل', 'صفحات الموقع التي تزورها', 'وقت ومدة الزيارة']
      },
      section3: {
        title: '3. كيفية استخدام المعلومات',
        intro: 'نستخدم المعلومات التي نجمعها لـ:',
        items: [
          'توفير وتحسين خدماتنا',
          'إرسال رمز التحقق (OTP) لتسجيل الدخول',
          'الرد على استفساراتك وطلباتك',
          'تحليل استخدام الموقع لتحسين تجربة المستخدم',
          'منع الاحتيال وحماية أمن الموقع',
          'الامتثال للقوانين واللوائح المعمول بها'
        ]
      },
      section4: {
        title: '4. مشاركة المعلومات',
        content: 'نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية:',
        items: [
          'بموافقتك الصريحة',
          'للمزودين الخدمات الذين يعملون نيابة عنا',
          'عندما يكون ذلك مطلوباً بموجب القانون',
          'لحماية حقوقنا أو حقوق المستخدمين الآخرين'
        ]
      },
      section5: {
        title: '5. أمان المعلومات',
        content: 'نستخدم تدابير أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الكشف أو التدمير. ومع ذلك، لا يمكن ضمان الأمان المطلق على الإنترنت.'
      },
      section6: {
        title: '6. ملفات تعريف الارتباط (Cookies)',
        content: 'نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم وتذكر تفضيلاتك. يمكنك تعطيل ملفات تعريف الارتباط في إعدادات المتصفح، ولكن قد يؤثر ذلك على وظائف الموقع.'
      },
      section7: {
        title: '7. حقوقك',
        intro: 'لديك الحق في:',
        items: [
          'الوصول إلى معلوماتك الشخصية',
          'تصحيح المعلومات غير الدقيقة',
          'حذف معلوماتك الشخصية',
          'الاعتراض على معالجة معلوماتك',
          'سحب موافقتك في أي وقت'
        ]
      },
      section8: {
        title: '8. التعديلات على السياسة',
        content: 'قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإشعارك بأي تغييرات مهمة عبر الموقع أو البريد الإلكتروني.'
      },
      section9: {
        title: '9. الاتصال بنا',
        content: 'إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو كيفية معالجة معلوماتك، يرجى الاتصال بنا عبر صفحة الاتصال أو البريد الإلكتروني.'
      }
    },
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated',
      section1: {
        title: '1. Introduction',
        content: 'We at GymFinder Riyadh respect your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and protect your information when you use our website.'
      },
      section2: {
        title: '2. Information We Collect',
        personalInfoTitle: 'Personal Information:',
        personalInfoItems: ['Name and email', 'Phone number (optional)', 'Profile information'],
        usageInfoTitle: 'Usage Information:',
        usageInfoItems: ['IP address and geographic location', 'Browser type and operating system', 'Pages you visit', 'Time and duration of visit']
      },
      section3: {
        title: '3. How We Use Information',
        intro: 'We use the information we collect to:',
        items: [
          'Provide and improve our services',
          'Send verification codes (OTP) for login',
          'Respond to your inquiries and requests',
          'Analyze website usage to improve user experience',
          'Prevent fraud and protect website security',
          'Comply with applicable laws and regulations'
        ]
      },
      section4: {
        title: '4. Information Sharing',
        content: 'We do not sell, rent, or share your personal information with third parties except in the following cases:',
        items: [
          'With your explicit consent',
          'With service providers who work on our behalf',
          'When required by law',
          'To protect our rights or the rights of other users'
        ]
      },
      section5: {
        title: '5. Information Security',
        content: 'We use appropriate security measures to protect your personal information from unauthorized access, modification, disclosure, or destruction. However, absolute security cannot be guaranteed on the internet.'
      },
      section6: {
        title: '6. Cookies',
        content: 'We use cookies to improve user experience and remember your preferences. You can disable cookies in your browser settings, but this may affect website functionality.'
      },
      section7: {
        title: '7. Your Rights',
        intro: 'You have the right to:',
        items: [
          'Access your personal information',
          'Correct inaccurate information',
          'Delete your personal information',
          'Object to processing of your information',
          'Withdraw your consent at any time'
        ]
      },
      section8: {
        title: '8. Policy Modifications',
        content: 'We may update this privacy policy from time to time. We will notify you of any significant changes via the website or email.'
      },
      section9: {
        title: '9. Contact Us',
        content: 'If you have any questions about this privacy policy or how we process your information, please contact us through the contact page or email.'
      }
    }
  };
  
  const content = privacyContent[lang];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-teal-100 rounded-full">
                <Shield className="w-8 h-8 text-teal-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-teal-900 mb-4">{content.title}</h1>
            <p className="text-teal-600">{content.lastUpdated}: {new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <section>
              <h2 className="text-xl font-semibold text-teal-800 mb-4">{content.section1.title}</h2>
              <p className="text-gray-700 leading-relaxed">
                {content.section1.content}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-teal-800 mb-4">{content.section2.title}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-teal-700 mb-2">{content.section2.personalInfoTitle}</h3>
                  <ul className={`list-disc ${lang === 'ar' ? 'list-inside' : 'list-inside'} text-gray-700 space-y-1`}>
                    {content.section2.personalInfoItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-teal-700 mb-2">{content.section2.usageInfoTitle}</h3>
                  <ul className={`list-disc ${lang === 'ar' ? 'list-inside' : 'list-inside'} text-gray-700 space-y-1`}>
                    {content.section2.usageInfoItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-teal-800 mb-4">{content.section3.title}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {content.section3.intro}
              </p>
              <ul className={`list-disc ${lang === 'ar' ? 'list-inside' : 'list-inside'} text-gray-700 space-y-2`}>
                {content.section3.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-teal-800 mb-4">{content.section4.title}</h2>
              <p className="text-gray-700 leading-relaxed">
                {content.section4.content}
              </p>
              <ul className={`list-disc ${lang === 'ar' ? 'list-inside' : 'list-inside'} text-gray-700 space-y-2 mt-4`}>
                {content.section4.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-teal-800 mb-4">{content.section5.title}</h2>
              <p className="text-gray-700 leading-relaxed">
                {content.section5.content}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-teal-800 mb-4">{content.section6.title}</h2>
              <p className="text-gray-700 leading-relaxed">
                {content.section6.content}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-teal-800 mb-4">{content.section7.title}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {content.section7.intro}
              </p>
              <ul className={`list-disc ${lang === 'ar' ? 'list-inside' : 'list-inside'} text-gray-700 space-y-2`}>
                {content.section7.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-teal-800 mb-4">{content.section8.title}</h2>
              <p className="text-gray-700 leading-relaxed">
                {content.section8.content}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-teal-800 mb-4">{content.section9.title}</h2>
              <p className="text-gray-700 leading-relaxed">
                {content.section9.content}
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
