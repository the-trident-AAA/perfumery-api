# Configuración de Imágenes en Emails

## Problema
Gmail y otros clientes de email bloquean las imágenes Base64 por seguridad. Esto causa que las imágenes no se muestren en los emails.

## Soluciones Implementadas

### 1. Endpoint para servir imágenes
- **URL**: `GET /assets/images/:filename`
- **Ejemplo**: `http://localhost:3000/assets/images/logo.png`
- **Ventajas**: Compatible con todos los clientes de email

### 2. Configuración de URL del servidor
Agrega en tu archivo `.env`:

```env
# Para desarrollo
API_URL=http://localhost:3000

# Para producción
API_URL=https://tu-dominio.com
```

### 3. Uso en templates
El template ahora usa URLs en lugar de Base64:

```html
<img src="http://localhost:3000/assets/images/logo.png" alt="Perfumery Logo" />
```

## Alternativas adicionales

### Opción A: CDN externo
Si tienes un CDN, puedes cambiar la URL en `assets.service.ts`:

```typescript
getLogoUrl(): string {
  return 'https://cdn.tudominio.com/images/logo.png';
}
```

### Opción B: Servicio de hosting de imágenes
Puedes subir tu logo a servicios como:
- Imgur
- Cloudinary
- AWS S3
- Google Cloud Storage

### Opción C: Email attachments (menos recomendado)
Si las URLs no funcionan, puedes usar attachments:

```typescript
// En mail.service.ts
await this.mailerService.sendMail({
  to: email,
  subject: 'Tu código de verificación - Perfumery',
  html: htmlContent,
  attachments: [
    {
      filename: 'logo.png',
      path: join(process.cwd(), 'src', 'assets', 'images', 'logo.png'),
      cid: 'logo@perfumery.com',
    },
  ],
});
```

Y en el template:
```html
<img src="cid:logo@perfumery.com" alt="Perfumery Logo" />
```

## Testing

1. **Desarrollo local**: `http://localhost:3000/assets/images/logo.png`
2. **Verificar endpoint**: Visita la URL en tu navegador
3. **Enviar email de prueba**: Usa el endpoint de OTP
4. **Verificar en Gmail**: La imagen debería cargar correctamente

## Troubleshooting

### La imagen no se muestra en Gmail
1. ✅ Verifica que la URL sea accesible públicamente
2. ✅ Asegúrate de que el servidor esté corriendo
3. ✅ Verifica que la imagen exista en `src/assets/images/`
4. ✅ Revisa los logs del servidor para errores 404

### Error 404 en el endpoint
1. ✅ Verifica que el AssetsModule esté importado en AppModule
2. ✅ Asegúrate de que el controlador esté registrado
3. ✅ Verifica que la imagen exista en la ruta correcta
