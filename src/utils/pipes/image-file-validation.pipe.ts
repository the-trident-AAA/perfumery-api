import { Injectable, BadRequestException, PipeTransform } from '@nestjs/common';
import { ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';

@Injectable()
export class ImageFileValidationPipe implements PipeTransform {
  private readonly parseFilePipe: ParseFilePipe;

  constructor() {
    this.parseFilePipe = new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
      ],
    });
  }

  async transform(file: Express.Multer.File) {
    if (!file) {
      return undefined;
    }
    try {
      return await this.parseFilePipe.transform(file);
    } catch (error) {
      throw new BadRequestException('Invalid file: ' + error.message);
    }
  }
}
