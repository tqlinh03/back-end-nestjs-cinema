import { BadRequestException, Injectable, UseFilters } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/user.interface';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository, getManager } from 'typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Permission } from 'src/permissions/entities/permission.entity';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private permissionService: PermissionsService
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

  async findAll(options: IPaginationOptions): Promise<Pagination<Role>> {
    const queryBuilder = this.rolesRepository
      .createQueryBuilder('role')
      // .select([
      //   'user._id',
      //   'user.name',
      //   'user.email',
      //   'user.address',
      //   'user.gender',
      // ])
      .orderBy('role._id');

    return paginate<Role>(queryBuilder, options);
  }

  findOne(_id: number) {
    return this.rolesRepository.findOne({
      where:{_id},
      relations: {
        permissions: true
      },
      select: {
        _id: true,
        name: true,
        description: true,
        isActive:true,
        permissions:true
      }
    });
  }

  async update(_id: number, updateRoleDto: UpdateRoleDto) {
    const { permissions} = updateRoleDto
    const role = await this.rolesRepository.findOne({
      where: {_id},
      relations: {
        permissions: true
      } 
    })

    const newPermission = await this.permissionService.findByIds(permissions)
    const updateRole = await Object.assign(role, updateRoleDto)
    updateRole.permissions = newPermission

    return await this.rolesRepository.save(updateRole)
  }

  async remove(_id: number) {
    const role = await this.rolesRepository.findOne({
      where: {_id},
      select: {
        name: true
      }
    })
    if(role && role.name === "SUPER_ADMIN" || role.name === "NORMAL_USER") {
      return new BadRequestException(`Can not delete role name: ${role.name}`)
   }
    return this.rolesRepository.delete({_id});
  }
}
