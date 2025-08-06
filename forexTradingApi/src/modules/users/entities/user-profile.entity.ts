// forexTradingApi/src/modules/users/entities/user-profile.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('user_profile')
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string;

  // Relación: Un perfil puede tener muchos usuarios
  @OneToMany(() => User, user => user.profile, {
    eager: false, // No cargar usuarios automáticamente
  })
  users: User[];
}