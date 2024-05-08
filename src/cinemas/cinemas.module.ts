import { Module } from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { CinemasController } from './cinemas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cinema } from './entities/cinema.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cinema])
  ],
  controllers: [CinemasController],
  providers: [CinemasService],
})
export class CinemasModule {}
