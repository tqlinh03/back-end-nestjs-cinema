import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { customAlphabet } from 'nanoid'
import { SeatsioClient, Region } from 'seatsio';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}
  async create(createBookingDto: CreateBookingDto) {
    const { seats } = createBookingDto;
    const nanoid = customAlphabet(
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 
      10
    )
    const ma_GD = nanoid(10);

    let client = new SeatsioClient(
      Region.OC(),
      'b82a0d82-a8a4-4790-ade9-32a408c2de61',
    );
    const bookingSeats = await client.events.book(
      '2c219f18-9856-4bee-9ca8-5e56e4c633cb',
      seats,
    );
    if (bookingSeats) {
      const newBooking = await this.bookingsRepository.create({
        ...createBookingDto,
        ma_GD,
      });
      return await this.bookingsRepository.save(newBooking);
    }
    return new BadRequestException(`Booking failed`);
  }

  async update(_id: number) {
    const ticket = await this.bookingsRepository.findOne({ where: { _id } });
    if (ticket) {
      ticket.isPayment = true;
      const ok = await this.bookingsRepository.save(ticket);
      console.log(ok);
      return await this.bookingsRepository.save(ok);
    }
    return new BadRequestException(`Ticket not found`);
  }
}
