import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}