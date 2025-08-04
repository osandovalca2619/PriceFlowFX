import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, MaxLength, IsInt, IsIn } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Unique username',
    example: 'johndoe_updated',
    minLength: 3,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(50, { message: 'Username must not exceed 50 characters' })
  username?: string;

  @ApiPropertyOptional({
    description: 'User full name',
    example: 'John Doe Updated',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Full name must be a string' })
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  fullName?: string;

  @ApiPropertyOptional({
    description: 'User profile ID',
    example: 2,
  })
  @IsOptional()
  @IsInt({ message: 'Profile ID must be an integer' })
  profileId?: number;

  @ApiPropertyOptional({
    description: 'Sales group ID',
    example: 2,
  })
  @IsOptional()
  @IsInt({ message: 'Sales group ID must be an integer' })
  salesGroupId?: number;

  @ApiPropertyOptional({
    description: 'User status',
    example: 'inactivo',
    enum: ['activo', 'inactivo'],
  })
  @IsOptional()
  @IsIn(['activo', 'inactivo'], { message: 'Status must be either "activo" or "inactivo"' })
  status?: 'activo' | 'inactivo';

  @ApiPropertyOptional({
    description: 'User password',
    example: 'NewSecurePassword123!',
    minLength: 8,
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(255, { message: 'Password must not exceed 255 characters' })
  password?: string;
}