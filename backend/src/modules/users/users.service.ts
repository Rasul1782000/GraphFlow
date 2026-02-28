import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) { }
    async findByEmail(email: string): Promise<User | null> { return this.userRepo.findOne({ where: { email } }); }
    async findById(id: string): Promise<User | null> { return this.userRepo.findOne({ where: { id } }); }
    async create(data: Partial<User>): Promise<User> { return this.userRepo.save(this.userRepo.create(data)); }
    async updateRefreshToken(id: string, token: string) { await this.userRepo.update(id, { refresh_token: token }); }
    async clearRefreshToken(id: string) { await this.userRepo.update(id, { refresh_token: null as any }); }
}
