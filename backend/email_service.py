import os
from fastapi import logger
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
from typing import Optional
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger(__name__)

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = os.getenv("SENDER_EMAIL", "jackswerdlow82@gmail.com")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

class EmailService:
    def __init__(self):
        if not SENDGRID_API_KEY:
            logger.error("SendGrid API key is not set. Email service will not function.")
            self.client = None
        else:
            self.client = SendGridAPIClient(SENDGRID_API_KEY)

    def send_verification_email(self, to_email: str, verification_code: str) -> bool:
        """
        Send verification code email to user
        
        Args:
            to_email: Recipient .edu email address
            verification_code: 6-digit verification code
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            # All emails are .edu in this system
            edu_badge_text = """
                <p style="color: #16a34a; font-weight: 600; margin-top: 20px;">
                    🎓 Your .edu email will be verified and you'll receive a verified badge on your profile!
                </p>
                """
            
            subject = "Verify Your Sublea Account"
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Sublea</h1>
                    <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">Student Subletting Marketplace</p>
                </div>
                
                <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #1f2937; margin-top: 0;">Verify Your Email Address</h2>
                    
                    <p style="color: #4b5563; font-size: 16px;">
                        Welcome to Sublea! Please use the verification code below to complete your registration:
                    </p>
                    
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                        <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
                        <p style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">
                            {verification_code}
                        </p>
                    </div>
                    
                    {edu_badge_text}
                    
                    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                        This code will expire in <strong>15 minutes</strong>.
                    </p>
                    
                    <p style="color: #6b7280; font-size: 14px;">
                        If you didn't create a Sublea account, you can safely ignore this email.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    
                    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                        © 2026 Sublea. All rights reserved.<br>
                        Student exclusive subletting marketplace
                    </p>
                </div>
            </body>
            </html>
            """
            
            # Plain text version for email clients that don't support HTML
            text_content = f"""
Sublea - Email Verification

Welcome to Sublea!

Your verification code is: {verification_code}

Your .edu email will be verified and you'll receive a verified badge on your profile!

This code will expire in 15 minutes.

If you didn't create a Sublea account, you can safely ignore this email.

© 2026 Sublea. All rights reserved.
            """
            
            if self.client:
                # Send actual email via SendGrid
                message = Mail(
                    from_email=Email(FROM_EMAIL, "Sublea"),
                    to_emails=To(to_email),
                    subject=subject,
                    plain_text_content=Content("text/plain", text_content),
                    html_content=Content("text/html", html_content)
                )
                
                response = self.client.send(message)
                logger.info(f"Verification email sent to {to_email}. Status: {response.status_code}")
                return response.status_code in [200, 201, 202]
            else:
                # Simulate email sending for development
                logger.info(f"[SIMULATED EMAIL] To: {to_email}")
                logger.info(f"[SIMULATED EMAIL] Subject: {subject}")
                logger.info(f"[SIMULATED EMAIL] Verification Code: {verification_code}")
                logger.info(f"[SIMULATED EMAIL] .edu verified badge will be awarded")
                print(f"\n{'='*60}")
                print(f"📧 VERIFICATION EMAIL (Development Mode)")
                print(f"{'='*60}")
                print(f"To: {to_email}")
                print(f"Subject: {subject}")
                print(f"Verification Code: {verification_code}")
                print(f"🎓 .edu email - Verified badge will be awarded!")
                print(f"{'='*60}\n")
                return True
                
        except Exception as e:
            logger.error(f"Failed to send verification email to {to_email}: {str(e)}")
            return False
            

    def send_password_reset_email(self, to_email: str, reset_token: str) -> bool:
        """
        Send password reset email (for future implementation)
        
        Args:
            to_email: Recipient email address
            reset_token: Password reset token
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            reset_url = f"{FRONTEND_URL}/reset-password?token={reset_token}"
            
            subject = "Reset Your Sublea Password"
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Sublea</h1>
                </div>
                
                <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #1f2937; margin-top: 0;">Reset Your Password</h2>
                    
                    <p style="color: #4b5563; font-size: 16px;">
                        We received a request to reset your password. Click the button below to create a new password:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{reset_url}" style="display: inline-block; background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                            Reset Password
                        </a>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px;">
                        Or copy and paste this link into your browser:<br>
                        <a href="{reset_url}" style="color: #667eea; word-break: break-all;">{reset_url}</a>
                    </p>
                    
                    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                        This link will expire in <strong>1 hour</strong>.
                    </p>
                    
                    <p style="color: #6b7280; font-size: 14px;">
                        If you didn't request a password reset, you can safely ignore this email.
                    </p>
                </div>
            </body>
            </html>
            """
            
            text_content = f"""
Sublea - Password Reset

We received a request to reset your password.

Click this link to reset your password:
{reset_url}

This link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email.

© 2026 Sublea. All rights reserved.
            """
            
            if self.client:
                message = Mail(
                    from_email=Email(FROM_EMAIL, "Sublea"),
                    to_emails=To(to_email),
                    subject=subject,
                    plain_text_content=Content("text/plain", text_content),
                    html_content=Content("text/html", html_content)
                )
                
                response = self.client.send(message)
                logger.info(f"Password reset email sent to {to_email}. Status: {response.status_code}")
                return response.status_code in [200, 201, 202]
            else:
                logger.info(f"[SIMULATED EMAIL] Password reset email to {to_email}")
                print(f"\n📧 PASSWORD RESET EMAIL: {reset_url}\n")
                return True
                
        except Exception as e:
            logger.error(f"Failed to send password reset email to {to_email}: {str(e)}")
            return False


email_service = EmailService()