import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from '../requests/entities/request.entity';
import { MaterialDetail } from './entities/material-detail.entity';
import { MaterialDetailsService } from './material-details.service';
import { RequestMaterialDetailsController } from './request-material-details.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialDetail, Request])],
  controllers: [RequestMaterialDetailsController],
  providers: [MaterialDetailsService],
  exports: [MaterialDetailsService],
})
export class MaterialDetailsModule {}
