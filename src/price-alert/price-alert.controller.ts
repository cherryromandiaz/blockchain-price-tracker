import { Controller, Post, Body } from '@nestjs/common';
import { PriceAlertService } from './price-alert.service';

@Controller('alerts')
export class PriceAlertController {
  constructor(private readonly priceAlertService: PriceAlertService) {}

  @Post('set')
  async setPriceAlert(@Body() alertData: { chain: string, dollar: number, email: string }) {
    return this.priceAlertService.setPriceAlert(alertData);
  }
}