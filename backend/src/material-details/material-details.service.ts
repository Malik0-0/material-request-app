import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from '../requests/entities/request.entity';
import { CreateMaterialDetailDto } from './dto/create-material-detail.dto';
import { MaterialDetail } from './entities/material-detail.entity';

@Injectable()
export class MaterialDetailsService {
  constructor(
    @InjectRepository(MaterialDetail)
    private readonly materialDetailsRepository: Repository<MaterialDetail>,
    @InjectRepository(Request)
    private readonly requestsRepository: Repository<Request>,
  ) {}

  async createForRequest(requestId: number, dto: CreateMaterialDetailDto) {
    await this.ensureRequestExists(requestId);

    const row = this.materialDetailsRepository.create({
      request_id: requestId,
      material_description: dto.material_description,
      quantity: dto.quantity,
      unit: dto.unit,
      price: dto.price ?? null,
      notes: dto.notes ?? null,
    });

    const saved = await this.materialDetailsRepository.save(row);

    return {
      message: 'Material detail created successfully',
      data: saved,
    };
  }

  async updateForRequest(
    requestId: number,
    detailId: number,
    dto: CreateMaterialDetailDto,
  ) {
    await this.ensureRequestExists(requestId);

    const detail = await this.materialDetailsRepository.findOne({
      where: { id: detailId, request_id: requestId },
    });

    if (!detail) {
      throw new NotFoundException(
        `Material detail ${detailId} not found for request ${requestId}`,
      );
    }

    detail.material_description = dto.material_description;
    detail.quantity = dto.quantity;
    detail.unit = dto.unit;
    detail.price = dto.price ?? null;
    detail.notes = dto.notes ?? null;

    const saved = await this.materialDetailsRepository.save(detail);

    return {
      message: 'Material detail updated successfully',
      data: saved,
    };
  }

  async removeForRequest(requestId: number, detailId: number) {
    await this.ensureRequestExists(requestId);

    const detail = await this.materialDetailsRepository.findOne({
      where: { id: detailId, request_id: requestId },
    });

    if (!detail) {
      throw new NotFoundException(
        `Material detail ${detailId} not found for request ${requestId}`,
      );
    }

    await this.materialDetailsRepository.remove(detail);

    return {
      message: 'Material detail deleted successfully',
      data: null,
    };
  }

  private async ensureRequestExists(requestId: number): Promise<void> {
    const exists = await this.requestsRepository.exist({
      where: { id: requestId },
    });

    if (!exists) {
      throw new NotFoundException(`Request with id ${requestId} not found`);
    }
  }
}
