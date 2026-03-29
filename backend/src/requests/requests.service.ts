import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialDetail } from '../material-details/entities/material-detail.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Request } from './entities/request.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private readonly requestsRepository: Repository<Request>,
    @InjectRepository(MaterialDetail)
    private readonly materialDetailsRepository: Repository<MaterialDetail>,
  ) {}

  async create(createRequestDto: CreateRequestDto) {
    const request = this.requestsRepository.create({
      ...createRequestDto,
      request_date: createRequestDto.request_date,
      requester_name: createRequestDto.requester_name,
      status: 'pending',
    });

    const savedRequest = await this.requestsRepository.save(request);

    const materialDetails = createRequestDto.materials.map((material) =>
      this.materialDetailsRepository.create({
        request_id: savedRequest.id,
        material_description: material.material_description,
        quantity: material.quantity,
        unit: material.unit,
        price: material.price ?? null,
        notes: material.notes ?? null,
      }),
    );

    await this.materialDetailsRepository.save(materialDetails);

    const createdRequest = await this.findOneEntity(savedRequest.id);

    return {
      message: 'Material request created successfully',
      data: createdRequest,
    };
  }

  async findAll(search?: string, dateFrom?: string, dateTo?: string) {
    const queryBuilder = this.requestsRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.material_details', 'material_details')
      .orderBy('request.id', 'DESC');

    if (search) {
      queryBuilder.andWhere('LOWER(request.requester_name) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    if (dateFrom) {
      queryBuilder.andWhere('request.request_date >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('request.request_date <= :dateTo', { dateTo });
    }

    const requests = await queryBuilder.getMany();

    return {
      message: 'Material requests fetched successfully',
      data: requests,
    };
  }

  async findOne(id: number) {
    const request = await this.findOneEntity(id);

    return {
      message: 'Material request fetched successfully',
      data: request,
    };
  }

  async update(id: number, updateRequestDto: UpdateRequestDto) {
    const request = await this.findOneEntity(id);

    if (updateRequestDto.request_date !== undefined) {
      request.request_date = updateRequestDto.request_date;
    }

    if (updateRequestDto.requester_name !== undefined) {
      request.requester_name = updateRequestDto.requester_name;
    }

    if (updateRequestDto.status !== undefined) {
      request.status = updateRequestDto.status;
    }

    await this.requestsRepository.save(request);

    const updatedRequest = await this.findOneEntity(id);

    return {
      message: 'Material request updated successfully',
      data: updatedRequest,
    };
  }

  async remove(id: number) {
    const request = await this.findOneEntity(id);
    await this.requestsRepository.remove(request);

    return {
      message: 'Material request deleted successfully',
      data: null,
    };
  }

  private async findOneEntity(id: number) {
    const request = await this.requestsRepository.findOne({
      where: { id },
      relations: ['material_details'],
    });

    if (!request) {
      throw new NotFoundException(`Request with id ${id} not found`);
    }

    return request;
  }
}
