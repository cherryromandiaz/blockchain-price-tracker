import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password',
    },
  });

  async sendPriceAlert(chain: string, price: number) {
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: 'hyperhire_assignment@hyperhire.in',
      subject: `${chain} price alert`,
      text: `The price of ${chain} has increased by more than 3%. Current price: ${price}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
