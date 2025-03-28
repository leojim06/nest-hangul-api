import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
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

@Controller('jamos')
export class JamoController {
  constructor(private readonly jamoService: JamoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createJamoValidation))
  async create(@Body() data: Partial<Jamo>): Promise<{ id: string }> {
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
