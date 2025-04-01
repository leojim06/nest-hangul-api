import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JamoService } from './jamo.service';
import {
  CreateJamoDto,
  CreateJamoValidation,
  UpdateJamoDto,
  UpdateJamoValidation,
} from './jamo.validation.dto';
import { JamoResponseDto } from './jamo.response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/user.schema';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuditService } from '../audit/audit.service';
import {
  AudioFileType,
  AudioFileTypeRequest,
  ExtendedRequest,
} from './jamo.interfaces';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AudioType } from './audio.schema';

@ApiTags('Jamo') // Agrupa en Swagger
@Controller('jamos')
export class JamoController {
  constructor(
    private readonly jamoService: JamoService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear un nuevo caracter',
    description: 'Registra un nuevo Jamo en la base de datos.',
  })
  @ApiResponse({
    status: 201,
    description: 'Jamo creado exitosamente',
    schema: { example: { id: '222217b7-9112-4435-a842-7800eb2f1b1f' } },
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta. Verifica los datos enviados.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Se requiere un token válido.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(201)
  async create(
    @Req() req: ExtendedRequest,
    @Body() createJamoDto: CreateJamoDto,
  ): Promise<{ id: string }> {
    const validateData = CreateJamoValidation.safeParse(createJamoDto);
    if (!validateData.success) {
      throw new BadRequestException(validateData.error.format());
    }

    await this.auditRequest('CREATE_JAMO', req.url, req.user?.userId, req.ip);
    return this.jamoService.create(validateData.data);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los Jamos',
    description: 'Devuelve una lista con todos los Jamos disponibles.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de Jamos recuperada exitosamente',
    schema: {
      example: [
        {
          id: '222217b7-9112-4435-a842-7800eb2f1b1f',
          character: 'ㅏ',
          category: 'Vocal',
          name: 'a',
          romajiName: 'a',
          img: 'jamo-image.png',
          audio: 'jamo-audio.mp3',
        },
      ],
    },
  })
  async findAll(): Promise<JamoResponseDto[]> {
    return this.jamoService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un Jamo por ID',
    description: 'Busca un Jamo en la base de datos por su ID único.',
  })
  @ApiParam({
    name: 'id',
    example: '222217b7-9112-4435-a842-7800eb2f1b1f',
    description: 'El identificador único del Jamo',
  })
  @ApiResponse({
    status: 200,
    description: 'Jamo encontrado',
    schema: {
      example: {
        id: '222217b7-9112-4435-a842-7800eb2f1b1f',
        character: 'ㅏ',
        category: 'Vocal',
        name: 'a',
        romajiName: 'a',
        img: 'jamo-image.png',
        audio: 'jamo-audio.mp3',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Jamo no encontrado' })
  async findOne(@Param('id') id: string): Promise<JamoResponseDto> {
    return this.jamoService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar un Jamo',
    description: 'Actualiza la información de un Jamo existente.',
  })
  @ApiParam({
    name: 'id',
    example: '222217b7-9112-4435-a842-7800eb2f1b1f',
    description: 'El identificador único del Jamo',
  })
  @ApiResponse({ status: 204, description: 'Jamo actualizado correctamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para la actualización',
  })
  @ApiResponse({ status: 404, description: 'Jamo no encontrado' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Se requiere un token válido.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VISITOR)
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @Body() updateJamoDto: UpdateJamoDto,
    @Req() req: ExtendedRequest,
  ): Promise<void> {
    const validateData = UpdateJamoValidation.safeParse(updateJamoDto);
    if (!validateData.success) {
      throw new BadRequestException(validateData.error.format());
    }
    await this.auditRequest('UPDATE_JAMO', req.url, req.user?.userId, req.ip);
    await this.jamoService.update(id, validateData.data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Eliminar un Jamo',
    description: 'Borra un Jamo de la base de datos.',
  })
  @ApiParam({
    name: 'id',
    example: '222217b7-9112-4435-a842-7800eb2f1b1f',
    description: 'El identificador único del Jamo',
  })
  @ApiResponse({ status: 204, description: 'Jamo eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Jamo no encontrado' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Se requiere un token válido.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(204)
  async delete(
    @Req() req: ExtendedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    await this.auditRequest('DELETE_JAMO', req.url, req.user?.userId, req.ip);
    await this.jamoService.delete(id);
  }

  @Get(':id/detail')
  async getJamoDetail(@Param('id') id: string) {
    return this.jamoService.getJamoWithMedia(id);
  }

  @Post(':id/upload-images')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(201)
  async uploadImages(
    @Req() req: ExtendedRequest,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    await this.auditRequest('UPLOAD_IMAGE', req.url, req.user?.userId, req.ip);
    await this.jamoService.uploadImages(id, file);
  }

  @Post(':id/upload-audios')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(201)
  async uploadAudios(
    @Req() req: ExtendedRequest,
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('audioTypes') audioTypes: string,
  ): Promise<void> {
    if (!audioTypes)
      throw new BadRequestException(
        'Debe proporcionar los tipos de los audios',
      );

    let parsedTypes: AudioFileTypeRequest[];
    try {
      parsedTypes = JSON.parse(audioTypes);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'El formato de los tipos de audio no es válido',
      );
    }

    if (!Array.isArray(parsedTypes) || parsedTypes.length !== files.length) {
      throw new BadRequestException(
        'El número de archivos debe coincidir con el número de tipos de audio.',
      );
    }

    const validatedTypes: AudioFileType[] = parsedTypes.map((audioType) => {
      const validType = Object.values(AudioType).includes(
        audioType.type as AudioType,
      )
        ? (audioType.type as AudioType)
        : null;

      if (!validType)
        throw new BadRequestException(
          `Tipo de audio inválido: ${audioType.type}`,
        );

      if (validType === AudioType.COMBINADO && !audioType.combinedWith)
        throw new BadRequestException(
          `El audio ${audioType.filename} requiere un un caracter con el cual combinarse`,
        );

      const audioInfo: AudioFileType = {
        filename: audioType.filename,
        type: validType,
        combinedWith: audioType.combinedWith,
      };

      return audioInfo;
    });

    await this.auditRequest('UPLOAD_AUDIOS', req.url, req.user?.userId, req.ip);
    await this.jamoService.uploadAudios(id, files, validatedTypes);
  }

  /**
   * Metodo privado para auditar la acción realizada
   * @param action: Accioón realizada
   * @param url: Url del endpoint usado para efectuar la accion
   * @param userId: Usuario que realiza la acción
   * @param ip: Ip desde la que se realiza la acción
   */
  private async auditRequest(
    action: string,
    url: string,
    userId: string = 'unknown',
    ip: string = 'unknown',
  ): Promise<void> {
    await this.auditService.logAction(userId, action, url, ip);
  }
}
