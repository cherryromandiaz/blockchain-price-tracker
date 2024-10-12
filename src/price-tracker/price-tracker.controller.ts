import { Controller, Get, Param } from '@nestjs/common';
import { PriceTrackerService } from './price-tracker.service';

@Controller('prices')
export class PriceTrackerController {
  constructor(private readonly priceTrackerService: PriceTrackerService) {}

  @Get(':chain/hourly')
  async getHourlyPrices(@Param('chain') chain: string) {
    return this.priceTrackerService.getHourlyPrices(chain);
  }
}
