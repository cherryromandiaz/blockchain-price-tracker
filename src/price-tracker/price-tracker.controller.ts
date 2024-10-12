import { Controller, Get, Param } from '@nestjs/common';
import { PriceTrackerService } from './price-tracker.service';

@Controller('prices')
export class PriceTrackerController {
  constructor(private readonly priceTrackerService: PriceTrackerService) {}

  @Get(':chain/hourly')
  async getHourlyPrices(@Param('chain') chain: string) {
    return this.priceTrackerService.getHourlyPrices(chain);
  }
  
  @Get('swap-rate')
  async getSwapRate(@Query('ethAmount') ethAmount: number) {
    const currentEthPrice = await this.priceTrackerService.getCurrentEthPrice(); // Implement this method to fetch the current price
    const btcAmount = await this.priceTrackerService.getBtcEquivalent(ethAmount);
    const fee = ethAmount * 0.03;  // 3% fee
    
    return { btcAmount, fee, feeInDollar: fee * currentEthPrice };
  }
}
