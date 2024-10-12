import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceTrackerModule } from './price-tracker/price-tracker.module';
import { PriceAlertModule } from './price-alert/price-alert.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost', // Default to localhost if not set
      port: +process.env.DB_PORT || 5432, // Convert to number, default to 5432
      username: process.env.DB_USERNAME || 'user', // Default username if not set
      password: process.env.DB_PASSWORD || 'pass', // Default password if not set
      database: process.env.DB_DATABASE || 'price_tracker', // Default database if not set
      autoLoadEntities: true, // Automatically loads all entities from modules
      synchronize: true, // Use migrations in production
    }),
    PriceTrackerModule,
    PriceAlertModule,
  ],
})
export class AppModule {}
