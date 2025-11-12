import smtplib
from email.mime.text import MIMEText
import os

MAIL_HOST = os.getenv("MAIL_HOST")
MAIL_PORT = os.getenv("MAIL_PORT")
MAIL_USER = os.getenv("MAIL_USER")
MAIL_PASS = os.getenv("MAIL_PASS")

def send_test_email():
    msg = MIMEText("Test email from FastAPI / Mailtrap ✅")
    msg["Subject"] = "Mailtrap SMTP Test"
    msg["From"] = MAIL_USER
    msg["To"] = MAIL_USER

    try:
        with smtplib.SMTP(MAIL_HOST, MAIL_PORT) as server:
            server.login(MAIL_USER, MAIL_PASS)
            server.sendmail(MAIL_USER, MAIL_USER, msg.as_string())
        print("✅ Email sent successfully! Check your Mailtrap Inbox.")
    except Exception as e:
        print("❌ SMTP error:", e)

if __name__ == "__main__":
    send_test_email()
