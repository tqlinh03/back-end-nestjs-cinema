import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';
import { Between, Repository } from 'typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private showtimesRepository: Repository<Showtime>,
  ) {}
  async create(createShowtimeDto: CreateShowtimeDto) {
    const newShowtime = await this.showtimesRepository.create({
      ...createShowtimeDto,
    })
    await this.showtimesRepository.save(newShowtime)
    
    return {
      _id: newShowtime?._id,
      createAt: newShowtime?.createdAt,
    };
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Showtime>> {
    const queryBuilder = this.showtimesRepository
      .createQueryBuilder('showtime')
      .orderBy('showtime._id');

    return paginate<Showtime>(queryBuilder, options);
  }

  findAllByDate(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23,59,59,999);


    return this.showtimesRepository.find({
      where:{
        date: Between(startOfDay, endOfDay)
      },
      relations: {
        movie: true
      },
      order: {
        start_time: 'ASC'
      }
    });
  }

  findOneByIdAndDate(id: number,date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23,59,59,999);

console.log("id", id)
    return this.showtimesRepository.find({
      where:{
        date: Between(startOfDay, endOfDay),
        movie: {
          _id: id
        }
      },
      relations: {
        movie: true
      },
      order: {
        start_time: 'ASC'
      }
    });
  }

  async update(_id: number, updateShowtimeDto: UpdateShowtimeDto) {
    // const { permissions} = updateSeatDto
    // const role = await this.showtimesRepository.findOne({
    //   where: {_id},
    //   relations: {
    //     permissions: true
    //   } 
    // })

    // const newPermission = await this.permissionService.findByIds(permissions)
    // const updateRole = await Object.assign(role, updateRoleDto)
    // updateRole.permissions = newPermission

    // return await this.showtimesRepository.save(updateRole)
  }

  async remove(_id: number) {
    const seat = await this.showtimesRepository.findOne({
      where: {_id},
    })
    if(seat) {
      return new BadRequestException(`Not found seat id=${_id}`)
    }
    return this.showtimesRepository.delete({_id});
  }
}
