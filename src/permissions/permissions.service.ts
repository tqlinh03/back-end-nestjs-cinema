import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { In, Repository } from 'typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto) {
    const { name} = createPermissionDto;

    const permission = await this.permissionsRepository.findOne({
      where: {name},
    })
    if(permission && permission.name === name) {
      return new BadRequestException(`Name = ${name} đã tồn tại!`);
    }
    const newPermission = await this.permissionsRepository.create({...createPermissionDto})
    return await this.permissionsRepository.save(newPermission);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Permission>> {
    const queryBuilder = this.permissionsRepository
      .createQueryBuilder('permission')
      // .select([
      //   'user._id',
      //   'user.name',
      //   'user.email',
      //   'user.address',
      //   'user.gender',
      // ])
      .orderBy('permission._id');

    return paginate<Permission>(queryBuilder, options);
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  async findByIds(isd: Permission[]) {
    return await this.permissionsRepository.findBy({_id: In(isd)})
  }

  async update(_id: number, updatePermissionDto: UpdatePermissionDto) {
    return await this.permissionsRepository.update(_id,updatePermissionDto);
  }

  async remove(_id: number) {
    return await this.permissionsRepository.delete({_id});
  }
}
