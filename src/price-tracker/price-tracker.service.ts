import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Price } from './entities/price.entity';
import axios from 'axios';
import * as nodemailer from 'nodemailer';

@Injectable()
export class PriceTrackerService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
  ) {}

  // Runs every 5 minutes
  @Cron('*/5 * * * *')
  async checkPrices() {
    try {
      const ethereumPrice = await this.getPrice('ethereum');
      const polygonPrice = await this.getPrice('polygon');

      // Save to database
      await this.savePriceToDB(ethereumPrice, 'ethereum');
      await this.savePriceToDB(polygonPrice, 'polygon');

      // Check for 3% increase
      await this.checkPriceAlert(ethereumPrice, 'ethereum');
      await this.checkPriceAlert(polygonPrice, 'polygon');
    } catch (error) {
      console.error('Error during price check:', error);
    }
  }

  // Fetch the current price of the specified chain
  async getPrice(chain: string): Promise<number> {
    try {
      const url = `https://api.moralis.io/${chain}/price`; // Example API URL
      const response = await axios.get(url);
      return response.data.price;
    } catch (error) {
      console.error(`Error fetching ${chain} price:`, error);
      throw new Error('Failed to fetch price');
    }
  }

  // Save the current price to the database
  async savePriceToDB(price: number, chain: string) {
    const newPrice = this.priceRepository.create({ price, chain });
    await this.priceRepository.save(newPrice);
    console.log(`Saved ${chain} price: ${price}`);
  }

  // Check if the price has increased by more than 3% in the last hour
  async checkPriceAlert(currentPrice: number, chain: string) {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const previousPriceRecord = await this.priceRepository.findOne({
      where: { chain, timestamp: LessThanOrEqual(oneHourAgo) },
      order: { timestamp: 'DESC' },
    });

    if (!previousPriceRecord) {
      console.log(`No price data found for ${chain} from 1 hour ago.`);
      return;
    }

    const previousPrice = previousPriceRecord.price;
    const priceIncreasePercent = ((currentPrice - previousPrice) / previousPrice) * 100;

    console.log(`Price for ${chain} increased by ${priceIncreasePercent.toFixed(2)}%`);

    if (priceIncreasePercent > 3) {
      await this.sendEmailAlert(currentPrice, chain, priceIncreasePercent);
    }
  }

  // Send an email alert for a significant price increase
  async sendEmailAlert(currentPrice: number, chain: string, increasePercent: number) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || 'hyperhire_assignment@hyperhire.in',
      subject: `Price Alert for ${chain}: Price Increased by ${increasePercent.toFixed(2)}%`,
      text: `The price of ${chain} has increased by ${increasePercent.toFixed(2)}% in the last hour. Current price: $${currentPrice}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Price alert email sent for ${chain} (price increased by ${increasePercent.toFixed(2)}%)`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
