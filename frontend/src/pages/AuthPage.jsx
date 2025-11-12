import { useState } from 'react';
import { Mail, Lock, User, Utensils, Dumbbell, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { Button } from '../components/ui/button';
import { useLanguage } from '../context/LanguageContext.jsx';

export function AuthPage() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [favoriteFood, setFavoriteFood] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

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

  const validateEmail = () => {
    const errors = {};
    const allowedDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];
    
    if (!email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        errors.email = 'الرجاء إدخال بريد إلكتروني صحيح';
      } else {
        if (!/^[a-zA-Z0-9._%+-@]+$/.test(email)) {
          errors.email = 'الرجاء إدخال بريد إلكتروني صحيح';
        } else {
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

  const validatePassword = () => {
    const errors = {};
    if (!password.trim()) {
      errors.password = 'كلمة المرور مطلوبة';
    } else if (password.length < 6) {
      errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateName = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'الاسم مطلوب';
    } else if (name.trim().length < 2) {
      errors.name = 'الاسم يجب أن يكون حرفين على الأقل';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateGender = () => {
    const errors = {};
    if (!gender || !gender.trim()) {
      errors.gender = lang === 'ar' ? 'الجنس مطلوب' : 'Gender is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateEmail() || !validatePassword()) {
      return;
    }
    
    try {
      await login(email, password);
      setSuccess('تم تسجيل الدخول بنجاح');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setError(err.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateName() || !validateEmail() || !validateFavoriteFood() || !validateGender() || !validatePassword()) {
      return;
    }
    
    try {
      const result = await register(name, email, favoriteFood, password, gender);
      
      // Auto-login after successful registration
      try {
        await login(email, password);
        setSuccess(lang === 'ar' ? 'تم إنشاء الحساب وتسجيل الدخول بنجاح' : 'Account created and logged in successfully');
        setTimeout(() => navigate('/'), 1000);
      } catch (loginErr) {
        // If auto-login fails, show error and switch to login mode
        setError(loginErr.message || (lang === 'ar' ? 'تم إنشاء الحساب بنجاح، لكن فشل تسجيل الدخول. يرجى تسجيل الدخول يدوياً' : 'Account created successfully, but auto-login failed. Please login manually'));
        setTimeout(() => {
          setMode('login');
          setEmail(email); // Keep email filled for convenience
          setPassword(''); // Clear password for security
          setName('');
          setFavoriteFood('');
          setGender('');
          setError('');
          setSuccess('');
        }, 3000);
      }
    } catch (err) {
      setError(err.message || (lang === 'ar' ? 'فشل في إنشاء الحساب' : 'Failed to create account'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">

            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-teal-100 rounded-full">
                  <Dumbbell className="w-8 h-8 text-teal-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-teal-900 mb-2">
                {mode === 'login' ? t('welcome') : t('createNewAccount')}
              </h1>
              <p className="text-teal-600">
                {mode === 'login' 
                  ? t('loginToAccount')
                  : t('createAccountToStart')}
              </p>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800">{success}</span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg flex items-center space-x-2 rtl:space-x-reverse">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
            )}

            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
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
                  <Label htmlFor="password" className="text-sm font-medium text-teal-700">
                    {t('password')}
                  </Label>
                  <div className="relative mt-1">
                    <Lock className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400`} />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${lang === 'ar' ? 'pr-10' : 'pl-10'} ${validationErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-teal-300 focus:border-teal-500 focus:ring-teal-500'}`}
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="text-white font-semibold py-3 rounded-xl w-full transition-all duration-200 hover:opacity-90"
                  style={{
                    background: 'linear-gradient(to right, #2EC4B6, #1CA89E)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {t('loginButton')}
                </button>

                <div className="text-center space-y-6">
                  <div>
                    <Link 
                      to="/forgot-password"
                      className="text-sm text-teal-600 hover:text-teal-800 transition-colors"
                    >
                      {t('forgotPassword')}
                    </Link>
                  </div>
                  <p className="text-sm text-teal-600">
                    {t('noAccount')}{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-green-600 hover:text-green-800 font-medium transition-colors"
                    >
                      {t('createNewAccountLink')}
                    </button>
                  </p>
                </div>
              </form>
            )}

            {mode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-teal-700">
                    {t('name')}
                  </Label>
                  <div className="relative mt-1">
                    <User className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400`} />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`${lang === 'ar' ? 'pr-10' : 'pl-10'} ${validationErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-teal-300 focus:border-teal-500 focus:ring-teal-500'}`}
                      placeholder={t('fullName')}
                      disabled={isLoading}
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
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
                  <Label className="text-sm font-medium text-teal-700 block mb-2">
                    {t('gender')}
                  </Label>
                  <div className="flex gap-3 mt-1" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <button
                      type="button"
                      onClick={() => setGender('Male')}
                      disabled={isLoading}
                      className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out ${
                        gender === 'Male'
                          ? 'bg-teal-600 text-teal-900 shadow-md'
                          : 'bg-teal-100 text-teal-700 border-2 border-teal-300 hover:border-teal-500 hover:bg-teal-200'
                      } ${validationErrors.gender ? 'border-red-300' : ''}`}
                      style={gender === 'Male' ? { backgroundColor: '#0d9488', color: '#0f766e' } : {}}
                    >
                      {lang === 'ar' ? 'ذكر' : 'Male'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('Female')}
                      disabled={isLoading}
                      className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out ${
                        gender === 'Female'
                          ? 'bg-teal-600 text-teal-900 shadow-md'
                          : 'bg-teal-100 text-teal-700 border-2 border-teal-300 hover:border-teal-500 hover:bg-teal-200'
                      } ${validationErrors.gender ? 'border-red-300' : ''}`}
                      style={gender === 'Female' ? { backgroundColor: '#0d9488', color: '#0f766e' } : {}}
                    >
                      {lang === 'ar' ? 'أنثى' : 'Female'}
                    </button>
                  </div>
                  {validationErrors.gender && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.gender}</p>
                  )}
                </div>

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
                  <Label htmlFor="password" className="text-sm font-medium text-teal-700">
                    {t('password')}
                  </Label>
                  <div className="relative mt-1">
                    <Lock className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400`} />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${lang === 'ar' ? 'pr-10' : 'pl-10'} ${validationErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-teal-300 focus:border-teal-500 focus:ring-teal-500'}`}
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="text-white font-semibold py-3 rounded-xl w-full transition-all duration-200 hover:opacity-90"
                  style={{
                    background: 'linear-gradient(to right, #2EC4B6, #1CA89E)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {t('createAccount')}
                </button>

                <div className="text-center">
                  <p className="text-sm text-teal-600">
                    {t('haveAccount')}{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-green-600 hover:text-green-800 font-medium transition-colors"
                    >
                      {t('loginButton')}
                    </button>
                  </p>
                </div>
              </form>
            )}

            <div className="mt-4 text-center">
              <div className="flex justify-center space-x-4 rtl:space-x-reverse text-xs text-teal-500">
                <Link to="/terms" className="hover:text-teal-700 transition-colors">
                  {t('termsOfUse')}
                </Link>
                <span>|</span>
                <Link to="/privacy" className="hover:text-teal-700 transition-colors">
                  {t('privacyPolicy')}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
