import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceTrackerService } from './price-tracker.service';
import { PriceTrackerController } from './price-tracker.controller';
import { Price } from './entities/price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Price])],
  providers: [PriceTrackerService],
  controllers: [PriceTrackerController],
})
export class PriceTrackerModule {}
