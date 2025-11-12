import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize from localStorage
  if (typeof window !== 'undefined' && user === null) {
    try {
      const raw = localStorage.getItem('auth_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.email) {
          // Ensure token is available
          if (!parsed.token) {
            const token = localStorage.getItem('auth_token');
            if (token) {
              parsed.token = token;
            }
          }
          // lazy set to avoid extra renders
          setUser(parsed);
        }
      }
    } catch (_) {}
  }

  const login = async (email, password) => {
    // Simple client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new Error('صيغة البريد الإلكتروني غير صحيحة');
    if (!password || password.length < 6) throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');

    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      // Check if response is ok before parsing JSON
      if (!response.ok) {
        let errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (_) {
          // If JSON parsing fails, use default message
          errorMessage = `خطأ في الخادم: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      const newUser = { 
        ...data.user, 
        token: data.access_token
      };
      
      setUser(newUser);
      try { 
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        localStorage.setItem('auth_token', data.access_token);
      } catch (_) {}
      return { ok: true };
    } catch (error) {
      // Handle network errors (backend not running, CORS, etc.)
      if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
        throw new Error('تعذر الاتصال بالخادم. يرجى التأكد من تشغيل الخادم.');
      }
      throw new Error(error.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, favoriteFood, password, gender) => {
    // Simple client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || name.trim().length < 2) throw new Error('الاسم يجب أن يكون حرفين على الأقل');
    if (!emailRegex.test(email)) throw new Error('صيغة البريد الإلكتروني غير صحيحة');
    if (!favoriteFood || favoriteFood.trim().length < 2) throw new Error('اسم الطعام المفضل يجب أن يكون حرفين على الأقل');
    if (!gender || !gender.trim()) throw new Error('الجنس مطلوب');
    if (!password || password.length < 6) throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');

    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, favorite_food: favoriteFood, password, gender }),
      });
      
      if (!response.ok) {
        let errorMessage = 'فشل في إنشاء الحساب';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (_) {
          errorMessage = `خطأ في الخادم: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return { ok: true, message: data.message };
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
        throw new Error('تعذر الاتصال بالخادم. يرجى التأكد من تشغيل الخادم.');
      }
      throw new Error(error.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email, favoriteFood, newPassword) => {
    // Simple client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new Error('صيغة البريد الإلكتروني غير صحيحة');
    if (!favoriteFood || favoriteFood.trim().length < 2) throw new Error('اسم الطعام المفضل يجب أن يكون حرفين على الأقل');
    if (!newPassword || newPassword.length < 6) throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');

    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, favorite_food: favoriteFood, new_password: newPassword }),
      });
      
      if (!response.ok) {
        let errorMessage = 'فشل في تغيير كلمة المرور';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (_) {
          errorMessage = `خطأ في الخادم: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return { ok: true, message: data.message };
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
        throw new Error('تعذر الاتصال بالخادم. يرجى التأكد من تشغيل الخادم.');
      }
      throw new Error(error.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const updateName = async (newName) => {
    if (!newName || newName.trim().length < 2) throw new Error('الاسم يجب أن يكون حرفين على الأقل');
    if (!user || !user.token) throw new Error('يجب تسجيل الدخول أولاً');

    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/users/me/name', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: newName }),
      });
      
      if (!response.ok) {
        let errorMessage = 'فشل في تحديث الاسم';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (_) {
          errorMessage = `خطأ في الخادم: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser);
      try { 
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      } catch (_) {}
      return { ok: true, message: data.message };
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
        throw new Error('تعذر الاتصال بالخادم. يرجى التأكد من تشغيل الخادم.');
      }
      throw new Error(error.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    if (!currentPassword) throw new Error('يجب إدخال كلمة المرور الحالية');
    if (!newPassword || newPassword.length < 6) throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    if (!user || !user.token) throw new Error('يجب تسجيل الدخول أولاً');

    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/users/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      
      if (!response.ok) {
        let errorMessage = 'فشل في تحديث كلمة المرور';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (_) {
          errorMessage = `خطأ في الخادم: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return { ok: true, message: data.message };
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
        throw new Error('تعذر الاتصال بالخادم. يرجى التأكد من تشغيل الخادم.');
      }
      throw new Error(error.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const updateGender = async (newGender) => {
    if (!user || !user.token) throw new Error('يجب تسجيل الدخول أولاً');

    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/users/me/gender', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ gender: newGender || null }),
      });
      
      if (!response.ok) {
        let errorMessage = 'فشل في تحديث الجنس';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (_) {
          errorMessage = `خطأ في الخادم: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser);
      try { 
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      } catch (_) {}
      return { ok: true, message: data.message };
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
        throw new Error('تعذر الاتصال بالخادم. يرجى التأكد من تشغيل الخادم.');
      }
      throw new Error(error.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    try { 
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    } catch (_) {}
  };

  const value = useMemo(() => ({ 
    user, 
    login, 
    register, 
    resetPassword,
    updateName,
    updatePassword,
    updateGender,
    logout, 
    isLoading 
  }), [user, isLoading]);
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}