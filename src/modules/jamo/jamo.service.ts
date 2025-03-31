import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JamoRepository } from './jamo.repository';
import { Jamo } from './jamo.schema';
import { JamoResponseDto, JamoResponseSchema } from './jamo.response.dto';
import { Audio, AudioType } from './audio.schema';
import { AudioRepository } from './audio.repository';
import { FileUploadService } from './fileUpload.service';

@Injectable()
export class JamoService {
  constructor(
    private readonly jamoRepository: JamoRepository,
    private readonly audioRepository: AudioRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(data: Partial<Jamo>): Promise<{ id: string }> {
    const newJamo = this.jamoRepository.create(data);
    return { id: (await newJamo).id };
  }

  async findAll(): Promise<JamoResponseDto[]> {
    const jamos = await this.jamoRepository.findAll();
    return jamos.map((jamo) => JamoResponseSchema.parse(jamo));
  }

  async findOne(id: string): Promise<JamoResponseDto> {
    // const jamo = await this.jamoRepository.findOne(id);
    // if (!jamo) throw new NotFoundException(`Jamo con id ${id} no encontrado`);
    // return JamoResponseSchema.parse(jamo);

    // Creacion de respuesta de forma manual
    const jamo = await this.jamoRepository.findOneWithDetail(id);
    if (!jamo) throw new NotFoundException(`Jamo con id ${id} no encontrado`);

    // console.log(jamo);
    // const dto = JamoResponseSchema.parse(jamo.toObject()); // Convertimos al DTO
    // console.log(dto);

    // return dto;

    const dto: JamoResponseDto = {
      id: jamo._id,
      character: jamo.character,
      name: jamo.name,
      type: jamo.type,
      characterRomaji: jamo.character_romaji,
      nameRomaji: jamo.name_romaji,
      pronunciation: jamo.pronunciation,
      imageUrl: jamo.imageUrl,
      audios: jamo.audios.map((audio) => ({
        id: audio._id,
        character: audio.character,
        type: audio.type,
        url: audio.url,
      })),
    };
    return dto;

    // // Transformamos el esquema de MongoDB al DTO
    // const dto: JamoResponseDto = JamoResponseSchema.parse({
    //   id: jamo.id,
    //   character: jamo.character,
    //   name: jamo.name,
    //   type: jamo.type,
    //   characterRomaji: jamo.character_romaji, // Se mapea al formato camelCase
    //   nameRomaji: jamo.name_romaji,
    //   pronunciation: jamo.pronunciation,
    //   imageUrl: jamo.imageUrl,
    //   audios: jamo.audios.map((audio) => ({
    //     id: audio.id,
    //     character: audio.character,
    //     type: audio.type,
    //     url: audio.url,
    //   })),
    // });
    // return dto;
  }

  async update(id: string, data: Partial<Jamo>): Promise<void> {
    const jamo = await this.jamoRepository.update(id, data);
    if (!jamo) throw new NotFoundException(`Jamo con id ${id} no encontrado`);

    // return jamo;
  }

  async delete(id: string): Promise<Jamo> {
    const jamo = await this.jamoRepository.delete(id);
    if (!jamo) throw new NotFoundException(`Jamo con id ${id} no encontrado`);

    return jamo;
  }

  async getJamoWithMedia(id: string) {
    const jamo = await this.jamoRepository.delete(id);
    if (!jamo) throw new NotFoundException(`Jamo con id ${id} no encontrado`);

    const audios = await this.audioRepository.findByJamoId(id);

    return { ...jamo, audios };
  }

  async uploadImages(id: string, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se ha subido ningún archivo');

    const jamo = await this.jamoRepository.findOne(id);
    if (!jamo) throw new NotFoundException(`Jamo con id ${id} no encontrado`);

    // Generar el nombre del archivo y cargarlo usando servicio
    const filename = `${jamo.character}.png`;
    const imageUrl = await this.fileUploadService.saveFile(
      file.buffer,
      filename,
      `${jamo.id}/imagenes`,
    );

    // // Definir la ruta de guardado
    // const uploadDir = path.join(
    //   __dirname,
    //   '..',
    //   '..',
    //   'uploads',
    //   id,
    //   'imagenes',
    // );
    // const filename = `${jamo.character}.png`;
    // const filePath = path.join(uploadDir, filename);

    // // Crea la carpeta si no existe
    // if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // // Guardar el archivo en el servidor
    // fs.writeFileSync(filePath, file.buffer);

    // // Crear la URL de acceso a la imagen
    // const imageUrl = `https://example.com/uploads/${id}/imagenes/${filename}`;

    // Actualiza la URL del jamo y guarda en base de datos
    jamo.imageUrl = imageUrl;
    await this.jamoRepository.update(id, jamo);

    return {
      message: 'Imagen subida exitosamente',
      url: `https://example.com/${imageUrl}`,
    };
  }

  async uploadAudios(
    id: string,
    files: Express.Multer.File[],
    audioTypes: { filename: string; type: AudioType }[],
  ) {
    const jamo = await this.jamoRepository.findOne(id);
    if (!jamo) throw new NotFoundException(`Jamo con id ${id} no encontrado`);

    const uploadedFiles: Audio[] = [];

    for (const file of files) {
      const { originalname, buffer } = file;

      // Encontrar el tipo de audio correspondiente al archivo actual
      // Si en la petición no encuentra un tipo para el archivo, lanza error
      const fileTypeInfo = audioTypes.find((t) => t.filename === originalname);

      if (!fileTypeInfo)
        throw new BadRequestException(
          `No se encontró tipo de audio para el archivo ${originalname}`,
        );

      // extrae el typo del audio desde la petición ya filtrada en el paso anterior
      // si el tipo específico para este archivo no se encuentra en el enum de tipos de audio, lanza error
      const { type } = fileTypeInfo;
      if (!AudioType[type])
        throw new BadRequestException(
          `Tipo de audio inválido para ${originalname}.`,
        );

      // Generar el nombre del archivo y usar el servicio para guardar el audio en la ruta indicada
      const typeName = AudioType.COMBINADO !== type ? `-${type}` : '';
      const filename = `${jamo.character}${typeName}.mp3`;
      const imageUrl = await this.fileUploadService.saveFile(
        buffer,
        filename,
        `${jamo.id}/imagenes`,
      );

      // const typeName = AudioType.COMBINADO !== type ? `-${type}` : '';
      // const uploadPath = `uploads/${id}/audios/${jamo.character}${typeName}.mp3`;
      // fs.writeFileSync(uploadPath, buffer);

      const audio = await this.audioRepository.save({
        jamoId: jamo.id,
        character: jamo.character,
        type,
        url: `https://example.com/${imageUrl}`,
      });

      uploadedFiles.push(audio);
    }

    return { message: 'Audios subidos exitosamente', files: uploadedFiles };
  }
}

// Metodo para cargar audios con transacción

// async uploadAudios(
//   id: string,
//   files: Express.Multer.File[],
//   audioTypes: { filename: string; type: AudioType }[],
// ) {
//   const jamo = await this.jamoRepository.findOne(id);
//   if (!jamo) throw new NotFoundException(`Jamo con id ${id} no encontrado`);

//   // Iniciar sesión de transacción en MongoDB
//   const session = await this.audioRepository.startTransaction();
//   const uploadedFiles: Audio[] = [];
//   const savedFilePaths: string[] = []; // Rutas de archivos guardados para posible rollback

//   try {
//     for (const file of files) {
//       const { originalname, buffer } = file;
//       const fileTypeInfo = audioTypes.find((t) => t.filename === originalname);

//       if (!fileTypeInfo)
//         throw new BadRequestException(`No se encontró tipo de audio para ${originalname}`);

//       const { type } = fileTypeInfo;
//       if (!AudioType[type])
//         throw new BadRequestException(`Tipo de audio inválido para ${originalname}.`);

//       // Generar nombre del archivo y guardarlo
//       const typeName = AudioType.COMBINADO !== type ? `-${type}` : '';
//       const filename = `${jamo.character}${typeName}.mp3`;
//       const filePath = await this.fileUploadService.saveFile(
//         file.buffer,
//         filename,
//         `${jamo.id}/audios`,
//       );

//       savedFilePaths.push(filePath); // Guardar la ruta en caso de rollback

//       const audio = await this.audioRepository.save(
//         {
//           jamoId: jamo.id,
//           character: jamo.character,
//           type,
//           url: `https://example.com/${filePath}`,
//         },
//         session, // Incluir la sesión de la transacción
//       );

//       uploadedFiles.push(audio);
//     }

//     // Confirmar la transacción
//     await session.commitTransaction();
//     return { message: 'Audios subidos exitosamente', files: uploadedFiles };
//   } catch (error) {
//     // Si ocurre un error, eliminar los archivos subidos y revertir la transacción
//     for (const path of savedFilePaths) {
//       await this.fileUploadService.deleteFile(path);
//     }
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     session.endSession();
//   }
// }
