/**
 * Translation Service
 * Automatically translates Arabic text to English using free translation API
 * Caches translations in localStorage to avoid redundant API calls
 */

const CACHE_PREFIX = 'gym_translation_';
const CACHE_EXPIRY_DAYS = 30; // Cache translations for 30 days

/**
 * Generate a cache key from text
 */
function getCacheKey(text) {
  // Create a simple hash of the text for the cache key
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `${CACHE_PREFIX}${Math.abs(hash)}`;
}

/**
 * Get cached translation if available and not expired
 */
function getCachedTranslation(text) {
  if (typeof window === 'undefined') return null;
  
  try {
    const cacheKey = getCacheKey(text);
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const { translation, timestamp } = JSON.parse(cached);
      const now = Date.now();
      const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      
      // Check if cache is still valid
      if (now - timestamp < expiryTime) {
        return translation;
      } else {
        // Remove expired cache
        localStorage.removeItem(cacheKey);
      }
    }
  } catch (error) {
    console.warn('Error reading translation cache:', error);
  }
  
  return null;
}

/**
 * Cache a translation
 */
function cacheTranslation(text, translation) {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheKey = getCacheKey(text);
    const cacheData = {
      translation,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Error caching translation:', error);
    // If localStorage is full, try to clear old entries
    try {
      clearExpiredCache();
    } catch (e) {
      console.warn('Error clearing expired cache:', e);
    }
  }
}

/**
 * Clear expired cache entries
 */
function clearExpiredCache() {
  if (typeof window === 'undefined') return;
  
  try {
    const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const { timestamp } = JSON.parse(cached);
            if (now - timestamp >= expiryTime) {
              keysToRemove.push(key);
            }
          }
        } catch (e) {
          // Invalid cache entry, remove it
          keysToRemove.push(key);
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('Error clearing expired cache:', error);
  }
}

/**
 * Translate text from Arabic to English using free translation API
 * Uses MyMemory Translation API (free tier, no API key required)
 */
async function translateTextAsync(text, targetLang = 'en') {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  // If target language is Arabic, return as-is
  if (targetLang === 'ar') {
    return text;
  }
  
  // Check if text contains Arabic characters
  const containsArabic = /[\u0600-\u06FF]/.test(text);
  if (!containsArabic) {
    // Text is already in English or other language, return as-is
    return text;
  }
  
  // Check cache first
  const cached = getCachedTranslation(text);
  if (cached) {
    return cached;
  }
  
  try {
    // Use MyMemory Translation API (free, no API key required)
    // Alternative: Use LibreTranslate if available
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ar|en`
    );
    
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
      const translation = data.responseData.translatedText;
      
      // Cache the translation
      cacheTranslation(text, translation);
      
      return translation;
    } else {
      throw new Error('Invalid response from translation API');
    }
  } catch (error) {
    console.warn('Translation error:', error);
    // Fallback: return original text if translation fails
    return text;
  }
}

/**
 * Main translation function (async)
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language ('ar' or 'en')
 * @returns {Promise<string>} - Translated text
 */
export async function translateText(text, targetLang = 'en') {
  return await translateTextAsync(text, targetLang);
}

/**
 * Synchronous version that returns cached translation immediately
 * Falls back to original text if not cached
 */
export function translateTextSync(text, targetLang = 'en') {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  if (targetLang === 'ar') {
    return text;
  }
  
  const containsArabic = /[\u0600-\u06FF]/.test(text);
  if (!containsArabic) {
    return text;
  }
  
  const cached = getCachedTranslation(text);
  return cached || text;
}

// Clear expired cache on module load
if (typeof window !== 'undefined') {
  clearExpiredCache();
}

