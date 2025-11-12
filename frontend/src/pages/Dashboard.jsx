import { useAuth } from '../context/AuthContext.jsx';
import { Dumbbell, User, Edit2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';

export default function Dashboard() {
  const { lang, t } = useLanguage();
  const { user, logout, updateName, updatePassword, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [editingName, setEditingName] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setNewName(user.name || '');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditName = () => {
    setEditingName(true);
    setNewName(user?.name || '');
    setError('');
    setSuccess('');
  };

  const handleCancelEditName = () => {
    setEditingName(false);
    setNewName(user?.name || '');
    setError('');
  };

  const handleSaveName = async () => {
    if (!newName || newName.trim().length < 2) {
      setError(lang === 'ar' ? 'الاسم يجب أن يكون حرفين على الأقل' : 'Name must be at least 2 characters');
      return;
    }
    
    try {
      const result = await updateName(newName.trim());
      setSuccess(result.message || (lang === 'ar' ? 'تم تحديث الاسم بنجاح' : 'Name updated successfully'));
      setError('');
      setEditingName(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || (lang === 'ar' ? 'فشل في تحديث الاسم' : 'Failed to update name'));
      setSuccess('');
    }
  };

  const handleEditPassword = () => {
    setEditingPassword(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const handleCancelEditPassword = () => {
    setEditingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleSavePassword = async () => {
    if (!currentPassword) {
      setError(lang === 'ar' ? 'يجب إدخال كلمة المرور الحالية' : 'Please enter current password');
      return;
    }
    
    if (!newPassword || newPassword.length < 6) {
      setError(lang === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }
    
    try {
      const result = await updatePassword(currentPassword, newPassword);
      setSuccess(result.message || (lang === 'ar' ? 'تم تحديث كلمة المرور بنجاح' : 'Password updated successfully'));
      setError('');
      setEditingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || (lang === 'ar' ? 'فشل في تحديث كلمة المرور' : 'Failed to update password'));
      setSuccess('');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-teal-100 rounded-full">
                <Dumbbell className="w-8 h-8 text-teal-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-teal-900 mb-4">{t('welcomeToDashboard')}</h1>
            <p className="text-teal-600">{t('welcomeUser')} {user?.name}، {t('exploreGyms')}</p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-200 rounded-lg text-green-800 text-center">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-200 rounded-lg text-red-800 text-center">
              {error}
            </div>
          )}

          {/* Dashboard Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex justify-center">
              {/* User Info Card */}
              <div className="bg-teal-50 rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <User className={`w-6 h-6 text-teal-600 ${lang === 'ar' ? 'mr-3' : 'ml-3'}`} />
                    <h3 className="text-lg font-semibold text-teal-800">{t('myAccount')}</h3>
                  </div>
                </div>
                <div className="space-y-4 text-teal-700">
                  {/* Name Field */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <strong>{lang === 'ar' ? 'الاسم:' : 'Name:'}</strong>
                      {!editingName ? (
                        <button
                          onClick={handleEditName}
                          className="text-teal-600 hover:text-teal-800 transition-colors"
                          disabled={isLoading}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveName}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            disabled={isLoading}
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEditName}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    {editingName ? (
                      <Input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full"
                        disabled={isLoading}
                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                      />
                    ) : (
                      <p>{user?.name}</p>
                    )}
                  </div>

                  {/* Email Field (read-only) */}
                  <div>
                    <strong>{t('email')}:</strong>
                    <p className="mt-1">{user?.email}</p>
                  </div>

                  {/* Gender Field (read-only) */}
                  <div>
                    <strong>{t('gender')}:</strong>
                    <p className="mt-1">
                      {user?.gender 
                        ? (user.gender === 'Male' || user.gender === 'Men' 
                            ? (lang === 'ar' ? 'ذكر' : 'Male')
                            : user.gender === 'Female' || user.gender === 'Women'
                            ? (lang === 'ar' ? 'أنثى' : 'Female')
                            : user.gender === 'Mixed'
                            ? (lang === 'ar' ? 'مختلط' : 'Mixed')
                            : user.gender)
                        : (lang === 'ar' ? 'غير محدد' : 'Not set')
                      }
                    </p>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <strong>{lang === 'ar' ? 'كلمة المرور:' : 'Password:'}</strong>
                      {!editingPassword ? (
                        <button
                          onClick={handleEditPassword}
                          className="text-teal-600 hover:text-teal-800 transition-colors"
                          disabled={isLoading}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSavePassword}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            disabled={isLoading}
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEditPassword}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    {editingPassword ? (
                      <div className="space-y-3">
                        <Input
                          type="password"
                          placeholder={lang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full"
                          disabled={isLoading}
                        />
                        <Input
                          type="password"
                          placeholder={lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full"
                          disabled={isLoading}
                        />
                        <Input
                          type="password"
                          placeholder={lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full"
                          disabled={isLoading}
                        />
                      </div>
                    ) : (
                      <p className="text-gray-500">••••••••</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="mt-8 p-6 bg-gradient-to-r from-teal-100 to-green-100 rounded-lg">
              <h3 className="text-xl font-semibold text-teal-800 mb-3">{t('welcomeMessage')}</h3>
              <p className="text-teal-700 leading-relaxed">
                {t('accountCreatedSuccess')}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

