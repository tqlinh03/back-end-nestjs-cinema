import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cinema } from './entities/cinema.entity';
import { Repository } from 'typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class CinemasService {
  constructor(
    @InjectRepository(Cinema)
    private cinemasRepository: Repository<Cinema>,
  ){}
  async create(createCinemaDto: CreateCinemaDto) {
    const { name } = createCinemaDto;
    const isExists = await this.cinemasRepository.findOne({where:{name}})
    if(isExists) {
      return new BadRequestException("Name already exists!")
    }
    const cinema = await this.cinemasRepository.create({...createCinemaDto})
    await this.cinemasRepository.save(cinema)
    return cinema;
  }

  
  async findAll(options: IPaginationOptions): Promise<Pagination<Cinema>> {
    const queryBuilder = this.cinemasRepository
      .createQueryBuilder('role')
      .orderBy('role._id');

    return paginate<Cinema>(queryBuilder, options);
  }

  findOne(_id: number) {
    return this.cinemasRepository.findOne({
      // where:{_id},
      // relations: {
      //   permissions: true
      // },
      // select: {
      //   _id: true,
      //   name: true,
      //   description: true,
      //   isActive:true,
      //   permissions:true
      // }
    });
  }

  async update(_id: number, updateCinemaDto: UpdateCinemaDto) {
    const cinema = await this.cinemasRepository.findOne({
      where: {_id},
    })
    const updateCinema = await Object.assign(cinema, updateCinemaDto)

    return await this.cinemasRepository.save(updateCinema)
  }

  async remove(_id: number) {
    const cinema = await this.cinemasRepository.findOne({
      where: {_id},
    })
    if(!cinema) {
      return new BadRequestException(`Not found cinema id=${_id} `)
    }
    return this.cinemasRepository.delete({_id});
  }
}
