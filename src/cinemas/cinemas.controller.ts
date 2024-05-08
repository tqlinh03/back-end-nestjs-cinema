import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Cinema } from './entities/cinema.entity';

@Controller('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @Post()
  create(@Body() createCinemaDto: CreateCinemaDto) {
    return this.cinemasService.create(createCinemaDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Cinema>> {
    limit = limit > 100 ? 100 : limit;
    return this.cinemasService.findAll({  
      page,
      limit,
      route: 'http://localhost:8000/api/v1/cinemas',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cinemasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCinemaDto: UpdateCinemaDto) {
    return this.cinemasService.update(+id, updateCinemaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cinemasService.remove(+id);
  }
}
