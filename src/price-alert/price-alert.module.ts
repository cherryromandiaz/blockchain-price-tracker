import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceAlertController } from './price-alert.controller';
import { PriceAlertService } from './price-alert.service';
import { PriceAlert } from './entities/price-alert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PriceAlert])],
  controllers: [PriceAlertController],
  providers: [PriceAlertService],
})
export class PriceAlertModule {}
