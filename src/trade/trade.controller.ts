import { Controller, Body, Get, Param, Query } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeSearchParamDto } from './dto/search-trade.dto';
@Controller('/api/trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get('/batch/:yyyymm')
  async insertTradeData(@Param('yyyymm') yyyymm: number): Promise<void> {
    this.tradeService.batch(yyyymm);
  }
  @Get('/detail')
  async getTradeData(
    @Query('bubJeongDongCode') bubJeongDongCode: string,
    @Query('jibun') jibun: string,
    @Query('startYear') startYear: number,
    @Query('endYear') endYear: number,
    @Query('page') page: number,
    @Query('numOfRows') numOfRows: number,
    @Body() searchParamDto: TradeSearchParamDto,
  ): Promise<object> {
    searchParamDto = {
      ...searchParamDto,
      bubJeongDongCode,
      jibun,
      startYear,
      endYear,
      page,
      numOfRows,
    };
    try {
      const resultData = await this.tradeService.getTradeData(searchParamDto);
      return { error: null, data: resultData };
    } catch (error) {
      return { error, data: null };
    }
  }
}
