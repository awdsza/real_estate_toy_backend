import { Controller, Param, Get } from '@nestjs/common';
import { BubjeongdongService } from './bubjeongdong.service';

@Controller('/api/bubjeongdong')
export class BubjeongdongController {
  constructor(private readonly bubjeongdongService: BubjeongdongService) {}
  @Get('/')
  async getSidoList(): Promise<object> {
    return await this.getBubjeongdongList(null);
  }
  @Get('/:code')
  async getBubjeongdongList(@Param('code') code: string): Promise<object> {
    return await this.bubjeongdongService.getBubjeongdongList(code);
  }
}
