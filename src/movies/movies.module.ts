import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Showtime } from 'src/showtimes/entities/showtime.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, Showtime])
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
