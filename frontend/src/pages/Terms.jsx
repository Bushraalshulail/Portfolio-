import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Terms() {
  const { lang, t } = useLanguage();
  
  const termsContent = {
    ar: {
      title: 'شروط الاستخدام',
      lastUpdated: 'آخر تحديث',
      section1: {
        title: '1. قبول الشروط',
        content: 'بوصولك واستخدامك لموقع GymFinder Riyadh، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على أي من هذه الشروط، فيرجى عدم استخدام الموقع.'
      },
      section2: {
        title: '2. وصف الخدمة',
        content: 'GymFinder Riyadh هو منصة إلكترونية تهدف إلى مساعدة المستخدمين في العثور على الأندية الرياضية في مدينة الرياض. نحن نقدم معلومات عن الأندية الرياضية ومراجعات المستخدمين وخدمات أخرى ذات صلة.'
      },
      section3: {
        title: '3. استخدام الموقع',
        intro: 'عند استخدام موقعنا، يجب عليك:',
        items: [
          'تقديم معلومات صحيحة ودقيقة عند التسجيل',
          'استخدام الموقع لأغراض قانونية فقط',
          'عدم محاولة الوصول غير المصرح به إلى أنظمة الموقع',
          'عدم نشر محتوى مسيء أو غير لائق',
          'احترام حقوق الملكية الفكرية للآخرين'
        ]
      },
      section4: {
        title: '4. الخصوصية',
        content: 'نحن نحترم خصوصيتك ونلتزم بحماية معلوماتك الشخصية. يرجى مراجعة سياسة الخصوصية الخاصة بنا لفهم كيفية جمع واستخدام وحماية معلوماتك.'
      },
      section5: {
        title: '5. إخلاء المسؤولية',
        content: 'نحن لا نضمن دقة أو اكتمال المعلومات المقدمة على الموقع. المستخدمون مسؤولون عن التحقق من صحة المعلومات قبل اتخاذ أي قرارات.'
      },
      section6: {
        title: '6. التعديلات',
        content: 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعار المستخدمين بأي تغييرات مهمة عبر الموقع أو البريد الإلكتروني.'
      },
      section7: {
        title: '7. الاتصال بنا',
        content: 'إذا كان لديك أي أسئلة حول شروط الاستخدام هذه، يرجى الاتصال بنا عبر صفحة الاتصال أو البريد الإلكتروني.'
      }
    },
    en: {
      title: 'Terms of Use',
      lastUpdated: 'Last Updated',
      section1: {
        title: '1. Acceptance of Terms',
        content: 'By accessing and using the GymFinder Riyadh website, you agree to be bound by these terms of use. If you do not agree to any of these terms, please do not use the website.'
      },
      section2: {
        title: '2. Service Description',
        content: 'GymFinder Riyadh is an electronic platform that aims to help users find sports clubs in Riyadh city. We provide information about sports clubs, user reviews, and other related services.'
      },
      section3: {
        title: '3. Website Usage',
        intro: 'When using our website, you must:',
        items: [
          'Provide accurate and correct information upon registration',
          'Use the website for lawful purposes only',
          'Not attempt unauthorized access to the website\'s systems',
          'Not post offensive or inappropriate content',
          'Respect the intellectual property rights of others'
        ]
      },
      section4: {
        title: '4. Privacy',
        content: 'We respect your privacy and are committed to protecting your personal information. Please review our privacy policy to understand how we collect, use, and protect your information.'
      },
      section5: {
        title: '5. Disclaimer',
        content: 'We do not guarantee the accuracy or completeness of information provided on the website. Users are responsible for verifying the validity of information before making any decisions.'
      },
      section6: {
        title: '6. Modifications',
        content: 'We reserve the right to modify these terms at any time. Users will be notified of any significant changes via the website or email.'
      },
      section7: {
        title: '7. Contact Us',
        content: 'If you have any questions about these terms of use, please contact us through the contact page or email.'
      }
    }
  };
  
  const content = termsContent[lang];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-teal-100 rounded-full">
                <FileText className="w-8 h-8 text-teal-600" />
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
              <p className="text-gray-700 leading-relaxed">
                {content.section2.content}
              </p>
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
              <p className="text-gray-700 leading-relaxed">
                {content.section7.content}
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

