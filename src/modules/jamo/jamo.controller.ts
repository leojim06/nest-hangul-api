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
  UseGuards,
} from '@nestjs/common';
import { JamoService } from './jamo.service';
import {
  createJamoValidation,
  updateJamoValidation,
} from './jamo.validation.dto';
import { JamoResponseDto } from './jamo.response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('jamos')
export class JamoController {
  constructor(private readonly jamoService: JamoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async create(@Body() data: unknown): Promise<{ id: string }> {
    const validateData = createJamoValidation.safeParse(data);
    if (!validateData.success) {
      throw new BadRequestException(validateData.error.format());
    }

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
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() data: unknown): Promise<void> {
    const validatedData = updateJamoValidation.safeParse(data);
    if (!validatedData.success) {
      throw new BadRequestException(validatedData.error.format());
    }
    await this.jamoService.update(id, validatedData.data);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this.jamoService.delete(id);
  }
}
