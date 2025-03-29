import {
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
  UsePipes,
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
import { ZodValidationPipe } from 'src/common/validations/zod-validation.pipe';
import { Jamo } from './jamo.schema';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuditService } from '../audith/audit.service';
import { ExtendedRequest } from './jamo.interfaces';

@Controller('jamos')
export class JamoController {
  constructor(
    private readonly jamoService: JamoService,
    // private readonly auditService: AuditService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createJamoValidation))
  async create(
    @Body() data: Partial<Jamo>,
    // @Req() req: ExtendedRequest,
  ): Promise<{ id: string }> {
    // console.log('Usuario en create jamo', req.user);
    // await this.auditService.logAction(
    //   req.user?.username || 'unknown',
    //   'CREATE_JAMO',
    //   req.url,
    //   req.ip || 'unknown',
    // );

    return this.jamoService.create(data);
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
  @UsePipes(new ZodValidationPipe(updateJamoValidation))
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Jamo>,
  ): Promise<void> {
    await this.jamoService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this.jamoService.delete(id);
  }
}
