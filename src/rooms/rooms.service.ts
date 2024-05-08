import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}
  async create(createRoomDto: CreateRoomDto) {
    const { name } = createRoomDto;
    const isExists = await this.roomsRepository.findOne({where: {name}})
    if(isExists) {
      throw new BadRequestException(`name = ${name} already exists!`)
    }
    const newRoom = await this.roomsRepository.create({
      ...createRoomDto,
    })
    await this.roomsRepository.save(newRoom)
    
    return {
      _id: newRoom?._id,
      createAt: newRoom?.createdAt,
    };
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Room>> {
    const queryBuilder = this.roomsRepository
      .createQueryBuilder('room')
      .orderBy('room._id');

    return paginate<Room>(queryBuilder, options);
  }

  findOne(_id: number) {
    return this.roomsRepository.findOne({
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

  async update(_id: number, updateRoomDto: UpdateRoomDto) {
    // const { permissions} = updateSeatDto
    const room = await this.roomsRepository.findOne({
      where: {_id},
    })
    if(!room) {
      return new BadRequestException(`Not found room id=${_id}`)
    }

    // const newPermission = await this.permissionService.findByIds(permissions)
    const updateRole = await Object.assign(room, updateRoomDto)
    // updateRole.permissions = newPermission

    return await this.roomsRepository.save(updateRole)
  }

  async remove(_id: number) {
    const seat = await this.roomsRepository.findOne({
      where: {_id},
    })
    if(seat) {
      return new BadRequestException(`Not found seat id=${_id}`)
    }
    return this.roomsRepository.delete({_id});
  }
}
