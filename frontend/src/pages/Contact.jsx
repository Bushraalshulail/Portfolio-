import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { contactAPI } from '../config/api';
import { Mail, Send, CheckCircle, AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';


export default function Contact() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      await contactAPI.sendMessage({
        user_id: user?.id || null,
        name: formData.name,
        email: formData.email,
        message: formData.message
      });

      setMessage(t('messageSentSuccess'));
      setMessageType('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setMessage(t('messageSentError'));
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {/* Back to Home Button */}
        <div className="mb-8">
          <Link to="/">
            <button className="inline-flex items-center bg-white text-teal-600 hover:bg-teal-50 rounded-xl px-4 py-2 border border-teal-200 transition-all duration-200 hover:shadow-md">
              <ArrowLeft className={`h-4 w-4 ${lang === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t('backToHome')}
            </button>
          </Link>
        </div>

      <h1 className="text-3xl text-teal-900 mb-8">{t('contactUs')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl text-teal-800 mb-4">{t('contactInfo')}</h2>
          <div className="space-y-4">
            <p className="text-teal-700 leading-relaxed">
              {lang === 'ar' 
                ? 'يسعدنا تواصلك لاقتراحات الأندية أو الشراكات. نحن هنا لمساعدتك في العثور على أفضل الأندية الرياضية في الرياض.'
                : 'We\'d love to hear from you for gym suggestions or partnerships. We\'re here to help you find the best gyms in Riyadh.'}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl text-teal-800 mb-6">{t('sendMessage')}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">{t('name')}</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-1"
                placeholder={t('namePlaceholder')}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            
            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="mt-1"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
            
            <div>
              <Label htmlFor="message">{t('message')}</Label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder={t('messagePlaceholder')}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full cursor-pointer text-white font-semibold hover:shadow-lg transition-all duration-200"
              style={{
                background: 'linear-gradient(to right, #0d9488, #0f766e)'
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className={`animate-spin rounded-full h-4 w-4 border-b-2 border-white ${lang === 'ar' ? 'ml-2' : 'mr-2'}`}></div>
                  {t('sending')}
                </div>
              ) : (
                <>
                  {t('send')}
                </>
              )}
            </Button>
            
            {message && (
              <div className={`p-4 rounded-md flex items-center space-x-2 rtl:space-x-reverse ${
                messageType === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {messageType === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{message}</span>
              </div>
            )}
          </form>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}


