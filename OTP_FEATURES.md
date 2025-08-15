# Funcionalidades de OTP - Perfumery API

## Descripción
Este documento describe las funcionalidades de OTP (One-Time Password) implementadas en la API de perfumería para autenticación y recuperación de contraseñas.

## Características Implementadas

### 1. Envío de OTP
- **Endpoint**: `POST /auth/send-otp`
- **Descripción**: Envía un código OTP de 6 dígitos al email del usuario
- **Validaciones**:
  - Verifica que el usuario existe en la base de datos
  - Valida formato de email
- **Proceso**:
  1. Genera OTP usando la librería `otplib`
  2. Envía email con el código usando `MailService`
  3. Almacena OTP en base de datos con expiración de 5 minutos
  4. Invalida OTPs anteriores del mismo usuario

### 2. Verificación de OTP
- **Endpoint**: `POST /auth/verify-otp`
- **Descripción**: Verifica la validez de un código OTP
- **Validaciones**:
  - Verifica que el OTP existe y no ha sido usado
  - Verifica que el OTP no ha expirado (5 minutos)
- **Proceso**:
  1. Busca el OTP en la base de datos
  2. Verifica expiración
  3. Marca como usado si es válido
  4. Retorna resultado de verificación

### 3. Reset de Contraseña con OTP
- **Endpoint**: `POST /auth/reset-password`
- **Descripción**: Permite cambiar la contraseña usando OTP
- **Validaciones**:
  - Verifica que el usuario existe
  - Verifica que el OTP es válido
  - Valida nueva contraseña (mínimo 6 caracteres)
- **Proceso**:
  1. Verifica usuario y OTP
  2. Encripta nueva contraseña
  3. Actualiza contraseña en base de datos

## Estructura de Base de Datos

### Tabla: `otp`
```sql
CREATE TABLE otp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL,
  otp VARCHAR NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_otp_email ON otp(email);
```

## Configuración Requerida

### Variables de Entorno
```env
# OTP Configuration
OTP_SECRET=your-secret-key-here

# Email Configuration (ya configurado)
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

### Dependencias
- `@nestjs/schedule` - Para limpieza automática de OTPs expirados
- `otplib` - Para generación y verificación de OTPs
- `bcrypt` - Para encriptación de contraseñas

## Limpieza Automática

### Servicio Programado
- **Frecuencia**: Cada hora
- **Función**: Elimina OTPs expirados de la base de datos
- **Archivo**: `src/otp/otp-scheduler.service.ts`

## Flujo de Uso

### 1. Recuperación de Contraseña
```
1. Usuario solicita OTP → POST /auth/send-otp
2. Usuario recibe email con código
3. Usuario verifica OTP → POST /auth/verify-otp
4. Usuario cambia contraseña → POST /auth/reset-password
```

### 2. Verificación de Email
```
1. Usuario solicita OTP → POST /auth/send-otp
2. Usuario recibe email con código
3. Usuario verifica OTP → POST /auth/verify-otp
```

## Seguridad

### Medidas Implementadas
- **Expiración**: OTPs expiran en 5 minutos
- **Uso único**: Cada OTP solo puede usarse una vez
- **Invalidación**: OTPs anteriores se invalidan al generar uno nuevo
- **Encriptación**: Contraseñas se encriptan con bcrypt
- **Limpieza**: OTPs expirados se eliminan automáticamente

### Validaciones
- Formato de email válido
- OTP de exactamente 6 dígitos
- Contraseña mínima de 6 caracteres
- Verificación de existencia de usuario

## Endpoints Disponibles

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/auth/send-otp` | Enviar OTP | `{ "email": "user@example.com" }` |
| POST | `/auth/verify-otp` | Verificar OTP | `{ "email": "user@example.com", "otp": "123456" }` |
| POST | `/auth/reset-password` | Reset contraseña | `{ "email": "user@example.com", "otp": "123456", "newPassword": "newpass123" }` |

## Respuestas de Error

### Códigos de Error Comunes
- `400` - Email inválido o usuario no encontrado
- `400` - OTP inválido o expirado
- `400` - Contraseña muy corta
- `500` - Error interno del servidor

### Ejemplos de Respuesta
```json
{
  "valid": false,
  "message": "OTP inválido o expirado"
}
```

```json
{
  "message": "No existe un usuario con este email"
}
```
