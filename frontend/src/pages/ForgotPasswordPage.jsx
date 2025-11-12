import { useState } from 'react';
import { Mail, Utensils, Dumbbell, ArrowRight, CheckCircle, AlertCircle, Loader2, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function ForgotPasswordPage() {
  const { lang, t } = useLanguage();
  const { resetPassword, isLoading } = useAuth();
  const navigate = useNavigate();
  // Removed step state - single form now
  const [email, setEmail] = useState('');
  const [favoriteFood, setFavoriteFood] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validateEmail = () => {
    const errors = {};
    const allowedDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];
    
    if (!email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else {
      // Check basic format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        errors.email = 'الرجاء إدخال بريد إلكتروني صحيح';
      } else {
        // Check if email contains only English characters
        if (!/^[a-zA-Z0-9._%+-@]+$/.test(email)) {
          errors.email = 'الرجاء إدخال بريد إلكتروني صحيح';
        } else {
          // Check domain
          const domain = email.split('@')[1]?.toLowerCase();
          if (!domain || !allowedDomains.includes(domain)) {
            errors.email = 'الرجاء إدخال بريد إلكتروني صحيح';
          }
        }
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateFavoriteFood = () => {
    const errors = {};
    if (!favoriteFood.trim()) {
      errors.favoriteFood = t('favoriteFoodRequired');
    } else if (favoriteFood.trim().length < 2) {
      errors.favoriteFood = t('favoriteFoodMinLength');
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswords = () => {
    const errors = {};
    if (!newPassword.trim()) {
      errors.newPassword = 'كلمة المرور الجديدة مطلوبة';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    
    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'كلمة المرور غير متطابقة';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateEmail() || !validateFavoriteFood() || !validatePasswords()) {
      return;
    }
    
    try {
      const result = await resetPassword(email, favoriteFood, newPassword);
      setSuccess(result.message || (lang === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully'));
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (err) {
      setError(err.message || (lang === 'ar' ? 'فشل في تغيير كلمة المرور' : 'Failed to reset password'));
    }
  };

  // Reset form function removed - no longer needed with single form

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-teal-100 rounded-full">
                  <Dumbbell className="w-8 h-8 text-teal-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-teal-900 mb-2">
                {t('forgotPassword')}
              </h1>
              <p className="text-teal-600">
                {lang === 'ar' 
                  ? 'أدخل بريدك الإلكتروني واسم طعامك المفضل لإعادة تعيين كلمة المرور'
                  : 'Enter your email and favorite food to reset your password'}
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg flex items-center space-x-2 rtl:space-x-reverse">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
            )}

            {/* Reset Password Form */}
            <form onSubmit={handleResetPassword} className="space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-teal-700">
                  {t('email')}
                </Label>
                <div className="relative mt-1">
                  <Mail className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400`} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${lang === 'ar' ? 'pr-10' : 'pl-10'} ${validationErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-teal-300 focus:border-teal-500 focus:ring-teal-500'}`}
                    placeholder="example@email.com"
                    disabled={isLoading}
                    dir="ltr"
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="favoriteFood" className="text-sm font-medium text-teal-700">
                  {t('favoriteFood')}
                </Label>
                <div className="relative mt-1">
                  <Utensils className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400`} />
                  <Input
                    id="favoriteFood"
                    type="text"
                    value={favoriteFood}
                    onChange={(e) => setFavoriteFood(e.target.value)}
                    className={`${lang === 'ar' ? 'pr-10' : 'pl-10'} ${validationErrors.favoriteFood ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-teal-300 focus:border-teal-500 focus:ring-teal-500'}`}
                    placeholder={t('favoriteFoodPlaceholder')}
                    disabled={isLoading}
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                {validationErrors.favoriteFood && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.favoriteFood}</p>
                )}
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-sm font-medium text-teal-700">
                  {t('newPassword')}
                </Label>
                <div className="relative mt-1">
                  <Lock className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400`} />
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`${lang === 'ar' ? 'pr-10' : 'pl-10'} ${validationErrors.newPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-teal-300 focus:border-teal-500 focus:ring-teal-500'}`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.newPassword}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-teal-700">
                  {t('confirmPassword')}
                </Label>
                <div className="relative mt-1">
                  <Lock className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400`} />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${lang === 'ar' ? 'pr-10' : 'pl-10'} ${validationErrors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-teal-300 focus:border-teal-500 focus:ring-teal-500'}`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="text-white font-semibold py-3 rounded-lg w-full transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'linear-gradient(to right, #2EC4B6, #1CA89E)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className={`w-4 h-4 animate-spin ${lang === 'ar' ? 'ml-2' : 'mr-2'}`} />
                    {lang === 'ar' ? 'جاري التغيير...' : 'Changing...'}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {t('changePassword')}
                    <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'mr-2' : 'ml-2'}`} />
                  </div>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link 
                to="/auth" 
                className="text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors"
              >
                {lang === 'ar' ? '← العودة لتسجيل الدخول' : '← Back to Login'}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
