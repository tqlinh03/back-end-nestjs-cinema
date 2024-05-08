import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Between, Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Showtime } from 'src/showtimes/entities/showtime.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(Showtime)
    private showtimesRepository: Repository<Showtime>,
  ) {}
  async create(createMovieDto: CreateMovieDto) {
    const { name } = createMovieDto;
    const isExists = await this.moviesRepository.findOne({ where: { name } });
    if (isExists) {
      throw new BadRequestException(`name = ${name} already exists!`);
    }
    const newSeat = await this.moviesRepository.create({
      ...createMovieDto,
    });
    await this.moviesRepository.save(newSeat);

    return {
      _id: newSeat?._id,
      createAt: newSeat?.createdAt,
    };
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Movie>> {
    const queryBuilder = this.moviesRepository
      .createQueryBuilder('movie')
      .orderBy('movie._id');

    return paginate<Movie>(queryBuilder, options);
  }

  async findOne(_id: number) {
    const movie = await this.moviesRepository.findOne({
      where: {
        _id,
      },
      relations: {
        showtimes: true,
      },
    });
    if (!movie) {
      return new BadRequestException(`not founf movie id=${_id}`);
    }
    return movie;
  }

  async update(_id: number, updateMovieDto: UpdateMovieDto) {
    // const { permissions} = updateSeatDto
    const movie = await this.moviesRepository.findOne({
      where: { _id },
      // relations: {
      //   permissions: true
      // }
    });
    if (!movie) {
      return new BadRequestException('Can not update movie');
    }

    // const newPermission = await this.permissionService.findByIds(permissions)
    const updateMovie = await Object.assign(movie, updateMovieDto);
    // updateRole.permissions = newPermission

    return await this.moviesRepository.save(updateMovie);
  }

  async remove(_id: number) {
    const movie = await this.moviesRepository.findOne({
      where: { _id },
    });
    if (movie) {
      return new BadRequestException(`Not found movie id=${_id}`);
    }
    return this.moviesRepository.delete({ _id });
  }
}
