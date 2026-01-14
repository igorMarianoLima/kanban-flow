import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from '../auth/hash.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,

    private readonly hashService: HashService,
  ) {}

  async create(payload: CreateUserDto) {
    const password = await this.hashService.hash(payload.password);

    const user = this.repository.create({
      ...payload,
      password,
    });

    return this.repository.save(user);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: string) {
    return this.repository.findOneByOrFail({
      id,
    });
  }

  async update(id: string, payload: UpdateUserDto) {
    const user = await this.repository.preload({
      id,
      ...payload,
    });

    if (!user) throw new NotFoundException('User not found');

    return this.repository.save(user);
  }

  async remove(id: string) {
    const user = await this.repository.findOneBy({
      id,
    });

    if (!user) throw new NotFoundException('User not found');

    user.isActive = false;

    return this.repository.save(user);
  }

  async findOneByEmail(email: string) {
    const user = await this.repository.findOneBy({
      email,
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
