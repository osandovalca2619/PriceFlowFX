import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength, IsInt, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique username',
    example: 'johndoe',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(50, { message: 'Username must not exceed 50 characters' })
  username: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  fullName: string;

  @ApiProperty({
    description: 'User profile ID',
    example: 1,
  })
  @IsNotEmpty({ message: 'Profile ID is required' })
  @IsInt({ message: 'Profile ID must be an integer' })
  profileId: number;

  @ApiPropertyOptional({
    description: 'Sales group ID',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Sales group ID must be an integer' })
  salesGroupId?: number;

  @ApiPropertyOptional({
    description: 'User status',
    example: 'activo',
    enum: ['activo', 'inactivo'],
    default: 'activo',
  })
  @IsOptional()
  @IsIn(['activo', 'inactivo'], { message: 'Status must be either "activo" or "inactivo"' })
  status?: 'activo' | 'inactivo';

  @ApiProperty({
    description: 'ID of user creating this record',
    example: 1,
  })
  @IsNotEmpty({ message: 'Created by is required' })
  @IsInt({ message: 'Created by must be an integer' })
  createdBy: number;

  // Solo si eliges la Opción 1 (agregar password a la tabla)
  @ApiPropertyOptional({
    description: 'User password',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(255, { message: 'Password must not exceed 255 characters' })
  password?: string;
}