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
  createJamoValidation,
  updateJamoValidation,
} from './jamo.validation.dto';
import { JamoResponseDto } from './jamo.response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/user.schema';
import { Jamo } from './jamo.schema';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuditService } from '../audit/audit.service';
import { ExtendedRequest } from './jamo.interfaces';

@Controller('jamos')
export class JamoController {
  constructor(
    private readonly jamoService: JamoService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(201)
  async create(
    @Req() req: ExtendedRequest,
    @Body() data: Partial<Jamo>,
  ): Promise<{ id: string }> {
    const validateData = createJamoValidation.safeParse(data);
    if (!validateData.success) {
      throw new BadRequestException(validateData.error.format());
    }

    await this.auditRequest('CREATE_JAMO', req.url, req.user?.userId, req.ip);
    return this.jamoService.create(validateData.data);
  }

  @Get()
  async findAll(): Promise<JamoResponseDto[]> {
    return this.jamoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<JamoResponseDto> {
    return this.jamoService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VISITOR)
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Jamo>,
    @Req() req: ExtendedRequest,
  ): Promise<void> {
    const validatedData = updateJamoValidation.safeParse(data);
    if (!validatedData.success) {
      throw new BadRequestException(validatedData.error.format());
    }
    await this.auditRequest('UPDATE_JAMO', req.url, req.user?.userId, req.ip);
    await this.jamoService.update(id, validatedData.data);
  }

  @Delete(':id')
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
