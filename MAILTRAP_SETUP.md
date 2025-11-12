# Mailtrap SMTP Setup for Gym Finder Riyadh

This guide explains how to configure Mailtrap SMTP for email verification during signup.

## What is Mailtrap?

Mailtrap is an email testing service that captures emails in development without sending them to real recipients. Perfect for testing email functionality without spamming real users.

## Setup Steps

### 1. Create Mailtrap Account

1. Go to [mailtrap.io](https://mailtrap.io)
2. Sign up for a free account
3. Verify your email address

### 2. Get SMTP Credentials

1. Log into your Mailtrap dashboard
2. Go to **Email Testing** → **Inboxes**
3. Click on your default inbox
4. Go to **SMTP Settings** tab
5. Select **Node.js - Nodemailer** from the dropdown
6. Copy the following credentials:
   - **Host**: `smtp.mailtrap.io`
   - **Port**: `2525`
   - **Username**: (your username)
   - **Password**: (your password)

### 3. Configure Backend

Create a `.env` file in the `backend` directory with the following variables:

```env
# Mailtrap SMTP Configuration
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mailtrap_username
MAIL_PASS=your_mailtrap_password

# Alternative SMTP settings (also supported)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USERNAME=your_mailtrap_username
SMTP_PASSWORD=your_mailtrap_password
FROM_EMAIL=noreply@gymfinder.com
```

### 4. Test Email Sending

1. Start your backend server:
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload
   ```

2. **Check SMTP Configuration**: The backend will log SMTP configuration on startup:
   ```
   📧 SMTP Configuration:
      Host: smtp.mailtrap.io
      Port: 2525
      Username: abc***
      Password: ***
      From Email: noreply@gymfinder.com
   ```

3. **Test Email Sending**: Use the test script:
   ```bash
   cd backend
   python test_email_sending.py
   ```

4. **Register a new user** through the frontend
5. **Check your Mailtrap inbox** for the verification email
6. **Detailed logs** will be printed in the backend console:
   ```
   📧 Attempting to send verification email to user@example.com
   📧 OTP: 123456
   📧 Connecting to SMTP server: smtp.mailtrap.io:2525
   📧 Starting TLS...
   📧 Logging in with username: abc***
   📧 Sending email...
   ✅ Verification email sent successfully to user@example.com via Mailtrap
   ```

## Email Flow

1. **Signup**: User enters name, email, password
2. **Account Creation**: User account created with `email_verified = false`
3. **OTP Generation**: 6-digit OTP generated and stored in Redis (5-minute TTL)
4. **Email Sent**: Verification email sent via Mailtrap
5. **Email Verification**: User enters OTP to verify email
6. **Account Activation**: `email_verified` set to `true`
7. **Login**: User can now login with email + password

## Rate Limiting

- **Resend OTP**: 1 request every 60 seconds
- **Max OTP Requests**: 5 requests per 10 minutes per email
- **OTP Expiry**: 5 minutes

## Production Setup

For production, replace Mailtrap with a real SMTP service:

```env
# Production SMTP (example with SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com
```

## Troubleshooting

### Common Issues

1. **Email not received**: Check Mailtrap inbox, not your real email
2. **SMTP connection failed**: Verify credentials in `.env` file
3. **OTP expired**: OTP expires after 5 minutes, request a new one
4. **Rate limited**: Wait 60 seconds between resend requests

### Debug Mode

The backend prints OTP codes to console for testing:
```
Verification OTP for user@example.com: 123456
```

This helps during development when you need to test without checking emails.

## Security Notes

- Never commit `.env` files to version control
- Use environment variables in production
- Rotate SMTP credentials regularly
- Monitor email sending limits and costs