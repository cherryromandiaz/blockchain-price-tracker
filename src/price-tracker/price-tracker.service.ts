import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Price } from './entities/price.entity';
import axios from 'axios';

@Injectable()
export class PriceTrackerService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
  ) {}

  @Cron('*/5 * * * *')
  async checkPrices() {
    const ethereumPrice = await this.getPrice('ethereum');
    const polygonPrice = await this.getPrice('polygon');
    
    // Save to database
    await this.savePriceToDB(ethereumPrice, 'ethereum');
    await this.savePriceToDB(polygonPrice, 'polygon');
    
    // Check for 3% increase
    await this.checkPriceAlert(ethereumPrice, 'ethereum');
    await this.checkPriceAlert(polygonPrice, 'polygon');
  }

  async getPrice(chain: string) {
    const url = `https://api.moralis.io/${chain}/price`;
    const response = await axios.get(url);
    return response.data.price;
  }

  async savePriceToDB(price: number, chain: string) {
    const newPrice = this.priceRepository.create({
      price,
      chain,
    });
    
    await this.priceRepository.save(newPrice);
    console.log(`Saved ${chain} price: ${price}`);
  }

  async checkPriceAlert(price: number, chain: string) {
    // Get the price from 1 hour ago
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    // Find the latest price from one hour ago for the specified chain
    const previousPriceRecord = await this.priceRepository.findOne({
      where: {
        chain: chain,
        timestamp: { $lte: oneHourAgo },
      },
      order: { timestamp: 'DESC' }, // Get the latest record up to one hour ago
    });

    if (!previousPriceRecord) {
      console.log(`No price data for ${chain} from 1 hour ago.`);
      return;
    }

    const previousPrice = previousPriceRecord.price;

    // Calculate the percentage increase
    const priceIncreasePercent = ((currentPrice - previousPrice) / previousPrice) * 100;

    console.log(`Price for ${chain} increased by ${priceIncreasePercent.toFixed(2)}%`);

    // If the price increased by more than 3%, send an email alert
    if (priceIncreasePercent > 3) {
      await this.sendEmailAlert(currentPrice, chain, priceIncreasePercent);
    }
  }
  
  async sendEmailAlert(currentPrice: number, chain: string, increasePercent: number) {
    // Set up the email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can change this to your email provider
      auth: {
        user: process.env.EMAIL_USER, // Your email user from environment variables
        pass: process.env.EMAIL_PASS, // Your email password from environment variables
      },
    });

    // Compose the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO, // Recipient email (e.g., hyperhire_assignment@hyperhire.in)
      subject: `Price Alert for ${chain}: Price Increased by ${increasePercent.toFixed(2)}%`,
      text: `The price of ${chain} has increased by ${increasePercent.toFixed(2)}% in the last hour. Current price: $${currentPrice}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Price alert email sent for ${chain} (price increased by ${increasePercent.toFixed(2)}%)`);
  }
}
}
