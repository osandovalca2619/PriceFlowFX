// forexTradingApi/src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserProfilesController } from './user-profiles.controller'; // ✅ AGREGADO
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity'; // ✅ AGREGADO
import { HashService } from '../common/services/hash.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserProfile, // ✅ AGREGADO: Incluir UserProfile en el módulo
    ]),
  ],
  controllers: [
    UsersController,
    UserProfilesController, // ✅ AGREGADO: Controlador para perfiles
  ],
  providers: [
    UsersService,
    HashService,
  ],
  exports: [
    UsersService,
    TypeOrmModule, // Para que otros módulos puedan usar User y UserProfile repositories
  ],
})
export class UsersModule {}