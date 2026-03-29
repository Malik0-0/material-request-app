import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { Request } from './entities/request.entity';
import { MaterialDetail } from '../material-details/entities/material-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request, MaterialDetail])],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}
