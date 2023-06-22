import { Controller, Body, Get, Param, Query } from '@nestjs/common';
import { TradeService } from './service/deal.service';
import { DealSearchParamDto } from './dto/search-deal.dto';
import { BatchService } from './service/batch.service';
@Controller('/api/deal')
export class TradeController {
  constructor(
    private readonly tradeService: TradeService,
    private readonly batchService: BatchService,
  ) {}

  @Get('/batch/:yyyymm')
  async insertTradeData(@Param('yyyymm') yyyymm: number): Promise<void> {
    this.batchService.tradeBatch(yyyymm);
    this.batchService.rentBatch(yyyymm);
  }
  @Get('/list')
  async getDealData(
    @Query('bubJeongDongCode') bubJeongDongCode: string,
    @Query('jibun') jibun: string,
    @Query('page') page: number,
    @Query('dealType') dealType: string,
    @Query('numOfRows') numOfRows: number,
    @Body() searchParamDto: DealSearchParamDto,
  ): Promise<object> {
    searchParamDto = {
      ...searchParamDto,
      bubJeongDongCode,
      jibun,
      page,
      numOfRows,
    };
    try {
      const resultData =
        dealType === 'trade'
          ? await this.tradeService.getTradeData(searchParamDto)
          : await this.tradeService.getRentData(searchParamDto);
      return { error: null, data: resultData };
    } catch (error) {
      return { error, data: null };
    }
  }
  @Get('/chart')
  async getTradeChartData(
    @Query('bubJeongDongCode') bubJeongDongCode: string,
    @Query('jibun') jibun: string,
    @Query('startYear') startYear: number,
    @Query('endYear') endYear: number,
    @Query('dealType') dealType: string,
    @Body() searchParamDto: DealSearchParamDto,
  ): Promise<object> {
    searchParamDto = {
      ...searchParamDto,
      bubJeongDongCode,
      jibun,
      startYear,
      endYear,
    };
    try {
      const resultData =
        dealType === 'trade'
          ? await await this.tradeService.getTradeChartData(searchParamDto)
          : await this.tradeService.getRentChartData(searchParamDto);
      return { error: null, data: resultData };
    } catch (error) {
      return { error, data: null };
    }
  }
}
