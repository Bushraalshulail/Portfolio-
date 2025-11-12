#!/usr/bin/env python3
"""
Test script to verify email sending functionality with Mailtrap
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_URL = "http://localhost:8000"

def test_email_configuration():
    """Test if email configuration is properly loaded"""
    print("🔧 Testing Email Configuration...")
    
    # Check environment variables
    mail_host = os.getenv('MAIL_HOST')
    mail_port = os.getenv('MAIL_PORT')
    mail_user = os.getenv('MAIL_USER')
    mail_pass = os.getenv('MAIL_PASS')
    
    print(f"MAIL_HOST: {mail_host}")
    print(f"MAIL_PORT: {mail_port}")
    print(f"MAIL_USER: {mail_user[:3]}***" if mail_user else "MAIL_USER: (empty)")
    print(f"MAIL_PASS: {'***' if mail_pass else '(empty)'}")
    
    if not all([mail_host, mail_port, mail_user, mail_pass]):
        print("❌ Email configuration incomplete!")
        print("Please check your .env file and ensure all MAIL_* variables are set.")
        return False
    
    print("✅ Email configuration looks good!")
    return True

def test_registration_email():
    """Test registration email sending"""
    print("\n📧 Testing Registration Email Sending...")
    
    data = {
        "name": "Email Test User",
        "email": "test@example.com",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Registration successful: {result['message']}")
            print("📧 Check your Mailtrap inbox for the verification email")
            return True
        else:
            print(f"❌ Registration failed: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return False

def test_forgot_password_email():
    """Test forgot password email sending"""
    print("\n📧 Testing Forgot Password Email Sending...")
    
    data = {
        "email": "test@example.com"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/forgot-password", json=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Forgot password successful: {result['message']}")
            print("📧 Check your Mailtrap inbox for the reset email")
            return True
        else:
            print(f"❌ Forgot password failed: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return False

def main():
    print("🧪 Testing Gym Finder Riyadh Email Sending")
    print("=" * 50)
    
    # Test 1: Check configuration
    if not test_email_configuration():
        print("\n❌ Email configuration test failed. Please fix your .env file.")
        return
    
    # Test 2: Registration email
    print("\n" + "="*50)
    test_registration_email()
    
    # Test 3: Forgot password email
    print("\n" + "="*50)
    test_forgot_password_email()
    
    print("\n🎉 Email testing completed!")
    print("\n📋 Instructions:")
    print("1. Check your Mailtrap inbox for the emails")
    print("2. Look at the backend console for detailed SMTP logs")
    print("3. If emails are not received, check your Mailtrap credentials")

if __name__ == "__main__":
    main()

