import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImagesFileValidationPipe implements PipeTransform {
  transform(files: Express.Multer.File[]) {
    // Validar que al menos hay una imagen
    if (!files || files.length === 0) {
      return undefined;
    }

    // Validar cada archivo
    for (const file of files) {
      // Validar el tipo de archivo
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        throw new BadRequestException(
          `El archivo ${file.originalname} no es una imagen válida. Solo se permiten imágenes jpg, jpeg, png, gif o webp.`,
        );
      }

      // Validar el tamaño del archivo (ejemplo: 2MB)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new BadRequestException(
          `La imagen ${file.originalname} es demasiado grande. El tamaño máximo permitido es 2MB.`,
        );
      }
    }

    return files;
  }
}
