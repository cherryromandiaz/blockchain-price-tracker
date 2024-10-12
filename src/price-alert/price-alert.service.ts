import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceAlert } from './entities/price-alert.entity';

@Injectable()
export class PriceAlertService {
  constructor(
    @InjectRepository(PriceAlert)
    private readonly priceAlertRepository: Repository<PriceAlert>,
  ) {}

  async setPriceAlert(alertData: { chain: string, dollar: number, email: string }) {
    const newAlert = this.priceAlertRepository.create({
      chain: alertData.chain,
      dollar: alertData.dollar,
      email: alertData.email,
    });

    await this.priceAlertRepository.save(newAlert);
    return { message: 'Price alert set successfully', data: newAlert };
  }
}