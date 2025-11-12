#!/usr/bin/env python3
"""
Test script for the new authentication system
Tests: Register -> Verify Email -> Login flow
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_register():
    """Test user registration"""
    print("Testing user registration...")
    
    data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpass123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Registration successful: {result['message']}")
        return True
    else:
        print(f"❌ Registration failed: {response.text}")
        return False

def test_verify_email(otp="123456"):
    """Test email verification"""
    print("Testing email verification...")
    
    data = {
        "email": "test@example.com",
        "otp": otp
    }
    
    response = requests.post(f"{BASE_URL}/auth/verify-email", json=data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Email verification successful: {result['message']}")
        return True
    else:
        print(f"❌ Email verification failed: {response.text}")
        return False

def test_login():
    """Test user login"""
    print("Testing user login...")
    
    data = {
        "email": "test@example.com",
        "password": "testpass123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Login successful: {result['access_token'][:20]}...")
        print(f"User: {result['user']['name']} ({result['user']['email']})")
        print(f"Email verified: {result['user']['email_verified']}")
        return True
    else:
        print(f"❌ Login failed: {response.text}")
        return False

def test_login_unverified():
    """Test login with unverified email (should fail)"""
    print("Testing login with unverified email...")
    
    # First register a new user
    data = {
        "name": "Unverified User",
        "email": "unverified@example.com",
        "password": "testpass123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=data)
    if response.status_code != 200:
        print(f"❌ Registration failed: {response.text}")
        return False
    
    # Try to login without verifying email
    login_data = {
        "email": "unverified@example.com",
        "password": "testpass123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    
    if response.status_code == 400:
        result = response.json()
        print(f"✅ Login correctly blocked: {result['detail']}")
        return True
    else:
        print(f"❌ Login should have been blocked: {response.text}")
        return False

def main():
    print("🧪 Testing Gym Finder Riyadh Authentication System")
    print("=" * 50)
    
    # Test 1: Register -> Verify -> Login flow
    print("\n📝 Test 1: Complete Registration Flow")
    if test_register():
        print("📧 Check backend console for OTP code")
        otp = input("Enter the OTP from console (or press Enter for 123456): ").strip()
        if not otp:
            otp = "123456"
        
        if test_verify_email(otp):
            test_login()
    
    # Test 2: Login without verification (should fail)
    print("\n📝 Test 2: Login Without Verification")
    test_login_unverified()
    
    print("\n🎉 Testing completed!")

if __name__ == "__main__":
    main()

