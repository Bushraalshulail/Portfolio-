import redis
import json
import time
from typing import Optional, Any
from ..config import settings

class RedisService:
    def __init__(self):
        try:
            self.redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
            # Test connection
            self.redis_client.ping()
            self.redis_available = True
            print("Redis connected successfully")
        except Exception as e:
            print(f"Redis connection failed: {e}")
            self.redis_client = None
            self.redis_available = False
            # Fallback to in-memory storage
            self.memory_store = {}
    
    def _get_expiry_time(self, ttl: int) -> float:
        """Get expiry timestamp for TTL"""
        return time.time() + ttl
    
    def _is_expired(self, expires: float) -> bool:
        """Check if item is expired"""
        return time.time() > expires
    
    def set_otp(self, email: str, otp: str, ttl: int = 300) -> bool:
        """Store OTP with 5-minute TTL"""
        if self.redis_available:
            try:
                key = f"otp:{email}"
                return self.redis_client.setex(key, ttl, otp)
            except Exception as e:
                print(f"Redis error setting OTP: {e}")
                return False
        else:
            # Fallback to memory storage
            self.memory_store[f"otp:{email}"] = {
                "value": otp,
                "expires": self._get_expiry_time(ttl)
            }
            return True
    
    def get_otp(self, email: str) -> Optional[str]:
        """Get OTP for email"""
        if self.redis_available:
            try:
                key = f"otp:{email}"
                return self.redis_client.get(key)
            except Exception as e:
                print(f"Redis error getting OTP: {e}")
                return None
        else:
            # Fallback to memory storage
            key = f"otp:{email}"
            if key in self.memory_store:
                item = self.memory_store[key]
                if not self._is_expired(item["expires"]):
                    return item["value"]
                else:
                    del self.memory_store[key]
            return None
    
    def delete_otp(self, email: str) -> bool:
        """Delete OTP after successful verification"""
        if self.redis_available:
            try:
                key = f"otp:{email}"
                return bool(self.redis_client.delete(key))
            except Exception as e:
                print(f"Redis error deleting OTP: {e}")
                return False
        else:
            # Fallback to memory storage
            key = f"otp:{email}"
            if key in self.memory_store:
                del self.memory_store[key]
                return True
            return False
    
    def set_rate_limit(self, email: str, ttl: int = 60) -> bool:
        """Set rate limit for OTP requests (60 seconds) - Max 1 request per 60 seconds"""
        if self.redis_available:
            try:
                key = f"rate_limit:{email}"
                return self.redis_client.setex(key, ttl, "1")
            except Exception as e:
                print(f"Redis error setting rate limit: {e}")
                return False
        else:
            # Fallback to memory storage
            self.memory_store[f"rate_limit:{email}"] = {
                "value": "1",
                "expires": self._get_expiry_time(ttl)
            }
            return True
    
    def check_rate_limit(self, email: str) -> bool:
        """Check if user is rate limited"""
        if self.redis_available:
            try:
                key = f"rate_limit:{email}"
                return self.redis_client.exists(key) > 0
            except Exception as e:
                print(f"Redis error checking rate limit: {e}")
                return False
        else:
            # Fallback to memory storage
            key = f"rate_limit:{email}"
            if key in self.memory_store:
                item = self.memory_store[key]
                if not self._is_expired(item["expires"]):
                    return True
                else:
                    del self.memory_store[key]
            return False
    
    def increment_otp_requests(self, email: str, window_minutes: int = 10) -> int:
        """Increment OTP request counter for rate limiting (max 5 per 10 minutes)"""
        if self.redis_available:
            try:
                key = f"otp_requests:{email}"
                pipe = self.redis_client.pipeline()
                pipe.incr(key)
                pipe.expire(key, window_minutes * 60)
                results = pipe.execute()
                return results[0]
            except Exception as e:
                print(f"Redis error incrementing OTP requests: {e}")
                return 0
        else:
            # Fallback to memory storage
            key = f"otp_requests:{email}"
            if key in self.memory_store:
                item = self.memory_store[key]
                if not self._is_expired(item["expires"]):
                    item["value"] = str(int(item["value"]) + 1)
                    return int(item["value"])
                else:
                    del self.memory_store[key]
            
            # Create new counter
            self.memory_store[key] = {
                "value": "1",
                "expires": self._get_expiry_time(window_minutes * 60)
            }
            return 1
    
    def get_otp_requests_count(self, email: str) -> int:
        """Get current OTP request count"""
        if self.redis_available:
            try:
                key = f"otp_requests:{email}"
                count = self.redis_client.get(key)
                return int(count) if count else 0
            except Exception as e:
                print(f"Redis error getting OTP requests count: {e}")
                return 0
        else:
            # Fallback to memory storage
            key = f"otp_requests:{email}"
            if key in self.memory_store:
                item = self.memory_store[key]
                if not self._is_expired(item["expires"]):
                    return int(item["value"])
                else:
                    del self.memory_store[key]
            return 0

# Global instance
redis_service = RedisService()
