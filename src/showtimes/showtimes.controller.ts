import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Showtime } from './entities/showtime.entity';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimesService.create(createShowtimeDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Showtime>> {
    limit = limit > 100 ? 100 : limit;
    return this.showtimesService.findAll({
      page,
      limit,
      route: 'http://localhost:8000/api/v1/showtimes',
    });
  }

  @Get(':date')
  findAllByDate(@Param('date') date: Date) {
    return this.showtimesService.findAllByDate(date);
  }

  @Get('detail/:id/:date')
  findOneByIdAndDate(@Param('id') id: number, @Param('date') date: Date) {
    return this.showtimesService.findOneByIdAndDate(id, date);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    return this.showtimesService.update(+id, updateShowtimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showtimesService.remove(+id);
  }
}
