export function generateOTPEmailHTML(otp: string, currentYear: number): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Código de Verificación - Perfumery</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #ede0d4 0%, #252422 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .container {
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                max-width: 500px;
                width: 100%;
            }
            
            .header {
                background: linear-gradient(135deg, #ede0d4 0%, #252422 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            }
            
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: white;
                margin-bottom: 10px;
                position: relative;
                z-index: 1;
            }
            
            .subtitle {
                color: rgba(255, 255, 255, 0.9);
                font-size: 16px;
                position: relative;
                z-index: 1;
            }
            
            .content {
                padding: 40px 30px;
                text-align: center;
            }
            
            .title {
                font-size: 24px;
                font-weight: 600;
                color: #333;
                margin-bottom: 15px;
            }
            
            .description {
                color: #666;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 30px;
            }
            
            .otp-container {
                background: linear-gradient(135deg, #ede0d4 0%, #252422 100%);
                border-radius: 15px;
                padding: 25px;
                margin: 30px 0;
                position: relative;
                overflow: hidden;
            }
            
            .otp-container::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                animation: shine 3s infinite;
            }
            
            @keyframes shine {
                0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
            }
            
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                color: white;
                letter-spacing: 8px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                position: relative;
                z-index: 1;
            }
            
            .expiry-info {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 15px;
                margin: 20px 0;
                border-left: 4px solid #ffc107;
            }
            
            .expiry-text {
                color: #856404;
                font-size: 14px;
                font-weight: 500;
            }
            
            .security-note {
                background: #e3f2fd;
                border-radius: 10px;
                padding: 15px;
                margin: 20px 0;
                border-left: 4px solid #2196f3;
            }
            
            .security-text {
                color: #0d47a1;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .footer {
                background: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }
            
            .footer-text {
                color: #6c757d;
                font-size: 12px;
                line-height: 1.4;
            }
            
            .divider {
                height: 1px;
                background: linear-gradient(90deg, transparent, #dee2e6, transparent);
                margin: 20px 0;
            }
            
            .icon {
                font-size: 48px;
                margin-bottom: 20px;
                display: block;
            }
            
            @media (max-width: 600px) {
                .container {
                    margin: 10px;
                    border-radius: 15px;
                }
                
                .header, .content {
                    padding: 30px 20px;
                }
                
                .otp-code {
                    font-size: 28px;
                    letter-spacing: 6px;
                }
                
                .title {
                    font-size: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🌸 Perfumery</div>
                <div class="subtitle">Tu tienda de fragancias favorita</div>
            </div>
            
            <div class="content">
                <span class="icon">🔐</span>
                <h1 class="title">Código de Verificación</h1>
                <p class="description">
                    Hemos enviado este código de verificación para completar tu proceso de forma segura.
                </p>
                
                <div class="otp-container">
                    <div class="otp-code">${otp}</div>
                </div>
                
                <div class="expiry-info">
                    <div class="expiry-text">⏰ Este código expira en 5 minutos</div>
                </div>
                
                <div class="security-note">
                    <div class="security-text">
                        <strong>🔒 Seguridad:</strong> Nunca compartas este código con nadie. 
                        Nuestro equipo nunca te pedirá este código por teléfono o email.
                    </div>
                </div>
                
                <div class="divider"></div>
                
                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                    Si no solicitaste este código, puedes ignorar este mensaje de forma segura.
                </p>
            </div>
            
            <div class="footer">
                <div class="footer-text">
                    <strong>Perfumery</strong><br>
                    Tu tienda de fragancias de confianza<br>
                    © ${currentYear} Perfumery. Todos los derechos reservados.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}
