import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateMaterialDetailDto } from './dto/create-material-detail.dto';
import { MaterialDetailsService } from './material-details.service';

@Controller('requests/:requestId/details')
export class RequestMaterialDetailsController {
  constructor(private readonly materialDetailsService: MaterialDetailsService) {}

  @Post()
  create(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Body() dto: CreateMaterialDetailDto,
  ) {
    return this.materialDetailsService.createForRequest(requestId, dto);
  }

  @Put(':detailId')
  update(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Param('detailId', ParseIntPipe) detailId: number,
    @Body() dto: CreateMaterialDetailDto,
  ) {
    return this.materialDetailsService.updateForRequest(
      requestId,
      detailId,
      dto,
    );
  }

  @Delete(':detailId')
  remove(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Param('detailId', ParseIntPipe) detailId: number,
  ) {
    return this.materialDetailsService.removeForRequest(requestId, detailId);
  }
}
