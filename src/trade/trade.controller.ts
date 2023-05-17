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
    @Query('dealYear') dealYear: number,
    @Body() searchParamDto: TradeSearchParamDto,
  ): Promise<object> {
    searchParamDto = { ...searchParamDto, bubJeongDongCode, jibun, dealYear };
    return await this.tradeService.getTradeData(searchParamDto);
  }
}
