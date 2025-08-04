import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { HashService } from '../common/services/hash.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    HashService, // ✅ Agregar HashService como provider
  ],
  exports: [
    UsersService,
    TypeOrmModule, // Para que otros módulos puedan usar User repository
  ],
})
export class UsersModule {}