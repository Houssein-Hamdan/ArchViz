<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Verification Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            margin: 20px auto;
            max-width: 500px;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #3b82f6;
        }
        .otp-box {
            background-color: #f0f9ff;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #3b82f6;
            letter-spacing: 5px;
            font-family: 'Courier New', monospace;
        }
        .info {
            color: #666;
            font-size: 14px;
            margin: 20px 0;
        }
        .warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
            color: #92400e;
            font-size: 13px;
        }
        .footer {
            text-align: center;
            color: #999;
            font-size: 12px;
            margin-top: 30px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏗️ Archviz</div>
            <p style="color: #666; margin: 10px 0 0 0;">Email Verification</p>
        </div>

        <p style="color: #333; font-size: 16px;">
            Hello,
        </p>

        <p style="color: #666;">
            Your verification code for Archviz is:
        </p>

        <div class="otp-box">
            <div class="otp-code">{{ $otp }}</div>
        </div>

        <div class="info">
            <strong>Email:</strong> {{ $email }}<br>
            <strong>Expires in:</strong> 15 minutes
        </div>

        <div class="warning">
            ⚠️ <strong>Security Note:</strong> Never share this code with anyone. Archviz staff will never ask for your verification code.
        </div>

        <p style="color: #666; font-size: 14px;">
            If you didn't request this code, you can safely ignore this email.
        </p>

        <div class="footer">
            <p>
                © 2024 Archviz. All rights reserved.<br>
                This is an automated email. Please do not reply directly.
            </p>
        </div>
    </div>
</body>
</html>