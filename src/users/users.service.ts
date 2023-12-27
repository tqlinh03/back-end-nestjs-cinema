import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  getHashPassword = (password: string) => {
    const saltOrRounds = 10;
    const hash = bcrypt.hashSync(password, saltOrRounds);
    return hash;
  };

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const isExists = await this.usersRepository.findOne({
      where: { email },
    });

    if (isExists) {
      throw new BadRequestException('email đã tồn tại!');
    }
    const newUser = await this.usersRepository.create({
      ...createUserDto,
      password: this.getHashPassword(password),
    });
    await this.usersRepository.save(newUser);

    return newUser;
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<User>> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user._id',
        'user.name',
        'user.email',
        'user.address',
        'user.gender',
      ])
      .orderBy('user._id');

    return paginate<User>(queryBuilder, options);
  }

  async findOne(_id: number) {
    const user = await this.usersRepository.findOne({
      where: { _id },
      select: {
        _id: true,
        name: true,
        email: true,
        address: true,
        gender: true,
      },
    });
    if (!user) {
      throw new BadRequestException(`không tìm thấy user id = ${_id}`);
    }
    return user;
  }

  async update(_id: number, updateUserDto: UpdateUserDto) {
    const { email } = updateUserDto;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      throw new BadRequestException(`Email đã tồn tại`);
    }
    return await this.usersRepository.update(_id, updateUserDto);
  }

  async remove(_id: number) {
    const user = await this.usersRepository.softDelete({ _id });
    await this.usersRepository.update(_id, { isActive: false });
    return user;
  }

  async restore(_id: number) {
    const user = await this.usersRepository.restore({ _id });
    await this.usersRepository.update(_id, { isActive: true });
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: {
        _id: true,
        name: true,
        email: true,
        address: true,
        gender: true,
        password: true,
      },
      // relations: ['role'],
    });
    if (!user) {
      throw new BadRequestException('email, password không đúng!');
    }

    return user;
  }

  isValidPassword(password: string, hash: string) {
    const comparePassword = bcrypt.compareSync(password, hash);
    if (comparePassword == false) {
      throw new BadRequestException('email, password không đúng!');
    }
    return comparePassword;
  }

  updateUserToken = async (refreshToken: string, _id: number) => {
    const updateToken: UpdateResult = await this.usersRepository.update(
      { _id },
      { refreshToken },
    );
    return updateToken;
  };

   findUserByToken = async (refreshToken: string) => {
    const user = await this.usersRepository.findOne({
      where: { refreshToken },
    });
    if (!user) {
      throw new BadRequestException('Không tìm thấy user by Token!');
    }
    return user;
  }
}
