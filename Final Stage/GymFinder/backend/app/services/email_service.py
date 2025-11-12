import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from ..config import settings

class EmailService:
    def __init__(self):
        # Use alternative environment variables if primary ones are empty
        self.smtp_host = settings.SMTP_HOST or settings.MAIL_HOST
        self.smtp_port = settings.SMTP_PORT or settings.MAIL_PORT
        self.smtp_username = settings.SMTP_USERNAME or settings.MAIL_USER
        self.smtp_password = settings.SMTP_PASSWORD or settings.MAIL_PASS
        self.from_email = settings.FROM_EMAIL
        
        # Log SMTP configuration for debugging
        print(f"📧 SMTP Configuration:")
        print(f"   Host: {self.smtp_host}")
        print(f"   Port: {self.smtp_port}")
        print(f"   Username: {self.smtp_username[:3]}***" if self.smtp_username else "   Username: (empty)")
        print(f"   Password: {'***' if self.smtp_password else '(empty)'}")
        print(f"   From Email: {self.from_email}")
    
    def send_verification_email(self, to_email: str, otp: str) -> bool:
        """Send email verification OTP to user via Mailtrap"""
        try:
            print(f"📧 Attempting to send verification email to {to_email}")
            print(f"📧 OTP: {otp}")
            
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.from_email
            msg['To'] = to_email
            msg['Subject'] = "تفعيل البريد الإلكتروني - Gym Finder Riyadh"
            
            # Email body in Arabic
            body = f"""
            مرحباً بك في Gym Finder Riyadh!
            
            رمز تفعيل البريد الإلكتروني الخاص بك هو: {otp}
            
            هذا الرمز صالح لمدة 5 دقائق فقط.
            
            إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.
            
            شكراً لك!
            فريق Gym Finder Riyadh
            """
            
            msg.attach(MIMEText(body, 'plain', 'utf-8'))
            
            # Send email via Mailtrap
            print(f"📧 Connecting to SMTP server: {self.smtp_host}:{self.smtp_port}")
            server = smtplib.SMTP(self.smtp_host, self.smtp_port)
            print(f"📧 Starting TLS...")
            server.starttls()
            
            if self.smtp_username and self.smtp_password:
                print(f"📧 Logging in with username: {self.smtp_username[:3]}***")
                server.login(self.smtp_username, self.smtp_password)
            
            print(f"📧 Sending email...")
            server.send_message(msg)
            server.quit()
            
            print(f"✅ Verification email sent successfully to {to_email} via Mailtrap")
            return True
        except Exception as e:
            print(f"❌ Email sending error: {str(e)}")
            print(f"❌ Error type: {type(e).__name__}")
            return False

    def send_password_reset_email(self, to_email: str, otp: str) -> bool:
        """Send password reset OTP email to user via Mailtrap"""
        try:
            print(f"📧 Attempting to send password reset email to {to_email}")
            print(f"📧 OTP: {otp}")
            
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.from_email
            msg['To'] = to_email
            msg['Subject'] = "استعادة كلمة المرور - Gym Finder Riyadh"
            
            # Email body in Arabic
            body = f"""
            مرحباً بك في Gym Finder Riyadh!
            
            رمز استعادة كلمة المرور الخاص بك هو: {otp}
            
            هذا الرمز صالح لمدة 5 دقائق فقط.
            
            إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.
            
            شكراً لك!
            فريق Gym Finder Riyadh
            """
            
            msg.attach(MIMEText(body, 'plain', 'utf-8'))
            
            # Send email via Mailtrap
            print(f"📧 Connecting to SMTP server: {self.smtp_host}:{self.smtp_port}")
            server = smtplib.SMTP(self.smtp_host, self.smtp_port)
            print(f"📧 Starting TLS...")
            server.starttls()
            
            if self.smtp_username and self.smtp_password:
                print(f"📧 Logging in with username: {self.smtp_username[:3]}***")
                server.login(self.smtp_username, self.smtp_password)
            
            print(f"📧 Sending email...")
            server.send_message(msg)
            server.quit()
            
            print(f"✅ Password reset email sent successfully to {to_email} via Mailtrap")
            return True
        except Exception as e:
            print(f"❌ Email sending error: {str(e)}")
            print(f"❌ Error type: {type(e).__name__}")
            return False

# Global instance
email_service = EmailService()

