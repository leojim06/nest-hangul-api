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
  UseGuards,
} from '@nestjs/common';
import { JamoService } from './jamo.service';
import {
  CreateJamoDto,
  createJamoValidation,
  UpdateJamoDto,
  updateJamoValidation,
} from './jamo.validation.dto';
import { JamoResponseDto } from './jamo.response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/user.schema';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuditService } from '../audit/audit.service';
import { ExtendedRequest } from './jamo.interfaces';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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
    const validateData = createJamoValidation.safeParse(createJamoDto);
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
    const validatedData = updateJamoValidation.safeParse(updateJamoDto);
    if (!validatedData.success) {
      throw new BadRequestException(validatedData.error.format());
    }
    await this.auditRequest('UPDATE_JAMO', req.url, req.user?.userId, req.ip);
    await this.jamoService.update(id, validatedData.data);
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

  private async auditRequest(
    action: string,
    url: string,
    userId: string = 'unknown',
    ip: string = 'unknown',
  ): Promise<void> {
    await this.auditService.logAction(userId, action, url, ip);
  }
}
