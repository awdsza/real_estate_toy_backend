import { Controller, Get, Body, Query, Param } from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { ApartSearchParamDto } from './dto/search-apartment.dto';

@Controller('/api/apartment')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}

  @Get('/')
  async getApartmentList(
    @Query('page') page: number,
    @Query('numOfRows') numOfRows: number,
    @Query('bubJeongDongCode') bubJeongDongCode: string,
    @Query('keyword') keyword: string,
    @Body() apartSearchParamDto: ApartSearchParamDto,
  ): Promise<object> {
    apartSearchParamDto = {
      ...apartSearchParamDto,
      page,
      numOfRows,
      bubJeongDongCode,
      keyword,
    };

    const [list, totalCount] = await this.apartmentService.getApartmentList(
      apartSearchParamDto,
    );
    return {
      list,
      totalCount,
      page,
      numOfRows,
      lastPage: Math.ceil(totalCount / numOfRows),
    };
  }
}
