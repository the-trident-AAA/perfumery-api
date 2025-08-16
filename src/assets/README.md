# Assets Management

Este directorio contiene los assets estáticos de la aplicación, principalmente imágenes.

## Estructura

```
src/assets/
├── images/           # Imágenes del proyecto
│   ├── logo.png     # Logo principal de la perfumería
│   └── ...          # Otras imágenes
├── assets.service.ts # Servicio para manejar assets
├── assets.module.ts  # Módulo de assets
└── README.md        # Este archivo
```

## Cómo agregar imágenes

1. **Coloca tu imagen** en la carpeta `src/assets/images/`
2. **Usa el AssetsService** para convertir la imagen a Base64:

```typescript
// En cualquier servicio
constructor(private readonly assetsService: AssetsService) {}

// Obtener logo como Base64
const logoBase64 = this.assetsService.getLogoAsBase64();

// Obtener cualquier imagen como Base64
const imageBase64 = this.assetsService.getImageAsBase64('mi-imagen.png');
```

## Formatos soportados

- PNG
- JPG/JPEG
- GIF
- SVG
- WebP

## Uso en emails

Para usar imágenes en templates de email, usa la URL del servidor:

```typescript
// En mail.service.ts
const logoUrl = this.assetsService.getLogoUrl();
const htmlContent = generateOTPEmailHTML(otp, currentYear, logoUrl);
```

### Configuración de la URL del servidor:

Agrega la variable de entorno `API_URL` en tu archivo `.env`:

```env
API_URL=https://tu-dominio.com
```

Si no se especifica, usará `http://localhost:3000` por defecto.

## Notas importantes

- Las imágenes se convierten a Base64 en tiempo de ejecución
- Para mejor rendimiento, considera cachear las imágenes Base64
- Asegúrate de que las imágenes no sean demasiado grandes para evitar problemas de memoria

## Configuración del build

El proyecto incluye un script automático que copia las imágenes durante el build:

1. **Durante el desarrollo**: Las imágenes se leen desde `src/assets/images/`
2. **Durante el build**: Las imágenes se copian automáticamente a `dist/assets/images/`
3. **El script `copy-assets.js`** se ejecuta automáticamente después de cada build

### Comandos disponibles:

```bash
# Build completo (incluye copia de assets)
npm run build

# Solo copiar assets
npm run copy-assets
```

### Solución de problemas:

Si obtienes el error "ENOENT: no such file or directory", asegúrate de:

1. ✅ Colocar tu imagen en `src/assets/images/logo.png`
2. ✅ Ejecutar `npm run build` para copiar las imágenes
3. ✅ Verificar que la imagen existe en `dist/assets/images/logo.png`
