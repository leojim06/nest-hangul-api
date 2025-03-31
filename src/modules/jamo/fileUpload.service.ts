import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class FileUploadService {
  private uploadPath = path.join(__dirname, '../../uploads');

  constructor() {}

  async saveFile(
    buffer: Buffer,
    filename: string,
    subPath: string,
  ): Promise<string> {
    const dirPath = path.join(this.uploadPath, subPath);

    // Crea la carpeta si no existe
    await fs.mkdir(dirPath, { recursive: true });

    // Guardar el archivo en el servidor
    const filePath = path.join(dirPath, filename);
    await fs.writeFile(filePath, buffer);

    return `/uploads/${subPath}/${filename}`;
  }

  getFileExtension(originalName: string): string {
    const fileExt = path.extname(originalName);
    return fileExt;
  }
}
