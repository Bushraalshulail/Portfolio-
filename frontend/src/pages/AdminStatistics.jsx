import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function AdminStatistics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is admin
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      // Try to get token from localStorage and redirect to auto-login
      const authToken = localStorage.getItem('auth_token');
      if (authToken) {
        window.location.href = `http://127.0.0.1:8000/admin/auto-login?token=${encodeURIComponent(authToken)}&redirect=${encodeURIComponent(window.location.href)}`;
        return;
      }
      navigate('/auth');
      return;
    }

    fetchStatistics();
  }, [user, navigate]);

  // Handle dropdown menu click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const container = document.getElementById('user-menu-container');
      const dropdown = document.getElementById('user-menu-dropdown');
      
      if (container && dropdown && !container.contains(event.target)) {
        dropdown.classList.add('hidden');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from user or localStorage
      const token = user?.token || localStorage.getItem('auth_token');
      if (!token) {
        // Try to set admin cookies first via auto-login
        const authToken = localStorage.getItem('auth_token');
        if (authToken) {
          // Redirect to auto-login to set cookies, then come back
          window.location.href = `http://127.0.0.1:8000/admin/auto-login?token=${encodeURIComponent(authToken)}&redirect=${encodeURIComponent(window.location.href)}`;
          return;
        }
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/admin/statistics`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for admin authentication
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Try auto-login to set cookies
          const authToken = localStorage.getItem('auth_token');
          if (authToken) {
            window.location.href = `http://127.0.0.1:8000/admin/auto-login?token=${encodeURIComponent(authToken)}&redirect=${encodeURIComponent(window.location.href)}`;
            return;
          }
          throw new Error('غير مصرح - يرجى تسجيل الدخول كمسؤول');
        }
        
        // Try to get error message from response
        let errorMessage = `فشل في جلب الإحصائيات: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch (e) {
          // If response is not JSON, use status text
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setStatistics(data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      // Show user-friendly error message
      const errorMessage = err.message || 'حدث خطأ أثناء جلب الإحصائيات. يرجى المحاولة مرة أخرى.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data with safe access
  let usersData = [];
  let gymsData = [];
  
  // Consistent color palette
  const COLORS = {
    primary: '#0d9488',      // Teal - primary brand color
    secondary: '#14b8a6',    // Teal-500 - lighter teal
    accent: '#ec4899',       // Pink - for women
    accentLight: '#f472b6',  // Pink-400 - lighter pink
    blue: '#3b82f6',         // Blue - for total/mixed stats
    blueLight: '#60a5fa',    // Blue-400 - lighter blue
    orange: '#f97316',       // Orange - for men/male
    orangeLight: '#fb923c',  // Orange-400 - lighter orange
    emerald: '#10b981',      // Emerald - success/positive
    emeraldLight: '#34d399', // Emerald-400 - lighter emerald
  };
  
  try {
    if (statistics && statistics.users) {
      usersData = [
        { name: 'Male', value: Number(statistics.users.men) || 0, color: COLORS.orange },
        { name: 'Female', value: Number(statistics.users.women) || 0, color: COLORS.accent },
      ];
    }

    if (statistics && statistics.gyms) {
      gymsData = [
        { name: 'Male', value: Number(statistics.gyms.men) || 0, color: COLORS.orange },
        { name: 'Female', value: Number(statistics.gyms.women) || 0, color: COLORS.accent },
      ];
    }
  } catch (err) {
    console.error('Error preparing chart data:', err);
    usersData = [];
    gymsData = [];
  }

  const CHART_COLORS = [COLORS.orange, COLORS.accent]; // Orange for men, Pink for women

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const color = payload[0].payload.color || COLORS.primary;
      return (
        <div className="bg-white p-4 border-2 border-gray-200 rounded-lg shadow-xl">
          <p className="font-bold text-gray-900 text-lg mb-1">{payload[0].name}</p>
          <p className="text-teal-600 font-semibold text-base">{`Count: ${payload[0].value}`}</p>
          <div className="mt-2 h-1 rounded-full" style={{ backgroundColor: color, width: '100%' }}></div>
        </div>
      );
    }
    return null;
  };

  // Helper function to ensure label is at minimum distance from center
  const adjustLabelPosition = (x, y, cx, cy, minDistance) => {
    if (!cx || !cy) return { x, y }; // Fallback if center not provided
    
    const dx = x - cx;
    const dy = y - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If label is too close to center, push it further out
    if (distance < minDistance && distance > 0) {
      const angle = Math.atan2(dy, dx);
      const newX = cx + minDistance * Math.cos(angle);
      const newY = cy + minDistance * Math.sin(angle);
      return { x: newX, y: newY };
    }
    
    return { x, y };
  };

  // Custom label line renderer - draws line with arrow pointing to slice
  const renderLabelLine = (props) => {
    const { x1, y1, x2, y2 } = props;
    const outerRadius = 70; // We set this in Pie component
    
    // Calculate direction from label (x2, y2) towards slice edge (x1, y1)
    const dx = x1 - x2;
    const dy = y1 - y2;
    const distanceFromLabelToEdge = Math.sqrt(dx * dx + dy * dy);
    
    // If the label is very close to the edge (small slice case), estimate center
    // and push label further out
    let estimatedCx, estimatedCy;
    
    if (distanceFromLabelToEdge < outerRadius) {
      // Label is too close, estimate center from the direction
      // For a pie chart, center should be roughly in the middle of the container
      // Since we use cx="50%" cy="50%" and height is 300, center is around (150, 150)
      estimatedCx = 150;
      estimatedCy = 150;
    } else {
      // Estimate center as being outerRadius away from x1, y1 in the opposite direction of the label
      const angle = Math.atan2(-dy, -dx); // Opposite direction
      estimatedCx = x1 - outerRadius * Math.cos(angle);
      estimatedCy = y1 - outerRadius * Math.sin(angle);
    }
    
    // Calculate distance from estimated center to label
    const dx2 = x2 - estimatedCx;
    const dy2 = y2 - estimatedCy;
    const labelDistance = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    
    // Minimum distance for labels (outerRadius + 50px for better spacing, especially for small slices)
    const minLabelDistance = outerRadius + 50;
    
    // If label is too close, extend it further out along the direction from center to label
    let finalX2 = x2;
    let finalY2 = y2;
    
    if (labelDistance < minLabelDistance) {
      // Calculate angle from center to current label position
      const labelAngle = labelDistance > 0 
        ? Math.atan2(dy2, dx2)
        : Math.atan2(y1 - estimatedCy, x1 - estimatedCx); // Fallback to angle from center to slice edge
      
      finalX2 = estimatedCx + minLabelDistance * Math.cos(labelAngle);
      finalY2 = estimatedCy + minLabelDistance * Math.sin(labelAngle);
    }
    
    // Calculate arrow direction (from label to slice, so arrow points to x1, y1)
    const arrowDx = x1 - finalX2;
    const arrowDy = y1 - finalY2;
    const arrowAngle = Math.atan2(arrowDy, arrowDx);
    const arrowLength = 8;
    const arrowAngleSpread = Math.PI / 6; // 30 degrees

    // Arrow tip is at the slice edge (x1, y1)
    // Arrow base points (slightly away from x1, y1 towards finalX2, finalY2)
    const arrowBaseX1 = x1 - arrowLength * Math.cos(arrowAngle - arrowAngleSpread);
    const arrowBaseY1 = y1 - arrowLength * Math.sin(arrowAngle - arrowAngleSpread);
    const arrowBaseX2 = x1 - arrowLength * Math.cos(arrowAngle + arrowAngleSpread);
    const arrowBaseY2 = y1 - arrowLength * Math.sin(arrowAngle + arrowAngleSpread);

    return (
      <g>
        {/* Main line from pie edge to label */}
        <line
          x1={x1}
          y1={y1}
          x2={finalX2}
          y2={finalY2}
          stroke="black"
          strokeWidth="2"
          fill="none"
        />
        {/* Arrow pointing to slice (triangle at x1, y1) */}
        <polygon
          points={`${x1},${y1} ${arrowBaseX1},${arrowBaseY1} ${arrowBaseX2},${arrowBaseY2}`}
          fill="black"
          stroke="black"
          strokeWidth="1"
        />
      </g>
    );
  };

  // Custom label renderer for pie charts - renders black text outside the circle
  const renderCustomLabel = (props) => {
    const { x, y, cx, cy, percent, name, outerRadius, midAngle } = props;
    const radius = outerRadius || 80;
    
    // Estimate center if not provided (for ResponsiveContainer with height 300, center is ~150, 150)
    let centerX = cx;
    let centerY = cy;
    
    // If cx/cy are percentages or not provided, estimate from chart dimensions
    if (!centerX || !centerY || typeof centerX === 'string' || typeof centerY === 'string') {
      centerX = 150; // Approximate center for 300px height container
      centerY = 150;
    }
    
    // Calculate distance from center to label
    const dx = x - centerX;
    const dy = y - centerY;
    const labelDistance = Math.sqrt(dx * dx + dy * dy);
    
    // Minimum distance for labels (radius + 50px for better spacing)
    const minLabelDistance = radius + 50;
    
    // If label is too close to center, push it further out
    let finalX = x;
    let finalY = y;
    
    if (labelDistance < minLabelDistance) {
      // Use midAngle if available, otherwise calculate from current position
      let angle;
      if (typeof midAngle === 'number') {
        // Convert midAngle (in degrees) to radians
        angle = (midAngle * Math.PI) / 180;
      } else if (labelDistance > 0) {
        // Calculate angle from center to current label position
        angle = Math.atan2(dy, dx);
      } else {
        // Fallback: use a default angle based on slice
        angle = 0;
      }
      
      finalX = centerX + minLabelDistance * Math.cos(angle);
      finalY = centerY + minLabelDistance * Math.sin(angle);
    }
    
    return (
      <text 
        x={finalX} 
        y={finalY} 
        fill="black" 
        textAnchor={finalX > centerX ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: '14px', fontWeight: '600' }}
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Always render something - never return null
  if (loading) {
    try {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-teal-600 font-medium">جاري التحميل...</p>
              </div>
            </div>
          </div>
        </div>
      );
    } catch (err) {
      console.error('Error in loading state:', err);
      return <div>Loading...</div>;
    }
  }

  if (error) {
    try {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⚠️</span>
                <h2 className="text-xl font-bold text-red-900">تعذر تحميل الإحصائيات</h2>
              </div>
              <p className="text-red-800 mb-4">{error}</p>
              <div className="flex gap-3">
                <button
                  onClick={fetchStatistics}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
                >
                  إعادة المحاولة
                </button>
                <button
                  onClick={() => {
                    const token = user?.token || localStorage.getItem('auth_token');
                    if (token) {
                      window.location.href = `http://127.0.0.1:8000/admin/auto-login?token=${encodeURIComponent(token)}`;
                    } else {
                      window.location.href = 'http://127.0.0.1:8000/admin/dashboard';
                    }
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  العودة للوحة التحكم
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } catch (err) {
      console.error('Error in error state:', err);
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-800 text-lg mb-4">خطأ: {error}</p>
            <button
              onClick={fetchStatistics}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">🏋️ Gym Finder Admin - Statistics</h1>
            <div className="flex items-center gap-4">
              {/* User Dropdown */}
              <div className="relative" id="user-menu-container">
                <button 
                  id="user-menu-button"
                  className="text-teal-100 hover:text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition cursor-pointer flex items-center gap-2"
                  onClick={() => {
                    const dropdown = document.getElementById('user-menu-dropdown');
                    const isHidden = dropdown?.classList.contains('hidden');
                    if (isHidden) {
                      dropdown?.classList.remove('hidden');
                    } else {
                      dropdown?.classList.add('hidden');
                    }
                  }}
                >
                  <span>Welcome, {user?.name || 'Admin'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div 
                  id="user-menu-dropdown"
                  className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-teal-200 py-2 z-50"
                >
                  <a 
                    href="http://localhost:5173/" 
                    className="block px-4 py-2 text-gray-700 hover:bg-teal-50 transition"
                  >
                    Return to Home
                  </a>
                  <div className="border-t border-gray-100 my-1"></div>
                  <a 
                    href="http://127.0.0.1:8000/admin/logout" 
                    className="block px-4 py-2 text-red-600 hover:bg-red-50 transition"
                  >
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md border-b border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a 
              href="http://127.0.0.1:8000/admin/dashboard" 
              className="text-gray-500 hover:text-teal-700 hover:border-teal-300 border-b-2 border-transparent py-4 px-1 font-medium"
            >
              Dashboard
            </a>
            <a 
              href="http://127.0.0.1:8000/admin/gyms" 
              className="text-gray-500 hover:text-teal-700 hover:border-teal-300 border-b-2 border-transparent py-4 px-1 font-medium"
            >
              Gyms
            </a>
            <a 
              href="http://127.0.0.1:8000/admin/users" 
              className="text-gray-500 hover:text-teal-700 hover:border-teal-300 border-b-2 border-transparent py-4 px-1 font-medium"
            >
              Users
            </a>
            <a 
              href="http://127.0.0.1:8000/admin/contact-messages" 
              className="text-gray-500 hover:text-teal-700 hover:border-teal-300 border-b-2 border-transparent py-4 px-1 font-medium"
            >
              Contact Messages
            </a>
            <a 
              href="http://localhost:5173/admin/statistics" 
              className="border-b-2 border-teal-600 text-teal-600 py-4 px-1 font-medium"
            >
              Statistics
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Gender Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {/* Total Users - White Card with Purple Accent */}
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-xs font-medium uppercase tracking-wide">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-black mt-1">
                  {(statistics && statistics.users && statistics.users.total) || (statistics && statistics.total_users) || 0}
                </p>
              </div>
              <div className="bg-purple-500 rounded-full p-2 shadow-md flex items-center justify-center w-12 h-12">
                <span className="text-xl block leading-none">👥</span>
              </div>
            </div>
          </div>

          {/* Male Users - White Card with Orange Accent */}
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-xs font-medium uppercase tracking-wide">
                  Male Users
                </p>
                <p className="text-3xl font-bold text-black mt-1">
                  {(statistics && statistics.users && statistics.users.men) || 0}
                </p>
              </div>
              <div className="bg-orange-500 rounded-full p-2 shadow-md flex items-center justify-center w-12 h-12">
                <span className="text-xl block leading-none">👨</span>
              </div>
            </div>
          </div>

          {/* Female Users - White Card with Pink Accent */}
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-pink-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-xs font-medium uppercase tracking-wide">
                  Female Users
                </p>
                <p className="text-3xl font-bold text-black mt-1">
                  {(statistics && statistics.users && statistics.users.women) || 0}
                </p>
              </div>
              <div className="bg-pink-500 rounded-full p-2 shadow-md flex items-center justify-center w-12 h-12">
                <span className="text-xl block leading-none">👩</span>
              </div>
            </div>
          </div>

          {/* Male Gyms - White Card with Orange Accent */}
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-xs font-medium uppercase tracking-wide">
                  Gyms for Males
                </p>
                <p className="text-3xl font-bold text-black mt-1">
                  {(statistics && statistics.gyms && statistics.gyms.men) || 0}
                </p>
              </div>
              <div className="bg-orange-500 rounded-full p-2 shadow-md flex items-center justify-center w-12 h-12">
                <span className="text-xl block leading-none">🏋️♂️</span>
              </div>
            </div>
          </div>

          {/* Female Gyms - White Card with Pink Accent */}
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-pink-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-xs font-medium uppercase tracking-wide">
                  Gyms for Females
                </p>
                <p className="text-3xl font-bold text-black mt-1">
                  {(statistics && statistics.gyms && statistics.gyms.women) || 0}
                </p>
              </div>
              <div className="bg-pink-500 rounded-full p-2 shadow-md flex items-center justify-center w-12 h-12">
                <span className="text-xl block leading-none">🏋️♀️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Users Chart */}
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-bold text-teal-900 mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-teal-600" />
              User Distribution
            </h2>
            {statistics && statistics.users && (statistics.users.men > 0 || statistics.users.women > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={usersData}
                    cx="50%"
                    cy="50%"
                    labelLine={renderLabelLine}
                    label={renderCustomLabel}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {usersData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-gray-400 bg-gray-50 rounded-lg">
                <p className="text-base">No data available</p>
              </div>
            )}
            <div className="mt-3 grid grid-cols-2 gap-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-3">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600 mb-1">Male</p>
                <p className="text-xl font-bold text-orange-600">{(statistics && statistics.users && statistics.users.men) || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600 mb-1">Female</p>
                <p className="text-xl font-bold text-pink-600">{(statistics && statistics.users && statistics.users.women) || 0}</p>
              </div>
            </div>
          </div>

          {/* Gyms Chart */}
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-bold text-teal-900 mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-teal-600" />
              Gym Distribution
            </h2>
            {statistics && statistics.gyms && (statistics.gyms.men > 0 || statistics.gyms.women > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={gymsData}
                    cx="50%"
                    cy="50%"
                    labelLine={renderLabelLine}
                    label={renderCustomLabel}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {gymsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-gray-400 bg-gray-50 rounded-lg">
                <p className="text-base">No data available</p>
              </div>
            )}
            <div className="mt-3 grid grid-cols-2 gap-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-3">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600 mb-1">Male</p>
                <p className="text-xl font-bold text-orange-600">{(statistics && statistics.gyms && statistics.gyms.men) || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600 mb-1">Female</p>
                <p className="text-xl font-bold text-pink-600">{(statistics && statistics.gyms && statistics.gyms.women) || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
