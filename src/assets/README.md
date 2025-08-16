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

Para usar imágenes en templates de email, convierte la imagen a Base64 y pásala como parámetro:

```typescript
// En mail.service.ts
const logoBase64 = this.assetsService.getLogoAsBase64();
const htmlContent = generateOTPEmailHTML(otp, currentYear, logoBase64);
```

## Notas importantes

- Las imágenes se convierten a Base64 en tiempo de ejecución
- Para mejor rendimiento, considera cachear las imágenes Base64
- Asegúrate de que las imágenes no sean demasiado grandes para evitar problemas de memoria
