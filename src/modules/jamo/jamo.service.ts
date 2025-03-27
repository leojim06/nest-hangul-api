import { Injectable, NotFoundException } from '@nestjs/common';
import { JamoRepository } from './jamo.repository';
import { Jamo } from './jamo.schema';
import { JamoResponseDto, jamoResponseSchema } from './jamo.response.dto';

@Injectable()
export class JamoService {
  constructor(private readonly jamoRepository: JamoRepository) {}

  async create(data: Partial<Jamo>): Promise<{ id: string }> {
    const newJamo = this.jamoRepository.create(data);
    return { id: (await newJamo).id };
  }

  async findAll(): Promise<JamoResponseDto[]> {
    const jamos = await this.jamoRepository.findAll();
    return jamos.map((jamo) => jamoResponseSchema.parse(jamo));
  }

  async findOne(id: string): Promise<JamoResponseDto> {
    const jamo = await this.jamoRepository.findOne(id);
    if (!jamo) {
      throw new NotFoundException(`Jamo con id ${id} no encontrado`);
    }
    return jamoResponseSchema.parse(jamo);
  }

  async update(id: string, data: Partial<Jamo>): Promise<Jamo> {
    const updatedJamo = await this.jamoRepository.update(id, data);
    if (!updatedJamo) {
      throw new NotFoundException(`Jamo con id ${id} no encontrado`);
    }
    return updatedJamo;
  }

  async delete(id: string): Promise<Jamo> {
    const deletedJamo = await this.jamoRepository.delete(id);
    if (!deletedJamo) {
      throw new NotFoundException(`Jamo con id ${id} no encontrado`);
    }
    return deletedJamo;
  }
}
