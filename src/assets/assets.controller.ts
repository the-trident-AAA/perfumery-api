import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller('assets')
export class AssetsController {
  @Get('images/:filename')
  serveImage(@Param('filename') filename: string, @Res() res: Response) {
    const imagePath = join(process.cwd(), 'src', 'assets', 'images', filename);
    
    if (!existsSync(imagePath)) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    res.sendFile(imagePath);
  }
}
