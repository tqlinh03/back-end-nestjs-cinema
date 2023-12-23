import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/user.interface';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    // const {email, _id} = user;
    const {name} = createRoleDto;

    const isExists = await this.rolesRepository.findOne({where: {name}})
    if(isExists) {
      throw new BadRequestException(`name = ${name} đã tồn tại!`)
    }

    const newRole = await this.rolesRepository.create({
      ...createRoleDto,
    //  createdBy: {_id, email}
    })
    await this.rolesRepository.save(newRole)
    
    return {
      _id: newRole?._id,
      createAt: newRole?.createdAt,
    };
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
